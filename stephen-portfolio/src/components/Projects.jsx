import React from "react";
import arrow from "../assets/arrow.jpg";
import { projects } from "../data/projects";

const Projects = () => {
    const isMobile = window.innerWidth < 768;
    // Projects data is now imported from ../data/projects.js

    return (
        <section
            id="projects"
            style={{
                padding: isMobile ? "100px 16px" : "120px 20px",
                textAlign: "left"
            }}
        >
            <h2 style={{
                fontSize: isMobile ? "2rem" : "3rem",
                marginBottom: isMobile ? "24px" : "40px",
                color: "#6c9a57ff",
                fontFamily: "'Courier New', Courier, monospace"
            }}
            >
                Projects
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: isMobile ? "24px" : "40px",
                }}
            >
                {projects.map((project, index) => (
                    <div
                        key={index}
                        style={{
                            background: "rgba(255, 255, 255, 0.45)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            borderRadius: "20px",
                            padding: isMobile ? "24px" : "30px",
                            boxShadow: "0 8px 32px 0 rgba(108, 154, 87, 0.05)",
                            display: "flex",
                            flexDirection: "column",
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "0 12px 40px 0 rgba(108, 154, 87, 0.15)";
                            e.currentTarget.style.border = "1px solid rgba(108, 154, 87, 0.3)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(108, 154, 87, 0.05)";
                            e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.5)";
                        }}
                    >
                        <h3 style={{
                            fontSize: isMobile ? "1.6rem" : "1.8rem",
                            marginBottom: "12px",
                            color: "#333",
                            fontWeight: "700",
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            {project.name}
                        </h3>

                        {/* Skill Tags */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: "16px"
                        }}>
                            {project.skills && project.skills.map((skill, sIdx) => (
                                <span key={sIdx} style={{
                                    fontSize: "0.75rem",
                                    padding: "4px 10px",
                                    background: "rgba(108, 154, 87, 0.1)",
                                    color: "#6c9a57",
                                    borderRadius: "20px",
                                    fontWeight: "600",
                                    border: "1px solid rgba(108, 154, 87, 0.2)"
                                }}>
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <p style={{
                            fontSize: isMobile ? "0.95rem" : "1rem",
                            marginBottom: "24px",
                            color: "#555",
                            lineHeight: "1.6",
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            {project.description}
                        </p>

                        <div style={{ marginTop: "auto" }}>
                            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                <button
                                    style={{
                                        position: "relative",
                                        padding: isMobile ? "10px 42px 10px 20px" : "12px 48px 12px 24px",
                                        borderRadius: "12px",
                                        border: "none",
                                        backgroundColor: "#333",
                                        color: "#fff",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        fontSize: isMobile ? "0.9rem" : "1rem",
                                        transition: "all 0.3s ease",
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#000";
                                        e.currentTarget.style.transform = "scale(1.02)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = "#333";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    Source code
                                    <img
                                        src={arrow}
                                        alt="arrow"
                                        style={{
                                            position: "absolute",
                                            right: isMobile ? "12px" : "16px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            height: isMobile ? "18px" : "22px",
                                            filter: "invert(1)",
                                            pointerEvents: "none",
                                        }}
                                    />
                                </button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;