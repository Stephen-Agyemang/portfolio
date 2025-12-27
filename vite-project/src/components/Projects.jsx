import React from "react";
import arrow from "../assets/arrow.jpg";

const Projects = () => {
    const projects = [
        {
            name: "Emoji Chatbot", 
            description: "Interactive Python chatbot with guessing game and terminal effects.",
            link: "https://github.com/Stephen-Agyemang/emoji_chatbot",
        
        }, 

        {
            name: "Python Fun Scripts",
            description: "Collection of small Python programs for practice.",
            link: "https://github.com/Stephen-Agyemang/python-fun-scripts",
        },

        {
            name: "Zork V2 (in progress)",
            description: "Classic text adventure game with new challenges and features.", 
            link: "#",
        },
    ];

    return ( 
        <section 
        id="projects" 
        style={{ 
            padding: "80px 20px", 
            textAlign: "left", 
            minHeight: "100vh"
            }}
        >
            <h2 style= {{ fontSize: "3rem", marginBottom: "40px", color:"#6c9a57ff"}} >
                Projects</h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "40px",
                }}
            >
                {projects.map((project, index) => (
                    <div 
                    key={index} 
                    style={{ 
                        border: "1px solid #444",
                        borderRadius: "10px",
                        padding: "20px",
                        }}
                    >
                        <h3 style={{ fontSize: "2rem", marginBottom: "10px", color: "#444" }}> 
                            {project.name}
                        </h3>
                        <p style={{ fontSize: "1rem", marginBottom: "10px", color: "#444" }}>
                            {project.description}</p>
                        <div style={{ display: "flex", gap: "15px", marginTop: "10px"}}>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <button
                                    style={{
                                        position: "relative",
                                        padding: "10px 40px 10px 20px",
                                        borderRadius: "5px",
                                        border: "none",
                                        backgroundColor: "#ffffffff",
                                        color: "#1a1a1a",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        transition: "background-color 0.3s, transform 0.2s",
                                        }}
                                        onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#ffffffff";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        }}
                                        onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = "#ffffffff";
                                        e.currentTarget.style.transform = "scale(1)";
                                        }}
                                >
                                Source code 
                                        <img
                                            src={arrow}
                                            alt="arrow"
                                            style={{
                                                position: "absolute",
                                                right: "12px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                height: "20px",
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