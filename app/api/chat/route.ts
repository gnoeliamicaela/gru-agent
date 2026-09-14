import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropicClient, MODEL_ID } from "@/lib/anthropic-client";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { TOOL_DEFINITIONS } from "@/lib/tools/tool-definitions";
import { executeTool } from "@/lib/tools/tool-executors";
import { escalateToStaff } from "@/lib/tools/tool-executors";
import { truncateHistory } from "@/lib/chat/history";
import type { ChatRequest, ChatResponse } from "@/lib/chat/types";
import { getParticipantById } from "@/lib/airtable-service";

const chatRequestSchema = z.object({
  participant_id: z.string(),
  message: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.union([
        z.string(),
        z.object({
          type: z.string(),
          data: z.unknown(),
        }),
      ]),
    }),
  ),
});

const MAX_TOOL_TURNS = Number(process.env.CHAT_MAX_TOOL_TURNS || 5);
const MAX_TOKENS = Number(process.env.CHAT_MAX_TOKENS || 600);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = chatRequestSchema.parse(body);

    const { participant_id, message, history } = validated;

    // Verify participant exists
    const participant = await getParticipantById(participant_id);
    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    // Build system block with cache control
    const systemBlocks: Anthropic.TextBlockParam[] = [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ];

    // Build message history, truncate if needed
    const truncatedHistory = truncateHistory(history);
    let messages: Anthropic.MessageParam[] = [
      ...truncatedHistory.map((m) => ({
        role: m.role,
        content: typeof m.content === "string"
          ? m.content
          : "[Se mostró previsualización de mail]",
      })),
      { role: "user", content: message },
    ];

    let escalated = false;
    let toolTurns = 0;
    let emailPreview: { type: string; data: unknown } | null = null;

    // Main tool-use loop
    while (true) {
      const response = await anthropicClient.messages.create({
        model: MODEL_ID,
        max_tokens: MAX_TOKENS,
        system: systemBlocks,
        tools: TOOL_DEFINITIONS,
        messages,
      });

      // Log token usage for debugging
      console.log(`[${participant_id}] Token usage:`, {
        input_tokens: response.usage.input_tokens,
        cache_creation_input_tokens: response.usage.cache_creation_input_tokens,
        cache_read_input_tokens: response.usage.cache_read_input_tokens,
        output_tokens: response.usage.output_tokens,
      });

      if (response.stop_reason === "tool_use") {
        toolTurns++;

        // Check if we've exceeded the maximum tool turns
        if (toolTurns > MAX_TOOL_TURNS) {
          // Direct escalation without another model call
          const escalateResult = await escalateToStaff(participant_id, {
            question: message,
            reason: "Se alcanzó el límite de turnos de herramientas sin resolver la consulta.",
          });

          escalated = true;

          return NextResponse.json({
            reply:
              "Che, esto se puso más complicado de lo que pensé — ya se lo derivé a un asesor " +
              "del programa para que te ayude con esto puntual. Te van a contactar pronto.",
            escalated,
          } satisfies ChatResponse);
        }

        // Push assistant's response (with full content including tool_use blocks)
        messages.push({
          role: "assistant",
          content: response.content,
        });

        // Extract and execute tools
        const toolUseBlocks = response.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
        );

        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of toolUseBlocks) {
          const result = await executeTool(block.name, block.input, {
            participantId: participant_id,
          });

          if (block.name === "escalate_to_staff") {
            escalated = true;
            try {
              const resultData = JSON.parse(result);
              if (resultData.email) {
                emailPreview = {
                  type: "staff-email",
                  data: resultData.email,
                };
              }
            } catch (e) {
              // result parsing failed, ignore
            }
          }

          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }

        // Push all tool results in a single user message
        messages.push({
          role: "user",
          content: toolResults,
        });

        // Continue the loop
        continue;
      }

      // stop_reason is "end_turn" or other completion
      const textBlock = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === "text",
      );

      const reply =
        textBlock?.text ||
        "Perdón, tuve un problema para responder. ¿Podés reformular la pregunta?";

      const chatResponse: ChatResponse = {
        reply,
        escalated,
        ...(emailPreview ? { emailPreview } : {}),
      };

      return NextResponse.json(chatResponse);
    }
  } catch (error) {
    console.error("Chat endpoint error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
