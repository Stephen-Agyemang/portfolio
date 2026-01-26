
export async function chatWithAIStream(userMessage, projects, onChunk) {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userMessage, projects })
    });

    if (!res.body) throw new Error ("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if(value) {
            const chunk = decoder.decode(value);
            if (chunk) onChunk(chunk); // Call the callback with each chunk
        }
    }
}

export async function generateEmailDrafts(userIntent) {
    const res = await fetch("/api/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userIntent }),
    });
    
    return res.json();
} 
