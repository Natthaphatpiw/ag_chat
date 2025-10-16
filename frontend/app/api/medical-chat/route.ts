import { UIMessage } from "ai";

export const maxDuration = 90;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userQuestion = lastMessage.parts?.find((p) => p.type === "text")?.text || "";

    // Call the backend API (port 8000)
    const backendResponse = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userQuestion,
      }),
      signal: AbortSignal.timeout(90000), // 90 second timeout
    });

    if (!backendResponse.ok) {
      throw new Error("Backend API error");
    }

    const backendData = await backendResponse.json();
    const medicalResponse = backendData.response || "ไม่สามารถรับข้อมูลได้ในขณะนี้";

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send the response in AI SDK format
        const messageId = crypto.randomUUID();

        // Send the message start
        controller.enqueue(
          encoder.encode(`0:${JSON.stringify({ id: messageId, role: "assistant", parts: [] })}\n`)
        );

        // Split the response by newlines and send word by word for streaming effect
        const words = medicalResponse.split(" ");
        let currentText = "";

        words.forEach((word: string, index: number) => {
          currentText += (index > 0 ? " " : "") + word;
          controller.enqueue(
            encoder.encode(`2:${JSON.stringify({ type: "text", text: currentText })}\n`)
          );
        });

        // Send finish
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (error) {
    console.error("Error in medical chat:", error);

    const encoder = new TextEncoder();
    const errorStream = new ReadableStream({
      start(controller) {
        const messageId = crypto.randomUUID();
        controller.enqueue(
          encoder.encode(`0:${JSON.stringify({ id: messageId, role: "assistant", parts: [] })}\n`)
        );
        controller.enqueue(
          encoder.encode(`2:${JSON.stringify({ type: "text", text: "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง" })}\n`)
        );
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  }
}
