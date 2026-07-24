import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountJson = globalThis.process?.env?.FIREBASE_SERVICE_ACCOUNT;

/**
 * Shared Firestore handle. Null when FIREBASE_SERVICE_ACCOUNT is absent or
 * malformed — every consumer must treat that as "persistence unavailable"
 * and degrade instead of throwing.
 *
 * This lives in its own module because `db.settings()` may only be called
 * once per instance; initializing from two places would throw at import time.
 */
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
        console.error("Failed to initialize Firestore:", error);
    }
}

export { db };
