import { db } from "./firestore.js";

/**
 * Logs a chat exchange to Firestore. Never throws — logging failures must
 * not affect the chat response itself. Callers should await this so the
 * write completes before the serverless function freezes after the response.
 */
export async function logChatMessage(userMessage, reply) {
    if (!db) return;

    try {
        await db.collection("chatLogs").add({
            userMessage,
            reply,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Failed to log chat message:", error);
    }
}
