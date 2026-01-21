import OpenAI from 'openai';

// Initialize OpenAI client
// Note: In a production environment, you should proxy these requests through a backend
// to avoid exposing your API key in the client-side code.
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

/**
 * Generates email subject lines and body drafts based on user intent.
 * @param {string} userIntent - The user's description of what they want to say.
 * @returns {Promise<Object>} - Returns an object with drafts.
 */
export async function generateEmailDrafts(userIntent) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert professional communication assistant. 
          Your goal is to help a user draft an outreach email to Stephen Agyemang, a software developer.
          Based on the user's raw intent, generate 2 distinct options:
          1. "Polished Professional": Formal, concise, and business-ready.
          2. "Friendly & Direct": Casual but professional, getting straight to the point.
          
          Return the response in strictly valid JSON format with the following structure:
          {
            "options": [
              { "style": "Polished Professional", "subject": "Subject line here", "body": "Email body here..." },
              { "style": "Friendly & Direct", "subject": "Subject line here", "body": "Email body here..." }
            ]
          }`
                },
                {
                    role: "user",
                    content: `Here is what I want to say to Stephen: "${userIntent}"`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0].message.content);
        return content.options;
    } catch (error) {
        console.error("Error generating email drafts:", error);
        throw error;
    }
}

/**
 * Finds projects that match a user's natural language query.
 * @param {string} query - The user's search query (e.g. "I need a React dev")
 * @param {Array} projects - List of project objects
 * @returns {Promise<Array>} - Returns list of matching project names or IDs.
 */
export async function findMatchingProjects(query, projects) {
    try {
        const projectContext = projects.map(p =>
            `Name: ${p.name}, Description: ${p.description}, Skills: ${p.skills.join(", ")}`
        ).join("\n---\n");

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an intelligent project matcher. 
          You will be given a list of software projects and a user query.
          Identify which projects are most relevant to the query.
          Return a strictly valid JSON object containing an array of matched project names in order of relevance.
          Example: { "matches": ["Project A", "Project B"] }
          If no projects match well, return an empty array.`
                },
                {
                    role: "user",
                    content: `User User Query: "${query}"\n\nProjects Available:\n${projectContext}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0].message.content);
        return content.matches;
    } catch (error) {
        console.error("Error finding matching projects:", error);
        return [];
    }
}
