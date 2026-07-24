const FALLBACK_ERROR = "Something went wrong. Give it a moment and try again.";

/** Pulls the server's human-readable message out of a failed response. */
async function readErrorMessage(res) {
    try {
        const data = await res.json();
        return data?.error || FALLBACK_ERROR;
    } catch {
        return FALLBACK_ERROR;
    }
}

export async function chatWithAIStream(userMessage, projects, onChunk) {
    const res = await fetch("https://stephen-vite.vercel.app/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userMessage, projects })
    });

    // Rate-limit and validation failures return JSON, not a stream. Without this
    // the error body would be piped straight into the chat bubble as raw text.
    if (!res.ok) throw new Error(await readErrorMessage(res));

    if (!res.body) throw new Error ("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let buffered = "";
    let lastFlushAt = 0;
    const FLUSH_INTERVAL_MS = 60;

    const flush = (force = false) => {
        const now = Date.now();
        if (!buffered) return;
        if (!force && now - lastFlushAt < FLUSH_INTERVAL_MS) return;

        onChunk(buffered);
        buffered = "";
        lastFlushAt = now;
    };

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if(value) {
            const chunk = decoder.decode(value);
            if (chunk) {
                buffered += chunk;
                flush();
            }
        }
    }

    flush(true);
}

export async function generateEmailDrafts(userIntent) {
    const res = await fetch("https://stephen-vite.vercel.app/api/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userIntent }),
    });

    if (!res.ok) throw new Error(await readErrorMessage(res));

    return res.json();
}
