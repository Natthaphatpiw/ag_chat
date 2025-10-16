import { getSession, deleteSession } from '@/lib/session';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    const session = getSession(sessionId);
    if (!session) {
      return Response.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Delete session
    deleteSession(sessionId);

    console.log(`Session ${sessionId} cleared`);

    return Response.json({
      message: `Session ${sessionId} cleared`
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    return Response.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
