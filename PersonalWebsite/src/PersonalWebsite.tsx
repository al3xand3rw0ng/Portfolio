import { Routes, Route, Navigate } from "react-router";
import PersonalWebsiteNavigation from "./Navigation";
import Home from "./Home";
import AboutMe from "./AboutMe";
import ContactMe from "./ContactMe";
import Projects from "./Projects/Projects";
import ChatBot from "./ChatBot";

export default function PersonalWebsite() {
  return (
    <div id="personal-website">
      <PersonalWebsiteNavigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<ContactMe />} />
        </Routes>
      </div>
      <ChatBot />
    </div>
  );
}
