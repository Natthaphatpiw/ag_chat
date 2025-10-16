// In-memory storage for sessions (in production, use Redis or database)
export const sessions = new Map();

export function generateSessionId() {
  return crypto.randomUUID();
}

export function createSession() {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    created: new Date(),
    messages: []
  });
  return sessionId;
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId: string) {
  return sessions.delete(sessionId);
}
