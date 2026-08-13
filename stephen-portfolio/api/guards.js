import crypto from "node:crypto";
import { db } from "./firestore.js";

const env = globalThis.process?.env ?? {};

const DEFAULT_ORIGINS = [
    "https://stephenagyemang.com",
    "https://www.stephenagyemang.com",
    "https://stephagyemang-portfolio.web.app",
    "https://stephagyemang-portfolio.firebaseapp.com",
    "https://stephen-vite.vercel.app",
    "http://localhost:5173",
];

const configuredOrigins = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const ALLOWED_ORIGINS = new Set(configuredOrigins.length ? configuredOrigins : DEFAULT_ORIGINS);

/**
 * Per-IP quotas. `burst` stops someone hammering the endpoint in a loop;
 * `daily` stops a slow drip that would otherwise run all day unnoticed.
 * A genuine visitor asking questions never approaches either.
 */
const LIMITS = {
    chat: { burst: { max: 8, windowMs: 60_000 }, dailyMax: 60 },
    email: { burst: { max: 4, windowMs: 60_000 }, dailyMax: 20 },
};

/**
 * Absolute ceiling across every caller. This is the only guard that bounds
 * worst-case spend when an attacker rotates IPs, so it is the one that
 * actually caps the bill.
 */
const GLOBAL_DAILY_MAX = Number(env.AI_DAILY_REQUEST_CAP) || 1000;

/** In-memory fallback, and a fast path that avoids a Firestore round trip
 *  for callers already known to be over quota on this instance. Resets on
 *  cold start and is per-instance, which is why Firestore backs it. */
const memoryBuckets = new Map();

function utcDay() {
    return new Date().toISOString().slice(0, 10);
}

function secondsUntilUtcMidnight() {
    const now = new Date();
    const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    return Math.max(1, Math.ceil((midnight - now.getTime()) / 1000));
}

/** Hashed so raw visitor IPs are never written to Firestore. */
function clientFingerprint(req) {
    const forwarded = req.headers?.["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || "")
        .split(",")[0]
        .trim()
        || req.headers?.["x-real-ip"]
        || req.socket?.remoteAddress
        || "unknown";

    return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export function isOriginAllowed(origin) {
    return Boolean(origin) && ALLOWED_ORIGINS.has(origin);
}

/**
 * Reflects an allowed Origin instead of sending `*`. Browsers will refuse
 * cross-site calls from anywhere not on the list.
 */
export function applyCors(req, res) {
    const origin = req.headers?.origin;

    if (isOriginAllowed(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function consumeMemory(key, limits) {
    const now = Date.now();
    const day = utcDay();
    const entry = memoryBuckets.get(key);

    if (!entry || entry.day !== day) {
        memoryBuckets.set(key, { day, dayCount: 1, windowStart: now, windowCount: 1 });
        return { allowed: true };
    }

    if (entry.dayCount >= limits.dailyMax) {
        return { allowed: false, reason: "daily", retryAfter: secondsUntilUtcMidnight() };
    }

    const inWindow = now - entry.windowStart < limits.burst.windowMs;

    if (inWindow && entry.windowCount >= limits.burst.max) {
        const retryAfter = Math.ceil((entry.windowStart + limits.burst.windowMs - now) / 1000);
        return { allowed: false, reason: "burst", retryAfter: Math.max(1, retryAfter) };
    }

    entry.dayCount += 1;
    entry.windowStart = inWindow ? entry.windowStart : now;
    entry.windowCount = inWindow ? entry.windowCount + 1 : 1;

    return { allowed: true };
}

async function consumeFirestore(bucket, fingerprint, limits) {
    const day = utcDay();
    const ref = db.collection("rateLimits").doc(`${bucket}_${fingerprint}_${day}`);
    const globalRef = db.collection("rateLimits").doc(`global_${day}`);
    // Lets a Firestore TTL policy on `expiresAt` sweep these documents.
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    return db.runTransaction(async (tx) => {
        const [snap, globalSnap] = await Promise.all([tx.get(ref), tx.get(globalRef)]);

        const now = Date.now();
        const data = snap.exists ? snap.data() : {};
        const dayCount = data.dayCount || 0;
        const windowStart = data.windowStart || 0;
        const windowCount = data.windowCount || 0;
        const globalCount = globalSnap.exists ? globalSnap.data().count || 0 : 0;

        if (globalCount >= GLOBAL_DAILY_MAX) {
            return { allowed: false, reason: "global", retryAfter: secondsUntilUtcMidnight() };
        }

        if (dayCount >= limits.dailyMax) {
            return { allowed: false, reason: "daily", retryAfter: secondsUntilUtcMidnight() };
        }

        const inWindow = now - windowStart < limits.burst.windowMs;

        if (inWindow && windowCount >= limits.burst.max) {
            const retryAfter = Math.ceil((windowStart + limits.burst.windowMs - now) / 1000);
            return { allowed: false, reason: "burst", retryAfter: Math.max(1, retryAfter) };
        }

        tx.set(ref, {
            dayCount: dayCount + 1,
            windowStart: inWindow ? windowStart : now,
            windowCount: inWindow ? windowCount + 1 : 1,
            expiresAt,
        }, { merge: true });

        tx.set(globalRef, { count: globalCount + 1, expiresAt }, { merge: true });

        return { allowed: true };
    });
}

/**
 * Applies the per-IP and global quotas for an endpoint.
 *
 * Fails open on Firestore errors: a persistence outage should degrade to the
 * in-memory limiter rather than take the site's chatbot down. The in-memory
 * check runs first so a caller already over quota on this instance costs
 * nothing to reject.
 */
export async function enforceRateLimit(req, bucket) {
    const limits = LIMITS[bucket];
    if (!limits) return { allowed: true };

    const fingerprint = clientFingerprint(req);
    const memoryResult = consumeMemory(`${bucket}_${fingerprint}`, limits);
    if (!memoryResult.allowed) return memoryResult;

    if (!db) return memoryResult;

    try {
        return await consumeFirestore(bucket, fingerprint, limits);
    } catch (error) {
        console.error("Rate limit check failed, falling back to in-memory:", error);
        return { allowed: true };
    }
}

/** Writes the 429 response, including Retry-After so clients can back off. */
export function rejectRateLimited(res, result) {
    const messages = {
        burst: "You're sending messages a bit fast — give it a moment.",
        daily: "You've hit today's message limit. Try again tomorrow.",
        global: "The assistant is taking a break for today. Try again tomorrow.",
    };

    res.setHeader("Retry-After", String(result.retryAfter ?? 60));
    return res.status(429).json({ error: messages[result.reason] || messages.burst });
}

/**
 * Caps the client-supplied project payload. Without this, `buildProjectContext`
 * bounds the number of projects but not the length of each name or skill, so a
 * crafted body could inflate the prompt far beyond the intended size.
 */
export function sanitizeProjects(projects, { maxProjects = 25, maxFieldChars = 300 } = {}) {
    if (!Array.isArray(projects)) return [];

    const clamp = (value) => (typeof value === "string" ? value.slice(0, maxFieldChars) : "");

    return projects.slice(0, maxProjects).map((p) => ({
        name: clamp(p?.name),
        description: clamp(p?.description),
        skills: Array.isArray(p?.skills) ? p.skills.slice(0, 10).map(clamp) : [],
    }));
}
