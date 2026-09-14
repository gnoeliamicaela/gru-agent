import type { MessageContent } from "@/lib/chat/types";
import StaffEmailPreview from "./StaffEmailPreview";
import type { StaffEmailData } from "@/lib/email/mail-builder";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: MessageContent;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  const isString = typeof content === "string";
  const isStaffEmail = !isString && (content as any).type === "staff-email";

  // Render staff email preview - full width, not in bubble
  if (isStaffEmail) {
    const emailData = (content as any).data as StaffEmailData;
    return (
      <div className="flex justify-center">
        <StaffEmailPreview email={emailData} />
      </div>
    );
  }

  // Render regular text message
  const textContent = isString ? content : String(content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{textContent}</p>
      </div>
    </div>
  );
}
