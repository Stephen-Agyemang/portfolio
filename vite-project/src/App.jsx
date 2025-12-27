import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";


if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

function App() {
  return (
    <div style={{ background: "linear-gradient(135deg, #fafafa, #f0ebe1)", color: '#e3e9e5', minHeight: '100vh' }}> 
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
    </div>
  );
}

export default App;
