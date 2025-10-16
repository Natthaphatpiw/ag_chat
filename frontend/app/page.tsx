"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectOverview } from "@/components/project-overview";
import { Header } from "@/components/header";
import { ChatInput } from "@/components/chat-input";

export default function Page() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const encodedMessage = encodeURIComponent(input.trim());
      router.push(`/chat?message=${encodedMessage}`);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-dvh stretch bg-background">
      <Header />
      <div className="mx-auto w-full max-w-2xl">
        <ProjectOverview />
      </div>
      <form
        onSubmit={handleSubmit}
        className="px-4 pb-8 mx-auto w-full max-w-2xl bg-transparent sm:px-0"
      >
        <ChatInput
          handleInputChange={(e) => setInput(e.currentTarget.value)}
          input={input}
          isLoading={false}
          status="ready"
          stop={() => {}}
        />
      </form>
    </div>
  );
}
