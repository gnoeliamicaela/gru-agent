export type MessageContent = string | { type: string; data: unknown };

export interface ChatMessage {
  role: "user" | "assistant";
  content: MessageContent;
}

export interface ChatRequest {
  participant_id: string;
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  emailPreview?: { type: string; data: unknown };
  escalated: boolean;
}
