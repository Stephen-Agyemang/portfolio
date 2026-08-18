/**
 * Minimal Upstash Redis REST client.
 *
 * Deliberately dependency-free. This module replaced `firebase-admin`, whose
 * transitive gRPC/protobuf tree cost ~19MB on every cold start purely to back
 * a rate limiter. Upstash speaks plain HTTP, so `fetch` is the entire client.
 *
 * Everything degrades to a no-op when credentials are absent, so a misconfig
 * leaves the API unmetered rather than failing closed and taking chat down.
 */

const env = globalThis.process?.env ?? {};

const REST_URL = (env.UPSTASH_REDIS_REST_URL || "").replace(/\/+$/, "");
const REST_TOKEN = env.UPSTASH_REDIS_REST_TOKEN || "";

export const redisAvailable = Boolean(REST_URL && REST_TOKEN);

/**
 * Upstash can cold-start too. Without a ceiling, one stalled call would hold
 * the entire chat response open behind the rate-limit check — the exact
 * failure mode this rewrite exists to remove.
 */
const REQUEST_TIMEOUT_MS = 2_000;

async function send(path, body) {
    const res = await fetch(`${REST_URL}${path}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${REST_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
        throw new Error(`Upstash ${path} responded ${res.status}`);
    }

    return res.json();
}

/**
 * Runs several commands in a single round trip, returning their results
 * positionally. Upstash applies a pipeline atomically per key, which is what
 * lets the counter increments below stand in for the old Firestore
 * transaction without a read-modify-write race.
 */
export async function pipeline(commands) {
    if (!redisAvailable || !commands.length) return [];

    const data = await send("/pipeline", commands);
    if (!Array.isArray(data)) return [];

    return data.map((entry) => entry?.result ?? null);
}

/**
 * Fire-and-forget variant for corrections that must never delay a response.
 */
export function pipelineDetached(commands) {
    if (!redisAvailable || !commands.length) return;

    pipeline(commands).catch((error) => {
        console.error("Upstash detached command failed:", error);
    });
}
