"use client";

import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";

import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const PureChatMessage = ({
  message,
}: {
  message: Message;
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
  isLatestMessage: boolean;
}) => {
  return (
    <AnimatePresence key={message.id}>
      <motion.div
        className="px-4 mx-auto w-full group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={`message-${message.id}`}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            "group-data-[role=user]/message:w-fit",
          )}
        >
          {message.role === "assistant" && (
            <div className="flex justify-center items-center rounded-full ring-1 size-8 shrink-0 ring-border bg-background">
              <div className="">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4 w-full">
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={`message-${message.id}-content`}
              className="flex flex-row gap-2 items-start pb-4 w-full"
            >
              <div
                className={cn("flex flex-col gap-4", {
                  "bg-secondary text-secondary-foreground px-3 py-2 rounded-tl-xl rounded-tr-xl rounded-bl-xl":
                    message.role === "user",
                })}
              >
                {message.isStreaming && message.content === "" ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">กำลังคิด...</span>
                  </div>
                ) : (
                  <>
                    <Markdown>{message.content}</Markdown>
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const ChatMessage = memo(PureChatMessage, (prevProps, nextProps) => {
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;

  return true;
});
