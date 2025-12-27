import React from "react";
import "./Skills.css";


const skills = [
    { name: "Java", cls: "devicon-java-plain colored", url: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
    { name: "Python", cls: "devicon-python-plain colored", url: "https://www.youtube.com/watch?v=rfscVS0vtbw"},
    { name: "JavaScript", cls: "devicon-javascript-plain colored", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
    { name: "C++", cls: "devicon-cplusplus-plain colored", url: "https://www.youtube.com/@programmingwithmosh" },
    { name: "React", cls: "devicon-react-original colored", url: "https://www.youtube.com/watch?v=SqcY0GlETPk" },
    { name: "Node.js", cls: "devicon-nodejs-plain colored", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
    { name: "Git", cls: "devicon-git-plain colored", url: "https://www.youtube.com/watch?v=mJ-qvsxPHpY" },
    { name: "GitHub", cls: "devicon-github-original colored", url: "https://www.youtube.com/watch?v=r8jQ9hVA2qs&list=PL0lo9MOBetEFcp4SCWinBdpml9B2U25-f" },
    { name: "HTML", cls: "devicon-html5-plain colored", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
    { name: "CSS", cls: "devicon-css3-plain colored", url: "https://www.youtube.com/watch?v=ieTHC78giGQ" },
    { name: "VS Code", cls: "devicon-vscode-plain colored", url: "https://www.youtube.com/watch?v=B-s71n0dHUk" },
    { name: "PyCharm", cls: "devicon-pycharm-plain colored", url: "https://www.youtube.com/watch?v=HHcZbXsZtm0" },
];

const Skills = () => {
  return (
    <section id="skills" className="skills">
        <h2 className="skills-title">Skills</h2>
        <ul className="skills-grid" role="list">
           {skills.map(({ name, cls, url }) => (
            <li
                key={name}
                className="skill-card"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.color = "#9da4a3";

                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";                }}
        > 
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="skill-link"
            aria-label={`Learn more about ${name}`}
          >
            <i className={cls} style={{ fontSize: 44 }} aria-hidden="true"></i>
            <span className="skill-label">{name}</span>
          </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;