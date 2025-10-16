import { ChatMessage } from "./chat-message";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-to-bottom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const ChatMessages = ({
  messages,
  isLoading,
  status,
}: {
  messages: Message[];
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
}) => {
  const [containerRef, endRef] = useScrollToBottom();

  // If no messages yet, show welcome message
  if (messages.length === 0) {
    return (
      <div className="flex-1 py-8 space-y-4 h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            ยินดีต้อนรับสู่ AI Medical Assistant
          </h2>
          <p className="text-muted-foreground">
            ฉันพร้อมช่วยตอบคำถามด้านสุขภาพของคุณ กรุณาพิมพ์คำถามด้านล่าง
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto flex-1 py-8 pt-20 space-y-4 h-full"
      ref={containerRef}
    >
      <div className="mx-auto max-w-xl">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            isLatestMessage={i === messages.length - 1}
            isLoading={isLoading}
            message={m}
            status={status}
          />
        ))}
        <div className="h-1" ref={endRef} />
      </div>
    </div>
  );
};
