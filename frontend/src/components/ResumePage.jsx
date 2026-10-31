import { useEffect, useMemo, useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";

const createExperience = () => ({ role: "", company: "", dates: "", description: "" });
const createEducation = () => ({ degree: "", school: "", dates: "" });

const emptyResume = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  skills: "",
  experience: [createExperience()],
  education: [createEducation()]
};

const normalizeEntries = (entries, createEntry, fields) => {
  if (!Array.isArray(entries)) return [createEntry()];
  const validEntries = entries
    .filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
    .map((entry) => Object.fromEntries(fields.map((field) => [
      field,
      typeof entry[field] === "string" ? entry[field] : ""
    ])));
  return validEntries.length ? validEntries : [createEntry()];
};

const getResume = (storageKey) => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return emptyResume;
    return {
      ...emptyResume,
      ...saved,
      ...Object.fromEntries(
        ["name", "title", "email", "phone", "location", "website", "summary", "skills"]
          .map((field) => [field, typeof saved[field] === "string" ? saved[field] : ""])
      ),
      experience: normalizeEntries(saved.experience, createExperience, ["role", "company", "dates", "description"]),
      education: normalizeEntries(saved.education, createEducation, ["degree", "school", "dates"])
    };
  } catch {
    return emptyResume;
  }
};

