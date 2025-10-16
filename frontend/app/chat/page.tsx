"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { Header } from "@/components/header";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

function ChatPageContent() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const hasSentInitialMessageRef = useRef(false);

  // Load session ID from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chat_session_id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  // Send initial message if provided from landing page
  useEffect(() => {
    if (initialMessage && !hasSentInitialMessageRef.current) {
      hasSentInitialMessageRef.current = true;
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Start new chat function
  const handleStartNewChat = async () => {
    try {
      const response = await fetch('https://ag-chat-alpha.vercel.app/session/new', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create new session');
      }

      const data = await response.json();
      const newSessionId = data.session_id;

      // Update session ID
      setSessionId(newSessionId);
      localStorage.setItem('chat_session_id', newSessionId);

      // Clear messages
      setMessages([]);

      // Reset initial message flag
      hasSentInitialMessageRef.current = false;

    } catch (error) {
      console.error('Error creating new session:', error);
      toast.error("เกิดข้อผิดพลาดในการสร้างแชทใหม่ กรุณาลองใหม่อีกครั้ง", {
        position: "top-center",
        richColors: true,
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add thinking message
    const thinkingMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // Call backend directly
      const response = await fetch("https://ag-chat-alpha.vercel.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
          session_id: sessionId, // Send current session ID if exists
        }),
      });

      if (!response.ok) {
        throw new Error("Backend API error");
      }

      const backendData = await response.json();
      const medicalResponse = backendData.response || "ไม่สามารถรับข้อมูลได้ในขณะนี้";

      // Update session ID from response
      if (backendData.session_id) {
        setSessionId(backendData.session_id);
        localStorage.setItem('chat_session_id', backendData.session_id);
      }

      // Simulate streaming effect
      const words = medicalResponse.split(" ");
      let currentContent = "";

      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? " " : "") + words[i];

        setMessages(prev =>
          prev.map(msg =>
            msg.id === thinkingMessage.id
              ? { ...msg, content: currentContent, isStreaming: i < words.length - 1 }
              : msg
          )
        );

        // Add small delay for streaming effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Final update to mark as completed
      setMessages(prev =>
        prev.map(msg =>
          msg.id === thinkingMessage.id
            ? { ...msg, content: medicalResponse, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง", {
        position: "top-center",
        richColors: true,
      });

      setMessages(prev =>
        prev.map(msg =>
          msg.id === thinkingMessage.id
            ? {
                ...msg,
                content: "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง",
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const messageText = input.trim();
      setInput("");
      handleSendMessage(messageText);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-dvh stretch bg-background">
      <Header
        onNewChat={handleStartNewChat}
        showNewChat={true}
      />
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        status={isLoading ? "streaming" : "ready"}
      />
      <form
        onSubmit={handleSubmit}
        className="px-4 pb-8 mx-auto w-full max-w-2xl bg-transparent sm:px-0"
      >
        <ChatInput
          handleInputChange={(e) => setInput(e.currentTarget.value)}
          input={input}
          isLoading={isLoading}
          status={isLoading ? "streaming" : "ready"}
          stop={() => setIsLoading(false)}
        />
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center w-full h-dvh stretch bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
