import { Client, middleware } from '@line/bot-sdk';
import { sessions, generateSessionId } from '@/lib/session';
import crypto from 'crypto';

// LINE configuration
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: '81893e02e450aeda4b4b9bcc61ee3400',
};

const client = new Client(config);

// Verify LINE signature
function verifySignature(body: string, signature: string, channelSecret: string): boolean {
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// Handle chat with external AI server
async function handleChat(message: string, sessionId: string) {
  try {
    // Call the medical API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 85000); // 85 seconds timeout

    const medicalApiResponse = await fetch("http://40.81.244.202:8001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: message,
        session_id: sessionId,
        top_k: 3
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!medicalApiResponse.ok) {
      console.error("Medical API error:", medicalApiResponse.status);
      return "ขออภัย ไม่สามารถเชื่อมต่อกับระบบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
    }

    const medicalData = await medicalApiResponse.json();
    console.log("Medical API response:", medicalData);

    // Extract response
    return medicalData.response || "ไม่สามารถรับข้อมูลได้ในขณะนี้";
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error && error.name === 'AbortError'
      ? "AI server ใช้เวลาตอบนานเกินไป กรุณาลองใหม่อีกครั้ง"
      : "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง";
    return errorMessage;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('X-Line-Signature') || '';

    // Verify signature
    if (!verifySignature(body, signature, config.channelSecret)) {
      console.error('Invalid signature');
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const events = JSON.parse(body).events;

    // Process each event
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userId = event.source.userId;
        const messageText = event.message.text;

        // Create or get session for user
        let sessionId = `line_${userId}`;
        if (!sessions.has(sessionId)) {
          sessions.set(sessionId, {
            created: new Date(),
            messages: []
          });
        }

        const session = sessions.get(sessionId);

        // Add user message to session
        session.messages.push({
          role: 'user',
          content: messageText,
          timestamp: new Date()
        });

        // Get AI response
        const aiResponse = await handleChat(messageText, sessionId);

        // Add assistant message to session
        session.messages.push({
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        });

        // Reply to LINE
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: aiResponse
        });
      }
    }

    return Response.json({ status: 'ok' });
  } catch (error) {
    console.error('LINE webhook error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Line-Signature",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
