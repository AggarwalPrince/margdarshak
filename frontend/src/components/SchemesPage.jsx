import { useEffect, useState } from "react";
import { api } from "../api";

const fmtRs = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function SchemesPage({ onApply, onDirectApply }) {
  const [schemes, setSchemes] = useState(null);
  const [sectorFilter, setSectorFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getSchemes()
      .then((data) => setSchemes(data))
      .catch((err) => setError(err.message || "Could not load schemes"));
  }, []);

  const sectors = ["ALL", "Retail", "Agriculture", "Services", "Education", "Transport", "Handicrafts"];

  const filtered = schemes
    ? schemes.filter((s) => {
        const matchesSector = sectorFilter === "ALL" || s.projectTypes?.includes(sectorFilter);
        const matchesSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.code.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase());
        return matchesSector && matchesSearch;
      })
    : [];

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">Gazette Notified Schemes</span>
        <h1>Concessional Loan Schemes for Beneficiaries</h1>
        <p>
          Notified credit schemes designed by the <strong>National Scheduled Castes Finance &amp; Development Corporation (NSFDC)</strong> and administrative Ministry. All schemes feature subsidised interest rates, a mandatory government-to-beneficiary split, and an initial repayment moratorium.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="directory-filter-bar">
        <div className="filter-group">
          <label>Filter by Sector:</label>
          <div className="filter-chips">
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                className={`filter-chip ${sectorFilter === sec ? "active" : ""}`}
                onClick={() => setSectorFilter(sec)}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <div className="search-box-wrap">
          <input
            type="text"
            className="directory-search-input"
            placeholder="Search schemes by keyword, code, or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {!schemes && !error && <p className="footnote">Loading notified schemes…</p>}

      {schemes && (
        <div className="card-list">
          {filtered.map((s) => (
            <div key={s.id} className="scheme-card scheme-card-full">
              <div className="scheme-card-top">
                <div>
                  <span className="badge badge-published">{s.code}</span>
                  <h3 style={{ margin: "4px 0 2px" }}>{s.name}</h3>
                </div>
                <span className="scheme-version">v{s.version} · Effective {s.effectiveFrom}</span>
              </div>
              <p className="desc">{s.description}</p>

              <div className="scheme-meta">
                <div className="meta-item">
                  <span className="label">Concessional Interest</span>
                  <span className="value">{s.interestRate}% p.a.</span>
                </div>
                <div className="meta-item">
                  <span className="label">Govt : Beneficiary Share</span>
                  <span className="value">{s.govtSharePct}% : {s.beneficiarySharePct}%</span>
                </div>
                <div className="meta-item">
                  <span className="label">Moratorium Period</span>
                  <span className="value">{s.moratoriumMonths} months</span>
                </div>
                <div className="meta-item">
                  <span className="label">Repayment Tenure</span>
                  <span className="value">up to {s.tenureMonths} months</span>
                </div>
                <div className="meta-item">
                  <span className="label">Project Cost Range</span>
                  <span className="value">{fmtRs(s.minProjectCost)} – {fmtRs(s.maxProjectCost)}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Max Family Annual Income</span>
                  <span className="value">{fmtRs(s.maxIncome)}</span>
                </div>
              </div>

              <div className="scheme-tags">
                {s.projectTypes.map((p) => (
                  <span key={p} className="scheme-tag">
                    {p}
                  </span>
                ))}
              </div>

              <div className="form-actions" style={{ marginTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onApply(s)}
                >
                  🧮 Estimate EMI &amp; Amortisation
                </button>
                {onDirectApply && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => onDirectApply(s)}
                  >
                    Apply for this Scheme →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="footnote" style={{ marginTop: 28 }}>
        <strong>Legislative &amp; Audit Integrity:</strong> Scheme terms are locked in at the time of online application submission. Revisions approved through the Maker-Checker administrative workflow apply only to subsequent application batches.
      </p>
    </div>
  );
}
