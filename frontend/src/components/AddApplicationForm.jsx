import { useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  company: "",
  role: "",
  location: "Remote",
  salary: "",
  type: "Internship",
  status: "Applied",
  appliedDate: new Date().toISOString().slice(0, 10),
  description: ""
};

export default function AddApplicationForm({ onClose, onCreate, loading }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and job role are required.");
      return;
    }
    setError("");
    const created = await onCreate(form);
    if (created) onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">KEEP YOUR SEARCH ORGANIZED</p>
            <h2 id="form-title">Add an application</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close form"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="application-form">
          <label>Company name *
            <input name="company" value={form.company} onChange={update} placeholder="e.g. Acme Technologies" required />
          </label>
          <label>Job role *
            <input name="role" value={form.role} onChange={update} placeholder="e.g. MERN Stack Intern" required />
          </label>
          <div className="form-row">
            <label>Type
              <select name="type" value={form.type} onChange={update}>
                <option>Internship</option><option>Full-time</option><option>Scholarship</option><option>Training</option>
              </select>
            </label>
            <label>Status
              <select name="status" value={form.status} onChange={update}>
                <option>Applied</option><option>Under Review</option><option>Shortlisted</option><option>Rejected</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Location
              <input name="location" value={form.location} onChange={update} placeholder="Remote / Hybrid / City" />
            </label>
            <label>Salary / stipend
              <input name="salary" value={form.salary} onChange={update} placeholder="e.g. ₹20,000/month" />
            </label>
          </div>
          <label>Applied date
            <input type="date" name="appliedDate" value={form.appliedDate} onChange={update} />
          </label>
          <label>Short description
            <textarea name="description" value={form.description} onChange={update} rows="3" placeholder="Add a short note about the role..." />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={loading}>{loading ? "Saving..." : "Save application"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
