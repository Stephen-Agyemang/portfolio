import OpenAI from "openai";
import { fetchGithubProjects } from "./githubFetcher.js";

const client = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { userMessage, projects: localProjects } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "Invalid input" });
    }

    if (userMessage.length > 500) {
        return res.status(400).json({ error: "Message too long" });
    }

    try {
        // Fetch latest projects from GitHub
        const githubProjects = await fetchGithubProjects();

        // Merge local projects with GitHub projects, removing duplicates by name
        const allProjects = [...(localProjects || [])];
        githubProjects.forEach(ghProject => {
            if (!allProjects.find(lp => lp.name.toLowerCase() === ghProject.name.toLowerCase())) {
                allProjects.push(ghProject);
            }
        });

        const projectContext = allProjects.map(p =>
            `Name: ${p.name}, Description: ${p.description}, Skills: ${p.skills.join(", ")}`
        ).join("\n---\n");

        // Set response headers for streaming 
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        if (res.flushHeaders) res.flushHeaders();

        const stream = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system", content: `You are Stephen Agyemang's personal portfolio AI assistant.
          Your goal is to chat with visitors, answer questions about Stephen, and recommend his projects when relevant.
          
          Stephen is a software developer. You have access to his projects list below.
          
          Rules:
          1. **Be Conversational**: If the user says "Hi" or "How are you?", reply normally and politely.
          2. **Answer Questions**: If they ask "Who is Stephen?", summarize him based on the successful projects he has built (Python, Java, React).
          3. **Project Matching**: If the user asks about specific skills or projects (e.g. "Does he know Java?"), answer them AND provide a list of matching projects using the "---PROJECTS---" delimiter format.
          4. **No Match?**: If they ask for something he hasn't done (e.g. "C++"), be honest but friendly. "He hasn't uploaded any C++ projects yet, but he is quick to learn!"
          5. **Tone**: Professional, friendly, and enthusiastic.
          
          Response Format:
          First, provide your conversational response. 
          Then, if there are matching projects, add exactly "---PROJECTS---" on a new line followed by a comma-separated list of the exact project names.
          
          Example:
          "I'd love to help! Stephen has several React projects.
          ---PROJECTS---
          Project A, Project B"
          
          If no projects match, just provide the conversational response.`
                },
                { role: "user", content: `User Message: "${userMessage}"\n\nProjects:\n${projectContext}` }
            ],
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(content);
            }
        }
        res.end();
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({
            reply: "AI is taking a break, try again."
        });
    }
}
