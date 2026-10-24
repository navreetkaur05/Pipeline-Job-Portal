import { Bell, Menu, Moon, Sun } from "lucide-react";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="header">
      <a className="brand" href="#main">Pipeline<span>.</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#opportunities">Opportunities</a>
        <a className="active" href="#main">My Applications</a>
        <a href="#resume">Resume</a>
        <a href="#blog">Blog</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications" title="Notifications">
          <Bell size={19} />
        </button>
        <button className="theme-button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{darkMode ? "Light" : "Dark"}</span>
        </button>
        <div className="avatar" title="Your profile">NK</div>
        <button className="mobile-menu" aria-label="Open menu"><Menu size={21} /></button>
      </div>
    </header>
  );
}
