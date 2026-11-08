import {
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  UserRound
} from "lucide-react";
import { useState } from "react";

const emptyResume = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  skills: "",
  experience: [],
  education: []
};

const readResume = (email) => {
  try {
    const saved = JSON.parse(localStorage.getItem(`pipelineResume:${email.toLowerCase()}`));
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return emptyResume;
    return {
      ...emptyResume,
      ...saved,
      experience: Array.isArray(saved.experience) ? saved.experience : [],
      education: Array.isArray(saved.education) ? saved.education : []
    };
  } catch {
    return emptyResume;
  }
};

export default function ProfilePage({ email, applications, onEditResume }) {
  const [resume] = useState(() => readResume(email));
  const [profilePhoto] = useState(() => {
    try {
      return localStorage.getItem(`pipelineProfilePhoto:${email.toLowerCase()}`) || "";
    } catch {
      return "";
    }
  });
  const experience = resume.experience.filter((entry) => entry?.role || entry?.company || entry?.description);
  const education = resume.education.filter((entry) => entry?.degree || entry?.school);
  const skills = typeof resume.skills === "string"
    ? resume.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];
  const completionFields = [
    resume.name,
    resume.title,
    resume.location,
    resume.summary,
    skills.length > 0,
    experience.length > 0,
    education.length > 0
  ];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);
  const displayName = resume.name || email.split("@")[0];
  const shortlisted = applications.filter((application) => application.status === "Shortlisted").length;

  return (
    <>
      <section className="hero profile-hero">
        <div>
          <p className="eyebrow">YOUR CAREER, YOUR STORY</p>
          <h1>My profile<span>.</span></h1>
          <p className="hero-subtitle">A snapshot of your experience and career details.</p>
        </div>
        <button type="button" className="primary-button" onClick={onEditResume}>
          <FileText size={16} /> Edit resume
        </button>
      </section>

      <section className="profile-workspace">
        <aside className="profile-sidebar">
          <div className="profile-identity-card">
            <div className="profile-page-avatar">
              {profilePhoto ? <img src={profilePhoto} alt="" /> : <UserRound size={36} />}
            </div>
            <h2>{displayName}</h2>
            <p className="profile-professional-title">{resume.title || "Add a professional title"}</p>
            <div className="profile-contact-list">
              <span><Mail size={15} />{resume.email || email}</span>
              {resume.phone && <span><Phone size={15} />{resume.phone}</span>}
              {resume.location && <span><MapPin size={15} />{resume.location}</span>}
              {resume.website && <span><ExternalLink size={15} />{resume.website}</span>}
            </div>
            <div className="profile-completion">
              <div><strong>Profile completeness</strong><span>{completion}%</span></div>
              <div className="profile-completion-track"><span style={{ width: `${completion}%` }} /></div>
              {completion < 100 && <p>Fill out your resume to complete your profile.</p>}
            </div>
          </div>

          <div className="profile-summary-stats">
            <div><BriefcaseBusiness size={17} /><strong>{applications.length}</strong><span>Applications</span></div>
            <div><GraduationCap size={17} /><strong>{shortlisted}</strong><span>Shortlisted</span></div>
          </div>
        </aside>

        <div className="profile-content">
          <section className="profile-section">
            <div className="profile-section-heading">
              <h2>About</h2>
              <span>Professional summary</span>
            </div>
            {resume.summary
              ? <p className="profile-about-copy">{resume.summary}</p>
              : <p className="profile-empty">Add a summary to introduce your experience and career goals.</p>}
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <h2>Skills</h2>
              <span>{skills.length} added</span>
            </div>
            {skills.length
              ? <div className="profile-skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              : <p className="profile-empty">Your skills will appear here when you add them to your resume.</p>}
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <h2>Experience</h2>
              <span>{experience.length} {experience.length === 1 ? "role" : "roles"}</span>
            </div>
            {experience.length ? experience.map((entry, index) => (
              <article className="profile-entry" key={`experience-${index}`}>
                <div className="profile-entry-icon"><BriefcaseBusiness size={17} /></div>
                <div>
                  <strong>{entry.role || entry.company}</strong>
                  {entry.role && entry.company && <p>{entry.company}</p>}
                  {entry.dates && <small>{entry.dates}</small>}
                  {entry.description && <p className="profile-entry-description">{entry.description}</p>}
                </div>
              </article>
            )) : <p className="profile-empty">Add your work history to show your experience here.</p>}
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <h2>Education</h2>
              <span>{education.length} {education.length === 1 ? "entry" : "entries"}</span>
            </div>
            {education.length ? education.map((entry, index) => (
              <article className="profile-entry" key={`education-${index}`}>
                <div className="profile-entry-icon"><GraduationCap size={17} /></div>
                <div>
                  <strong>{entry.degree || entry.school}</strong>
                  {entry.degree && entry.school && <p>{entry.school}</p>}
                  {entry.dates && <small>{entry.dates}</small>}
                </div>
              </article>
            )) : <p className="profile-empty">Add your education to show it here.</p>}
          </section>
        </div>
      </section>
    </>
  );
}
