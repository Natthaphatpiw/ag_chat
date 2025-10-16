"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Textarea } from "./textarea";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { Header } from "./header";
import { toast } from "sonner";

export default function Chat() {
  const [input, setInput] = useState("");
  const { sendMessage, messages, status, stop } = useChat({
    onError: (error) => {
      toast.error(
        error.message.length > 0
          ? error.message
          : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        { position: "top-center", richColors: true },
      );
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col justify-center w-full h-dvh stretch bg-background">
      <Header />
      {messages.length === 0 ? (
        <div className="mx-auto w-full max-w-2xl">
          <ProjectOverview />
        </div>
      ) : (
        <Messages messages={messages} isLoading={isLoading} status={status} />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
        className="px-4 pb-8 mx-auto w-full max-w-2xl bg-transparent sm:px-0"
      >
        <Textarea
          handleInputChange={(e) => setInput(e.currentTarget.value)}
          input={input}
          isLoading={isLoading}
          status={status}
          stop={stop}
        />
      </form>
    </div>
  );
}
