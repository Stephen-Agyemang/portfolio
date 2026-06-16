import { initializeApp, getApps } from "firebase-admin/app";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountJson = globalThis.process?.env?.FIREBASE_SERVICE_ACCOUNT;

let db = null;
if (serviceAccountJson) {
    try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
        db = getFirestore(app);
        // gRPC's default transport stalls on Vercel's serverless network until
        // it times out; REST avoids the long-lived connection entirely.
        db.settings({ preferRest: true });
    } catch (error) {
        console.error("Failed to initialize Firestore for chat logging:", error);
    }
}

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
