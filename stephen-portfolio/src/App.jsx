import React from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import ProjectDiscovery from "./components/ProjectDiscovery.jsx";
import Skills from "./components/Skills.jsx";
import EmailDraftAssistant from "./components/EmailDraftAssistant.jsx";
import Footer from "./components/Footer.jsx";


if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

function App() {
  return (
    <div className="app-container" style={{ background: "linear-gradient(135deg, #f5f5f5 0%, #eee9e4 50%, #eee8e3 100%)", minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <About />
      <ProjectDiscovery />
      <Projects />
      <Skills />
      <EmailDraftAssistant />
      <Footer />
    </div>
  );
}

export default App;
