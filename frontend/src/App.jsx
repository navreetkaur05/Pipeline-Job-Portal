import { useEffect, useMemo, useState } from "react";
import { Plus, Search, BriefcaseBusiness, GraduationCap, BookOpen, RefreshCw } from "lucide-react";
import Header from "./components/Header.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ApplicationCard from "./components/ApplicationCard.jsx";
import ApplicationDetails from "./components/ApplicationDetails.jsx";
import AddApplicationForm from "./components/AddApplicationForm.jsx";
import OpportunitiesPage from "./components/OpportunitiesPage.jsx";
import ResumePage from "./components/ResumePage.jsx";
import {
  createApplication,
  getApplicationById,
  getApplications,
  loginUser,
  registerUser
} from "./api/applicationApi.js";

const tabs = [
  { label: "All applications", value: "All", icon: BriefcaseBusiness },
  { label: "Internships & jobs", value: "Work", icon: BriefcaseBusiness },
  { label: "Scholarships", value: "Scholarship", icon: GraduationCap },
  { label: "Training", value: "Training", icon: BookOpen }
];

const filters = ["All statuses", "Applied", "Under Review", "Shortlisted", "Rejected"];
const pageSize = 3;

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("pipelineToken"));
  const [email, setEmail] = useState(() => localStorage.getItem("pipelineEmail") || "");
  const [currentPage, setCurrentPage] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    if (!token) return;
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
  }, [token]);

  useEffect(() => {
    const expireSession = () => {
      setToken(null);
      setEmail("");
      setApplications([]);
      setSelectedId(null);
      setSelectedApplication(null);
    };
    window.addEventListener("pipeline:auth-expired", expireSession);
    return () => window.removeEventListener("pipeline:auth-expired", expireSession);
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
  const pageCount = Math.max(1, Math.ceil(visibleApplications.length / pageSize));
  const pageApplications = visibleApplications.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [activeTab, statusFilter, search]);

  useEffect(() => {
    if (!pageApplications.length) {
      setSelectedId(null);
      setSelectedApplication(null);
      return;
    }
    if (!pageApplications.some((application) => application.id === selectedId)) {
      setSelectedId(pageApplications[0].id);
      setSelectedApplication(pageApplications[0]);
    }
  }, [pageApplications, selectedId]);

  const authenticate = async (mode, credentials) => {
    const result = mode === "register"
      ? await registerUser(credentials)
      : await loginUser(credentials);
    localStorage.setItem("pipelineToken", result.token);
    localStorage.setItem("pipelineEmail", result.user.email);
    setToken(result.token);
    setEmail(result.user.email);
    setError("");
  };

  const logout = () => {
    localStorage.removeItem("pipelineToken");
    localStorage.removeItem("pipelineEmail");
    setToken(null);
    setEmail("");
    setApplications([]);
    setSelectedId(null);
    setSelectedApplication(null);
  };

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
      setPage(1);
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
  const latestJobNotifications = useMemo(
    () => applications
      .filter((application) => ["Internship", "Full-time"].includes(application.type))
      .sort((first, second) =>
        new Date(second.postedDate || second.appliedDate).getTime() -
        new Date(first.postedDate || first.appliedDate).getTime()
      )
      .slice(0, 3),
    [applications]
  );

  if (!token) {
    return <AuthPage onAuthenticate={authenticate} />;
  }

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <div className="app-frame">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          email={email}
          onLogout={logout}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          jobNotifications={latestJobNotifications}
          onJobNotificationSelect={(applicationId) => {
            setSelectedId(applicationId);
            setCurrentPage("opportunities");
          }}
        />

        <main id="main" className={currentPage === "resume" ? "resume-main" : ""}>
          {currentPage === "opportunities" ? (
            <OpportunitiesPage
              applications={applications}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onViewApplications={() => setCurrentPage("applications")}
              loading={loading}
              error={error}
            />
          ) : currentPage === "resume" ? (
            <ResumePage email={email} />
          ) : (
            <>
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
                  {pageApplications.length ? pageApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} selected={application.id === selectedId} onSelect={setSelectedId} />
                  )) : (
                    <div className="empty-list">
                      <BriefcaseBusiness size={28} />
                      <strong>No applications found</strong>
                      <p>Try changing the filters or add a new application.</p>
                    </div>
                  )}
                  {visibleApplications.length > pageSize && (
                    <div className="pagination" aria-label="Application pages">
                      <span>
                        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, visibleApplications.length)} of {visibleApplications.length}
                      </span>
                      <div>
                        <button type="button" className="secondary-button" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>
                          Previous
                        </button>
                        <span className="page-number">Page {page} of {pageCount}</span>
                        <button type="button" className="secondary-button" onClick={() => setPage((current) => current + 1)} disabled={page === pageCount}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </section>
                <ApplicationDetails application={pageApplications.find((item) => item.id === selectedId) || selectedApplication} />
              </div>
            )}
          </section>
            </>
          )}
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
