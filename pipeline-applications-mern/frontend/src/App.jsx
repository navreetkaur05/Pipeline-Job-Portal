import { useEffect, useMemo, useState } from "react";
import { Plus, Search, BriefcaseBusiness, GraduationCap, BookOpen, RefreshCw } from "lucide-react";
import Header from "./components/Header.jsx";
import ApplicationCard from "./components/ApplicationCard.jsx";
import ApplicationDetails from "./components/ApplicationDetails.jsx";
import AddApplicationForm from "./components/AddApplicationForm.jsx";
import { getApplications, getApplicationById, createApplication } from "./api/applicationApi.js";

const tabs = [
  { label: "All applications", value: "All", icon: BriefcaseBusiness },
  { label: "Internships & jobs", value: "Work", icon: BriefcaseBusiness },
  { label: "Scholarships", value: "Scholarship", icon: GraduationCap },
  { label: "Training", value: "Training", icon: BookOpen }
];

const filters = ["All statuses", "Applied", "Under Review", "Shortlisted", "Rejected"];

export default function App() {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setError("");
      const data = await getApplications();
      setApplications(data);
      if (data.length && !selectedId) {
        setSelectedId(data[0].id);
        setSelectedApplication(data[0]);
      }
    } catch {
      setError("Could not connect to the API. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    getApplicationById(selectedId)
      .then(setSelectedApplication)
      .catch(() => setSelectedApplication(null));
  }, [selectedId, applications.length]);

  const visibleApplications = useMemo(() => applications.filter((app) => {
    const matchesTab = activeTab === "All"
      || (activeTab === "Work" && ["Internship", "Full-time"].includes(app.type))
      || app.type === activeTab;
    const matchesStatus = statusFilter === "All statuses" || app.status === statusFilter;
    const text = `${app.role} ${app.company} ${app.location}`.toLowerCase();
    return matchesTab && matchesStatus && text.includes(search.toLowerCase());
  }), [applications, activeTab, statusFilter, search]);

  const createNewApplication = async (formData) => {
    try {
      setSaving(true);
      setError("");
      const created = await createApplication(formData);
      setApplications((current) => [created, ...current]);
      setSelectedId(created.id);
      setSelectedApplication(created);
      setActiveTab("All");
      setStatusFilter("All statuses");
      setSearch("");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the application. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    review: applications.filter((app) => app.status === "Under Review").length,
    shortlisted: applications.filter((app) => app.status === "Shortlisted").length
  };

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <div className="app-frame">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main id="main">
          <section className="hero">
            <div>
              <p className="eyebrow">YOUR CAREER, ORGANIZED</p>
              <h1>My applications<span>.</span></h1>
              <p className="hero-subtitle">Keep every opportunity moving forward, all in one place.</p>
            </div>
            <button className="primary-button add-button" onClick={() => setShowForm(true)}>
              <Plus size={18} /> Add application
            </button>
          </section>

          <section className="stats-grid" aria-label="Application summary">
            <div className="stat-card"><span>Total applications</span><strong>{counts.total}</strong><small>Across all opportunities</small></div>
            <div className="stat-card"><span>Applied</span><strong>{counts.applied}</strong><small>Waiting for a response</small></div>
            <div className="stat-card"><span>Under review</span><strong>{counts.review}</strong><small>Being considered</small></div>
            <div className="stat-card"><span>Shortlisted</span><strong>{counts.shortlisted}</strong><small>Next step opportunity</small></div>
          </section>

          <section className="workspace">
            <div className="workspace-heading">
              <div>
                <h2>Application pipeline</h2>
                <p>Browse and review your applications.</p>
              </div>
              <button className="refresh-button" onClick={loadApplications} title="Refresh applications">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            <div className="tabs" role="tablist" aria-label="Application type">
              {tabs.map(({ label, value, icon: Icon }) => (
                <button key={value} role="tab" aria-selected={activeTab === value} className={activeTab === value ? "tab active-tab" : "tab"} onClick={() => setActiveTab(value)}>
                  <Icon size={16} />{label}
                  {value === "All" && <span className="tab-count">{applications.length}</span>}
                </button>
              ))}
            </div>

            <div className="filter-row">
              <label className="search-box">
                <Search size={17} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search role, company or location..." />
              </label>
              <select className="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
                {filters.map((filter) => <option key={filter}>{filter}</option>)}
              </select>
            </div>

            {error && <div className="error-banner" role="alert">{error}</div>}

            {loading ? (
              <div className="loading-state">Loading applications from your API...</div>
            ) : (
              <div className="application-layout">
                <section className="application-list" aria-label="Applications list">
                  <div className="list-caption">{visibleApplications.length} application{visibleApplications.length === 1 ? "" : "s"} found</div>
                  {visibleApplications.length ? visibleApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} selected={application.id === selectedId} onSelect={setSelectedId} />
                  )) : (
                    <div className="empty-list">
                      <BriefcaseBusiness size={28} />
                      <strong>No applications found</strong>
                      <p>Try changing the filters or add a new application.</p>
                    </div>
                  )}
                </section>
                <ApplicationDetails application={visibleApplications.find((item) => item.id === selectedId) || selectedApplication} />
              </div>
            )}
          </section>
        </main>

        <footer className="footer">
          <div><a className="footer-brand" href="#main">Pipeline<span>.</span></a><p>A clearer path from application to opportunity.</p></div>
          <p>© 2026 Pipeline · Built with React and Express</p>
        </footer>
      </div>

      {showForm && <AddApplicationForm onClose={() => setShowForm(false)} onCreate={createNewApplication} loading={saving} />}
    </div>
  );
}
