import { Bell, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header({
  darkMode,
  setDarkMode,
  email,
  onLogout,
  currentPage,
  setCurrentPage,
  jobNotifications,
  onJobNotificationSelect
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const photoInput = useRef(null);
  const profilePhotoKey = `pipelineProfilePhoto:${email.toLowerCase()}`;
  const initials = email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";
  const navigation = [
    { id: "opportunities", label: "Opportunities" },
    { id: "applications", label: "My Applications" },
    { id: "resume", label: "Resume" }
  ];

  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    setNotificationsOpen(false);
  };

  useEffect(() => {
    setProfilePhoto(localStorage.getItem(profilePhotoKey) || "");
    setPhotoError("");
  }, [profilePhotoKey]);

  const uploadProfilePhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setPhotoError("Profile photos must be 1 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setPhotoError("Could not read that image. Please try another file.");
        return;
      }
      try {
        localStorage.setItem(profilePhotoKey, reader.result);
        setProfilePhoto(reader.result);
        setPhotoError("");
      } catch {
        setPhotoError("Could not save your photo in this browser. Try a smaller image.");
      }
    };
    reader.onerror = () => setPhotoError("Could not read that image. Please try another file.");
    reader.readAsDataURL(file);
  };

  return (
    <header className="header">
      <button type="button" className="brand brand-button" onClick={() => navigate("applications")}>Pipeline<span>.</span></button>
      <nav className={`desktop-nav ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
        {navigation.map(({ id, label }) => (
          <button
            type="button"
            key={id}
            className={currentPage === id ? "active" : ""}
            aria-current={currentPage === id ? "page" : undefined}
            onClick={() => navigate(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button
          type="button"
          className="icon-button notification-trigger"
          aria-label={`Latest job notifications${jobNotifications.length ? ` (${jobNotifications.length})` : ""}`}
          title="Latest job notifications"
          aria-expanded={notificationsOpen}
          aria-controls="job-notifications"
          onClick={() => setNotificationsOpen((open) => !open)}
        >
          <Bell size={19} />
          {jobNotifications.length > 0 && <span className="notification-count">{jobNotifications.length}</span>}
        </button>
        <button className="theme-button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{darkMode ? "Light" : "Dark"}</span>
        </button>
        <button
          type="button"
          className={`avatar profile-photo-button ${profilePhoto ? "has-profile-photo" : ""}`}
          title="Upload profile photo"
          aria-label="Upload profile photo"
          onClick={() => photoInput.current?.click()}
        >
          {profilePhoto ? <img src={profilePhoto} alt="" /> : initials}
        </button>
        <input
          ref={photoInput}
          className="profile-photo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Choose profile photo"
          onChange={uploadProfilePhoto}
        />
        <button className="logout-button" onClick={onLogout} aria-label="Sign out" title="Sign out">
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
        <button className="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {notificationsOpen && (
        <section className="notification-panel" id="job-notifications" aria-label="Latest job notifications">
          <div className="notification-panel-heading">
            <div>
              <strong>Latest job notifications</strong>
              <span>Recently posted jobs and internships</span>
            </div>
            <button type="button" className="notification-close" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}>
              <X size={17} />
            </button>
          </div>
          {jobNotifications.length ? (
            <div className="notification-list">
              {jobNotifications.map((opportunity) => (
                <button
                  type="button"
                  className="notification-item"
                  key={opportunity.id}
                  onClick={() => {
                    setNotificationsOpen(false);
                    onJobNotificationSelect(opportunity.id);
                  }}
                >
                  <span className="notification-company-mark" style={{ background: opportunity.color }}>
                    {opportunity.company.charAt(0).toUpperCase()}
                  </span>
                  <span className="notification-copy">
                    <strong>{opportunity.role}</strong>
                    <span>{opportunity.company} · {opportunity.location}</span>
                    <small>Posted {opportunity.postedDate || opportunity.appliedDate}</small>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="notification-empty">No job notifications yet.</p>
          )}
          {photoError && <p className="profile-photo-error" role="alert">{photoError}</p>}
        </section>
      )}
    </header>
  );
}
