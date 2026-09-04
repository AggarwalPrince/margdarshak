import { useState, useEffect } from "react";
import { api } from "../api";

export default function PartnersDirectoryPage({ onApplyAtPartner }) {
  const [partners, setPartners] = useState([]);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAllPartners()
      .then((data) => setPartners(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const states = ["ALL", ...new Set(partners.map((p) => p.state || "National"))];
  const types = ["ALL", "SCA", "PSB", "RRB", "NBFC-MFI"];

  const filtered = partners.filter((p) => {
    const matchesState = stateFilter === "ALL" || p.state === stateFilter;
    const matchesType = typeFilter === "ALL" || p.type === typeFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesType && matchesSearch;
  });

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">Lending Network</span>
        <h1>Empanelled Channel Partner Institutions</h1>
        <p>
          NSFDC channels credit through accredited State Channelising Agencies (SCAs), Public Sector Banks, Regional Rural Banks, and NBFC-MFIs. To safeguard public funds and beneficiary dignity, MARG continuously tracks branch health (NPA ratio &lt; 10%) and remaining refinance quotas.
        </p>
      </div>

      {/* Directory Filter Bar */}
      <div className="directory-filter-bar">
        <div className="filter-group">
          <label>State / Region:</label>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="filter-select"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All States & UTs" : s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Institution Type:</label>
          <div className="filter-chips">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                className={`filter-chip ${typeFilter === t ? "active" : ""}`}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="search-box-wrap">
          <input
            type="text"
            className="directory-search-input"
            placeholder="Search by bank name, city, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="footnote">Loading empanelled channel partners…</p>}

      {/* Partners Grid */}
      <div className="partners-grid">
        {filtered.map((p) => {
          const isHealthy = p.npaPct <= 10;
          return (
            <div className="partner-card" key={p.id}>
              <div className="partner-card-header">
                <div>
                  <span className={`partner-type-tag tag-${p.type.toLowerCase()}`}>
                    {p.type}
                  </span>
                  <span className="partner-location-tag">
                    📍 {p.city}, {p.state}
                  </span>
                </div>
                {isHealthy ? (
                  <span className="badge badge-published" title="NPA within statutory limit">
                    Healthy (NPA {p.npaPct}%)
                  </span>
                ) : (
                  <span className="badge badge-deprecated" title="NPA exceeds lending threshold">
                    Restricted (NPA {p.npaPct}%)
                  </span>
                )}
              </div>

              <h3 className="partner-name">{p.name}</h3>
              <p className="partner-address">{p.address}</p>

              <div className="partner-metrics">
                <div className="metric-box">
                  <span className="metric-label">Lending Quota Left</span>
                  <div className="quota-bar-wrap">
                    <div
                      className="quota-bar-fill"
                      style={{ width: `${p.quotaRemainingPct}%` }}
                    />
                  </div>
                  <span className="metric-value">{p.quotaRemainingPct}% Available</span>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Branch Contact</span>
                  <span className="metric-value phone-value">📞 {p.phone}</span>
                </div>
              </div>

              <div className="partner-actions">
                <a href={`tel:${p.phone}`} className="btn btn-outline btn-sm">
                  Contact Branch
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel" style={{ marginTop: 32, background: "#f8fafc" }}>
        <h4 style={{ margin: "0 0 8px", fontSize: 16 }}>Criteria for Channel Partner Empanelment</h4>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          In accordance with NSFDC Refinance Guidelines, partner institutions must maintain Net NPAs under 10%, have a dedicated Nodal SC Credit Desk, and disburse sanctioned funds to beneficiary Aadhaar-linked accounts within 14 working days of appraisal.
        </p>
      </div>
    </div>
  );
}
