import { z } from "zod";
import { getParticipantById } from "@/lib/airtable-service";
import { getStageRequirements } from "@/lib/stage-requirements";
import { getFaq } from "@/lib/faq-data";
import { buildStaffEmail } from "@/lib/email/mail-builder";
import type {
  ParticipantStatusResult,
  StageRequirementsResult,
  FaqResult,
  EscalateResult,
} from "@/lib/tools/types";

const stageRequirementsInputSchema = z.object({
  etapa: z.string().optional(),
});

const faqInputSchema = z.object({
  topic: z.string(),
});

const escalateInputSchema = z.object({
  motivo: z.string(),
});

export async function getParticipantStatus(
  participantId: string,
): Promise<ParticipantStatusResult> {
  try {
    const participant = await getParticipantById(participantId);

    if (!participant) {
      return { found: false };
    }

    return {
      found: true,
      participant_id: participant.id,
      nombre: participant.nombre,
      etapa_actual: participant.etapa_actual,
      items: participant.items.map((item) => ({
        tipo: item.tipo,
        nombre: item.nombre,
        estado: item.estado,
        comentario: item.comentario,
      })),
    };
  } catch (error) {
    console.error("Error in getParticipantStatus:", error);
    return { found: false };
  }
}

export async function getStageRequirementsTool(
  input: unknown,
): Promise<StageRequirementsResult> {
  try {
    const validated = stageRequirementsInputSchema.parse(input);

    if (!validated.etapa) {
      const allStages = getStageRequirements();
      if (!Array.isArray(allStages)) {
        return { found: false };
      }
      return {
        found: true,
        catalogo_completo: allStages.map((stage) => ({
          etapa: stage.etapa,
          orden_etapa: stage.orden_etapa,
          items: stage.items,
        })),
      };
    }

    const stage = getStageRequirements(validated.etapa);
    if (!stage || Array.isArray(stage)) {
      return { found: false };
    }

    return {
      found: true,
      etapa: stage.etapa,
      orden_etapa: stage.orden_etapa,
      items: stage.items,
    };
  } catch (error) {
    console.error("Error in getStageRequirementsTool:", error);
    return { found: false };
  }
}

export async function getFaqTool(input: unknown): Promise<FaqResult> {
  try {
    const validated = faqInputSchema.parse(input);
    const entry = getFaq(validated.topic);

    if (!entry) {
      return { found: false };
    }

    return {
      found: true,
      topic: entry.topic,
      proposito: entry.proposito,
      que_implica: entry.que_implica,
      dudas_comunes: entry.dudas_comunes,
    };
  } catch (error) {
    console.error("Error in getFaqTool:", error);
    return { found: false };
  }
}

export async function escalateToStaff(
  participantId: string,
  input: unknown,
): Promise<EscalateResult> {
  try {
    const validated = escalateInputSchema.parse(input);
    const participant = await getParticipantById(participantId);

    if (!participant) {
      return { escalated: true, delivered: false };
    }

    // Build the staff email data
    const emailData = buildStaffEmail({
      nombre_participante: participant.nombre,
      etapa_actual: participant.etapa_actual,
      motivo: validated.motivo,
    });

    // Send to webhook if configured
    const webhookUrl = process.env.N8N_WEBHOOK_ESCALATION_URL;
    let delivered = false;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant_id: participantId,
            ...emailData,
            timestamp: new Date().toISOString(),
          }),
        });

        delivered = response.ok;
      } catch (fetchError) {
        console.error("Failed to POST to N8N webhook:", fetchError);
      }
    } else {
      console.log(
        "N8N_WEBHOOK_ESCALATION_URL not set; escalation logged but not delivered:",
        { participant_id: participantId, ...emailData },
      );
    }

    return { escalated: true, delivered, email: emailData };
  } catch (error) {
    console.error("Error in escalateToStaff:", error);
    return { escalated: true, delivered: false };
  }
}

export async function executeTool(
  name: string,
  input: unknown,
  context: { participantId: string },
): Promise<string> {
  switch (name) {
    case "get_participant_status":
      return JSON.stringify(await getParticipantStatus(context.participantId));
    case "get_stage_requirements":
      return JSON.stringify(await getStageRequirementsTool(input));
    case "get_faq":
      return JSON.stringify(await getFaqTool(input));
    case "escalate_to_staff":
      return JSON.stringify(await escalateToStaff(context.participantId, input));
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
