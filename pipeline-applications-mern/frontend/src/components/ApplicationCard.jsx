import { MapPin, CalendarDays, ArrowUpRight } from "lucide-react";

export default function ApplicationCard({ application, selected, onSelect }) {
  const statusClass = application.status.toLowerCase().replaceAll(" ", "-");

  return (
    <button
      type="button"
      className={`application-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(application.id)}
    >
      <div className="card-heading">
        <div className="company-logo" style={{ background: application.color }}>
          {application.company.charAt(0).toUpperCase()}
        </div>
        <div className="card-title">
          <h3>{application.role}</h3>
          <p>{application.company}</p>
        </div>
        <ArrowUpRight className="card-arrow" size={17} />
      </div>

      <div className="chips">
        <span><MapPin size={13} />{application.location}</span>
        <span>{application.type}</span>
      </div>
      <p className="card-description">{application.description}</p>
      <div className="card-footer">
        <span className={`status status-${statusClass}`}>{application.status}</span>
        <span className="applied-date"><CalendarDays size={13} />{application.appliedDate}</span>
      </div>
    </button>
  );
}
