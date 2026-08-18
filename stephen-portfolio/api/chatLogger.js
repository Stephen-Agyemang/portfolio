import { pipeline, redisAvailable } from "./upstash.js";

/** Newest-first list of chat exchanges, capped so it can never grow unbounded. */
const LOG_KEY = "chatLogs";
const MAX_RETAINED = 500;

/**
 * Logs a chat exchange. Never throws — logging failures must not affect the
 * chat response itself. Callers should await this so the write completes
 * before the serverless function freezes after the response.
 *
 * `LTRIM` enforces retention on every write, which the previous Firestore
 * collection never did: it had no TTL policy and had to be cleared by hand.
 */
export async function logChatMessage(userMessage, reply) {
    if (!redisAvailable) return;

    const entry = JSON.stringify({
        userMessage,
        reply,
        timestamp: new Date().toISOString(),
    });

    try {
        await pipeline([
            ["LPUSH", LOG_KEY, entry],
            ["LTRIM", LOG_KEY, "0", String(MAX_RETAINED - 1)],
        ]);
    } catch (error) {
        console.error("Failed to log chat message:", error);
    }
}
