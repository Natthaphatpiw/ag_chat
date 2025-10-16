import { createSession } from '@/lib/session';

export async function POST() {
  try {
    const sessionId = createSession();

    console.log(`New session created: ${sessionId}`);

    return Response.json({
      session_id: sessionId,
      message: "New session created"
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
