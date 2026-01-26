export async function fetchGithubProjects() {
    const username = "Stephen-Agyemang";
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error("GitHub fetch failed");

        const repos = await response.json();

        return repos
            .filter(repo => !repo.fork) // Only show original work
            .map(repo => ({
                name: repo.name,
                description: repo.description || "A project by Stephen Agyemang",
                link: repo.html_url,
                skills: [
                    repo.language,
                    ...(repo.topics || [])
                ].filter(Boolean)
            }));
    } catch (error) {
        console.error("GitHub fetch error:", error);
        return [];
    }
}
