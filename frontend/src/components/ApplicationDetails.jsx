import { BriefcaseBusiness, MapPin, CalendarDays, BadgeCheck } from "lucide-react";

const stages = ["Applied", "Under Review", "Shortlisted", "Decision"];

export default function ApplicationDetails({ application }) {
  if (!application) {
    return (
      <section className="details empty-details">
        <div className="empty-icon"><BriefcaseBusiness size={27} /></div>
        <h2>Select an application</h2>
        <p>Choose an application from the list to see its details.</p>
      </section>
    );
  }

  const statusIndex = application.status === "Rejected"
    ? 3
    : Math.max(0, stages.indexOf(application.status));

  return (
    <article className="details">
      <div className="detail-top">
        <div className="company-logo large" style={{ background: application.color }}>
          {application.company.charAt(0).toUpperCase()}
        </div>
        <span className={`status status-${application.status.toLowerCase().replaceAll(" ", "-")}`}>
          {application.status}
        </span>
      </div>

      <h2>{application.role}</h2>
      <p className="detail-company">{application.company}</p>

      <div className="detail-chips">
        <span><MapPin size={15} />{application.location}</span>
        <span><BriefcaseBusiness size={15} />{application.type}</span>
        <span><CalendarDays size={15} />Applied {application.appliedDate}</span>
      </div>

      <div className="match-panel">
        <div className="match-icon"><BadgeCheck size={20} /></div>
        <div>
          <strong>{application.match ? `${application.match}% profile match` : "Application added"}</strong>
          <p>{application.match ? "Sample match score for this demo." : "Your new application is now in the list."}</p>
        </div>
      </div>

      <section className="detail-section">
        <h3>Application timeline</h3>
        <div className="timeline">
          {stages.map((stage, index) => (
            <div className={`timeline-stage ${index < statusIndex ? "complete" : ""} ${index === statusIndex ? "current" : ""}`} key={stage}>
              <span className="timeline-dot">{index < statusIndex ? "✓" : index + 1}</span>
              <span>{stage}</span>
            </div>
          ))}
        </div>
        <p className="timeline-note">
          {application.status === "Rejected"
            ? "This application is closed. Keep the record for future reference."
            : application.status === "Shortlisted"
            ? "Great progress! Prepare your portfolio and interview examples."
            : application.status === "Under Review"
            ? "The employer is reviewing your application. Keep preparing."
            : "Your application has been recorded. Check back for updates."}
        </p>
      </section>

      <section className="detail-section">
        <h3>About the role</h3>
        <p>{application.description}</p>
        <div className="role-facts">
          <div><span>Compensation</span><strong>{application.salary || "Not specified"}</strong></div>
          <div><span>Application type</span><strong>{application.type}</strong></div>
        </div>
      </section>
    </article>
  );
}
