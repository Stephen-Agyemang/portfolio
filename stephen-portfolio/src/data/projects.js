export const projects = [
    {
        id: "monica",
        name: "MoNiCa.Ai",
        private: true,
        tagline: "Real-Time AI Interview Coach",
        description: "A real-time, low-latency AI interview platform that runs adaptive voice interviews, delivers live communication coaching, and generates private, actionable performance reports. Built around a React client, an async FastAPI backend, and a LiveKit agent pipeline (streaming speech-to-text → LLM → text-to-speech), deployed on Docker and Kubernetes.",
        link: "https://github.com/Stephen-Agyemang/MoNiCa.Ai",
        // Repo isn't publicly reachable yet, so the Code button renders disabled.
        // Delete this line to turn the link back on — `link` above is still correct.
        codeDisabled: true,
        skills: ["React", "FastAPI", "Python", "WebRTC", "LiveKit", "Deepgram", "Cartesia", "PostgreSQL", "Redis", "Docker", "Kubernetes", "OpenAI"],
        demoType: "interview-simulation"
    },
    {
        id: "zork",
        name: "Zork v2",
        tagline: "Full-Stack Campus Text Adventure",
        description: "A full-stack, terminal-style text adventure set across DePauw's campus. Players complete quests, manage inventory and hunger, race timed challenges, and save high scores to global and campus-only leaderboards — all backed by a Spring Boot REST API with session-isolated game state, so multiple players run independent games at once.",
        link: "https://github.com/Stephen-Agyemang/Zork-v2",
        liveUrl: "https://zork-v2.onrender.com",
        skills: ["Java 21", "Spring Boot", "Spring Data JPA", "PostgreSQL", "React", "Vite", "REST API", "Docker", "Maven", "GitHub Actions", "JUnit"],
        demoType: "zork-hud"
    },
    {
        id: "fridgejam",
        name: "FridgeJam",
        tagline: "Multimodal AI Leftovers Recipe Scanner",
        description: "An AI-powered cooking companion built for the GDG Coding Jam that turns leftover ingredients into personalized recipes. Uses Gemini's multimodal vision to scan fridge photos, then generates dietary-aware recipes, macro estimates, a 7-day meal planner, and exportable cookbook PDFs — wrapped in a cozy retro UI with a Firestore leaderboard mini-game.",
        link: "https://github.com/Stephen-Agyemang/FridgeJam",
        liveUrl: "https://fridgejam.web.app",
        skills: ["Gemini AI", "FastAPI", "Python", "JavaScript", "HTML5", "CSS3", "Firebase", "Docker", "Google Cloud Run"],
        demoType: "chef-assistant"
    },
    {
        id: "portfolio",
        name: "Portfolio Website",
        tagline: "AI-Powered Engineer Portfolio",
        description: "A personal portfolio website built with React and Vite, featuring a glassmorphic background layer, custom CSS animations, an AI-powered email draft assistant that generates personalized outreach, and an intelligent chatbot assistant using OpenAI's GPT-4 API to help visitors query experience through natural dialogue.",
        link: "https://github.com/Stephen-Agyemang/stephen-portfolio",
        liveUrl: "https://stephenagyemang.com",
        skills: ["React", "Vite", "JavaScript", "HTML", "CSS3", "OpenAI API", "Prompt Engineering", "Web Analytics"],
        demoType: "portfolio-dashboard"
    },
    {
        id: "fintracker",
        name: "FinTracker",
        tagline: "AI-Powered Personal Finance Dashboard",
        description: "A polished personal-finance app for tracking cash flow, budgets, and spending habits in one place. Its FastAPI and SQLite backend supports Plaid bank syncing or CSV imports, while a context-aware Gemini or Claude advisor streams data-grounded insights. FinTracker also detects recurring charges, normalizes subscription costs, and helps users act with cancellation links and AI-written emails.",
        link: "https://github.com/Stephen-Agyemang/FinTracker",
        skills: ["FastAPI", "Python", "SQLite", "JavaScript", "Plaid", "Gemini", "Claude", "Chart.js"],
        demoType: "financial-ledger"
    }
];