export default function ResumePage({ email }) {
  const storageKey = `pipelineResume:${email.toLowerCase()}`;
  const [resume, setResume] = useState(() => getResume(storageKey));
  const [saveError, setSaveError] = useState("");
  const skills = useMemo(
    () => resume.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
    [resume.skills]
  );

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(resume));
      setSaveError("");
    } catch {
      setSaveError("Your browser could not save these changes. Check its available storage.");
    }
  }, [resume, storageKey]);

  const updateField = (field, value) => {
    setResume((current) => ({ ...current, [field]: value }));
  };

  const updateEntry = (section, index, field, value) => {
    setResume((current) => ({
      ...current,
      [section]: current[section].map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const removeEntry = (section, index) => {
    setResume((current) => ({
      ...current,
      [section]: current[section].filter((_, entryIndex) => entryIndex !== index)
    }));
  };

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">MAKE YOUR EXPERIENCE STAND OUT</p>
          <h1>Resume builder<span>.</span></h1>
          <p className="hero-subtitle">Fill in your details and see your resume take shape as you work.</p>
        </div>
        <button type="button" className="primary-button add-button" onClick={() => window.print()}>
          <Printer size={17} /> Print / Save PDF
        </button>
      </section>

      <section className="resume-workspace">
        <div className="resume-editor">
          <div className="workspace-heading">
            <div>
              <h2>Your details</h2>
              <p>Your resume is saved in this browser for your account.</p>
            </div>
          </div>

          <section className="resume-form-section">
            <h3>Personal information</h3>
            <div className="resume-form-grid">
              <label>Full name
                <input value={resume.name} onChange={(event) => updateField("name", event.target.value)} placeholder="e.g. Alex Morgan" />
              </label>
              <label>Professional title
                <input value={resume.title} onChange={(event) => updateField("title", event.target.value)} placeholder="e.g. Frontend Developer" />
              </label>
              <label>Email
                <input type="email" value={resume.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" />
              </label>
              <label>Phone
                <input type="tel" value={resume.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+1 555 0100" />
              </label>
              <label>Location
                <input value={resume.location} onChange={(event) => updateField("location", event.target.value)} placeholder="City, Country" />
              </label>
              <label>Website or LinkedIn
                <input value={resume.website} onChange={(event) => updateField("website", event.target.value)} placeholder="linkedin.com/in/you" />
              </label>
            </div>
          </section>

          <section className="resume-form-section">
            <h3>Professional summary</h3>
            <label className="resume-full-field">
              <textarea rows="4" value={resume.summary} onChange={(event) => updateField("summary", event.target.value)} placeholder="Write a short introduction about your experience and career goals." />
            </label>
          </section>

          <section className="resume-form-section">
            <div className="resume-section-heading">
              <h3>Work experience</h3>
              <button type="button" className="resume-add-button" onClick={() => setResume((current) => ({ ...current, experience: [...current.experience, createExperience()] }))}>
                <Plus size={15} /> Add experience
              </button>
            </div>
            {resume.experience.map((entry, index) => (
              <div className="resume-entry-form" key={`experience-${index}`}>
                <div className="resume-form-grid">
                  <label>Job title
                    <input value={entry.role} onChange={(event) => updateEntry("experience", index, "role", event.target.value)} placeholder="Job title" />
                  </label>
                  <label>Company
                    <input value={entry.company} onChange={(event) => updateEntry("experience", index, "company", event.target.value)} placeholder="Company name" />
                  </label>
                  <label>Dates
                    <input value={entry.dates} onChange={(event) => updateEntry("experience", index, "dates", event.target.value)} placeholder="Jan 2024 – Present" />
                  </label>
                  <label className="resume-full-field">Description
                    <textarea rows="3" value={entry.description} onChange={(event) => updateEntry("experience", index, "description", event.target.value)} placeholder="Describe your impact and achievements." />
                  </label>
                </div>
                {resume.experience.length > 1 && <button type="button" className="resume-remove-button" onClick={() => removeEntry("experience", index)}><Trash2 size={14} /> Remove</button>}
              </div>
            ))}
          </section>

          <section className="resume-form-section">
            <div className="resume-section-heading">
              <h3>Education</h3>
              <button type="button" className="resume-add-button" onClick={() => setResume((current) => ({ ...current, education: [...current.education, createEducation()] }))}>
                <Plus size={15} /> Add education
              </button>
            </div>
            {resume.education.map((entry, index) => (
              <div className="resume-entry-form" key={`education-${index}`}>
                <div className="resume-form-grid">
                  <label>Degree or qualification
                    <input value={entry.degree} onChange={(event) => updateEntry("education", index, "degree", event.target.value)} placeholder="Degree or qualification" />
                  </label>
                  <label>School
                    <input value={entry.school} onChange={(event) => updateEntry("education", index, "school", event.target.value)} placeholder="School or institution" />
                  </label>
                  <label>Dates
                    <input value={entry.dates} onChange={(event) => updateEntry("education", index, "dates", event.target.value)} placeholder="2022 – 2026" />
                  </label>
                </div>
                {resume.education.length > 1 && <button type="button" className="resume-remove-button" onClick={() => removeEntry("education", index)}><Trash2 size={14} /> Remove</button>}
              </div>
            ))}
          </section>

          <section className="resume-form-section">
            <h3>Skills</h3>
            <label className="resume-full-field">
              <input value={resume.skills} onChange={(event) => updateField("skills", event.target.value)} placeholder="React, JavaScript, Accessibility, UX (separate with commas)" />
            </label>
          </section>
          {saveError && <p className="form-error" role="alert">{saveError}</p>}
        </div>

        <article className="resume-preview" aria-label="Live resume preview">
          <div className="resume-paper">
            <header className="resume-paper-header">
              <h2>{resume.name || "Your Name"}</h2>
              <p className="resume-paper-title">{resume.title || "Professional Title"}</p>
              <p className="resume-contact">
                {[resume.email, resume.phone, resume.location, resume.website].filter(Boolean).join("  ·  ") || "Email · Phone · Location · Website"}
              </p>
            </header>

            {resume.summary && <section className="resume-paper-section"><h3>Profile</h3><p>{resume.summary}</p></section>}

            {resume.experience.some((entry) => entry.role || entry.company || entry.description) && (
              <section className="resume-paper-section">
                <h3>Experience</h3>
                {resume.experience.filter((entry) => entry.role || entry.company || entry.description).map((entry, index) => (
                  <div className="resume-paper-entry" key={`preview-experience-${index}`}>
                    <div className="resume-paper-entry-heading">
                      <strong>{entry.role || entry.company}</strong>
                      <span>{entry.dates}</span>
                    </div>
                    {entry.role && entry.company && <p className="resume-company">{entry.company}</p>}
                    {entry.description && <p>{entry.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {resume.education.some((entry) => entry.degree || entry.school) && (
              <section className="resume-paper-section">
                <h3>Education</h3>
                {resume.education.filter((entry) => entry.degree || entry.school).map((entry, index) => (
                  <div className="resume-paper-entry" key={`preview-education-${index}`}>
                    <div className="resume-paper-entry-heading">
                      <strong>{entry.degree || entry.school}</strong>
                      <span>{entry.dates}</span>
                    </div>
                    {entry.degree && entry.school && <p className="resume-company">{entry.school}</p>}
                  </div>
                ))}
              </section>
            )}

            {skills.length > 0 && (
              <section className="resume-paper-section">
                <h3>Skills</h3>
                <div className="resume-skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </section>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
