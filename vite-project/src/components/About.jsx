import React from "react";
import Stephen from "../assets/Stephen.jpg"

const About = () => {
  return (
    <section 
      id="about" 
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "50px",
        padding: "100px 20px",
        flexWrap: "wrap",
      }}
    >
      {/* Picture */}
      <img 
        src={Stephen}
        alt="Stephen Agyemang" 
        style={{
          width: "400px",
          height: "350px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      {/* About Text */}
      <div style={{ maxWidth: "600px", textAlign: "left" }}>
        <h2 style={{ fontSize: "3rem", marginBottom: "20px", color: "#6c9a57ff" }}>About Me</h2>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "#444" }}>
        I am a Ghanaian international Computer Science student at DePauw University with a strong passion 
        for software engineering and a keen interest in AI and machine learning. 
        I am skilled in Python, Java, Git, GitHub, and core data structures and algorithms. 
        Building meaningful projects is my purpose as an aspiring software engineer now.
        </p>

        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "#444" }}>
        Outside of coding, I am also a Mathematics and Theatre/Acting enthusiat at DePauw. 
        I enjoy learning new things, including playing the guitar and piano, 
        and I am studying Spanish. To stay active, I play soccer, which helps 
        enhance my teamwork skills.I am eager to grow through internships and 
        projects that will help me sharpen my software engineering abilities.        
        </p>
      </div>
    </section>
  );
};

export default About;