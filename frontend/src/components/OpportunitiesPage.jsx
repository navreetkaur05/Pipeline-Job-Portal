import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Search } from "lucide-react";
import ApplicationCard from "./ApplicationCard.jsx";
import ApplicationDetails from "./ApplicationDetails.jsx";

const opportunityTypes = ["All opportunities", "Internship", "Full-time", "Scholarship", "Training"];
const pageSize = 3;

export default function OpportunitiesPage({
  applications,
  selectedId,
  onSelect,
  onViewApplications,
  loading,
  error
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All opportunities");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);

  const opportunities = useMemo(() => applications.filter((application) => {
    const text = `${application.role} ${application.company} ${application.location} ${application.type}`.toLowerCase();
    return (
      (type === "All opportunities" || application.type === type) &&
      (statusFilter === "All statuses" || application.status === statusFilter) &&
      text.includes(search.trim().toLowerCase())
    );
  }), [applications, search, statusFilter, type]);

  const pageCount = Math.max(1, Math.ceil(opportunities.length / pageSize));
  const pageOpportunities = opportunities.slice((page - 1) * pageSize, page * pageSize);
  const opportunityLabel = (count) => `matching opportunit${count === 1 ? "y" : "ies"}`;
  const selectedOpportunity = opportunities.find((item) => item.id === selectedId);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, type]);

  useEffect(() => {
    if (pageOpportunities.length && !pageOpportunities.some((item) => item.id === selectedId)) {
      onSelect(pageOpportunities[0].id);
    }
  }, [onSelect, pageOpportunities, selectedId]);

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">FIND YOUR NEXT STEP</p>
          <h1>Explore opportunities<span>.</span></h1>
          <p className="hero-subtitle">Browse roles and programs, then select one to see the details.</p>
        </div>
      </section>

      <section className="workspace opportunity-workspace">
        <div className="workspace-heading">
          <div>
            <h2>Opportunities</h2>
            <p>{opportunities.length} {opportunityLabel(opportunities.length)}</p>
          </div>
        </div>

        <div className="filter-row">
          <label className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search role, company or location..."
              aria-label="Search opportunities"
            />
          </label>
          <select className="status-filter" value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by opportunity type">
            {opportunityTypes.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select className="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by application status">
            {["All statuses", "Applied", "Under Review", "Shortlisted", "Rejected"].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        {error && <div className="error-banner" role="alert">{error}</div>}
        {loading ? (
          <div className="loading-state">Loading opportunities...</div>
        ) : (
          <div className="opportunity-layout">
            <section className="application-list" aria-label="Available opportunities">
              <div className="list-caption">{opportunities.length} {opportunities.length === 1 ? "opportunity" : "opportunities"} found</div>
              {pageOpportunities.length ? pageOpportunities.map((opportunity) => (
                <ApplicationCard
                  key={opportunity.id}
                  application={opportunity}
                  selected={opportunity.id === selectedId}
                  onSelect={onSelect}
                />
              )) : (
                <div className="empty-list">
                  <BriefcaseBusiness size={28} />
                  <strong>No opportunities found</strong>
                  <p>Try a different search or filter.</p>
                </div>
              )}
              {opportunities.length > pageSize && (
                <nav className="pagination opportunity-pagination" aria-label="Opportunity pages">
                  <span>
                    Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, opportunities.length)} of {opportunities.length}
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
                </nav>
              )}
            </section>
            <div className="opportunity-detail">
              <ApplicationDetails application={selectedOpportunity} />
              {selectedOpportunity && (
                <button type="button" className="primary-button opportunity-action" onClick={onViewApplications}>
                  View application status
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
