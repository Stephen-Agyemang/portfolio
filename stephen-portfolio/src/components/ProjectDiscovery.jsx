import React, { useState } from 'react';
import { findMatchingProjects } from '../services/aiService';
import { FaSearch, FaRobot } from 'react-icons/fa';
import { projects } from '../data/projects';

const ProjectDiscovery = () => {
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const matchedNames = await findMatchingProjects(query, projects);
            const matchedProjects = projects.filter(p => matchedNames.includes(p.name));
            // Sort to maintain relevance order if possible, or just default filtering
            setMatches(matchedProjects);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const isMobile = window.innerWidth < 768;

    return (
        <section id="project-discovery" style={{
            padding: isMobile ? "40px 16px" : "60px 20px",
            textAlign: "center"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h3 style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    color: "#7A9E8E",
                    marginBottom: "20px"
                }}>
                    AI Project Matching
                </h3>
                <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: "40px" }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask me: 'Show me Python games' or 'Do you know React?'"
                        style={{
                            width: "100%",
                            padding: "15px 50px 15px 20px",
                            borderRadius: "30px",
                            border: "2px solid #ddd",
                            fontSize: "1rem",
                            fontFamily: "'Inter', sans-serif",
                            outline: "none",
                            transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                        onBlur={(e) => e.target.style.borderColor = "#ddd"}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#4a7c59",
                            fontSize: "1.2rem"
                        }}
                    >
                        {loading ? "..." : <FaSearch />}
                    </button>
                </form>

                {hasSearched && (
                    <div style={{ animation: "fadeIn 0.5s" }}>
                        {matches.length > 0 ? (
                            <div>
                                <p style={{ marginBottom: "20px", color: "#666" }}>
                                    <FaRobot style={{ verticalAlign: "middle", marginRight: "8px" }} />
                                    Here's what I found related to your request:
                                </p>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
                                    gap: "20px"
                                }}>
                                    {matches.map((project, idx) => (
                                        <div key={idx} style={{
                                            border: "1px solid #eee",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            textAlign: "left",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                        }}>
                                            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{project.name}</h4>
                                            <p style={{ fontSize: "0.9rem", color: "#666" }}>{project.description}</p>
                                            <a href={project.link} target="_blank" rel="noreferrer" style={{
                                                display: "inline-block",
                                                marginTop: "10px",
                                                color: "#4a7c59",
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                textDecoration: "none"
                                            }}>
                                                View Code &rarr;
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: "#888" }}>
                                I matched no specific projects to that query. Try asking about "Python", "React", or "Games".
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectDiscovery;
