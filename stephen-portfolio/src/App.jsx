import { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import BackgroundField from "./components/BackgroundField.jsx";
import SketchDesk from "./components/SketchDesk.jsx";

const About = lazy(() => import("./components/About.jsx"));
const Projects = lazy(() => import("./components/Projects.jsx"));
const ProjectDiscovery = lazy(() => import("./components/ProjectDiscovery.jsx"));
const Skills = lazy(() => import("./components/Skills.jsx"));
const Experience = lazy(() => import("./components/Experience.jsx"));
const Credentials = lazy(() => import("./components/Credentials.jsx"));
const EmailDraftAssistant = lazy(() => import("./components/EmailDraftAssistant.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      const home = document.getElementById("home");
      const about = document.getElementById("about");
      const projects = document.getElementById("projects");
      const skills = document.getElementById("skills");
      const contact = document.getElementById("contact-assistant");

      const scrollPos = window.scrollY + 200; // Dynamic offset

      let current = "home";

      if (home && about && projects && skills) {
        if (contact && scrollPos >= contact.offsetTop) {
          current = "contact";
        } else if (scrollPos >= projects.offsetTop) {
          current = "projects";
        } else if (scrollPos >= skills.offsetTop) {
          current = "skills";
        } else if (scrollPos >= about.offsetTop) {
          current = "about";
        } else {
          current = "home";
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="app-container" style={{
      background: "var(--bg-color)",
      color: "var(--text-color)",
      minHeight: '100vh',
      fontFamily: "var(--font-mono)",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.4s ease, color 0.4s ease"
    }}>
      <BackgroundField />
      <SketchDesk />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Credentials />
          <EmailDraftAssistant />
          <Footer />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <ProjectDiscovery />
      </Suspense>
    </div>
  );
}

export default App;
