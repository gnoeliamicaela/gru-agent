import type { ChatMessage } from "./types";

const MAX_HISTORY_MESSAGES = 12;

export function truncateHistory(history: ChatMessage[]): ChatMessage[] {
  return history.slice(-MAX_HISTORY_MESSAGES);
}
