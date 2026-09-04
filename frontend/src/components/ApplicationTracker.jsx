import { useState, useEffect } from "react";
import { api } from "../api";

const DEMO_SUGGESTIONS = [
  { id: "MOSJE-582914", label: "Demo ID: MOSJE-582914 (Under Partner Appraisal)" },
  { id: "MOSJE-102938", label: "Demo ID: MOSJE-102938 (Sanctioned & Disbursed)" },
];

export default function ApplicationTracker({ initialTrackingId, onApplyNew }) {
  const [query, setQuery] = useState(initialTrackingId || "");
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState(null);
  const [error, setError] = useState("");

  async function handleSearch(trackingIdToSearch) {
    const id = (trackingIdToSearch || query).trim();
    if (!id) {
      setError("Please enter an Application Tracking ID or registered mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    setApp(null);
    try {
      const data = await api.getApplication(id);
      setApp(data);
    } catch (err) {
      setError(err.message || "No application found with this identifier.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialTrackingId) {
      handleSearch(initialTrackingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTrackingId]);

  function printSlip() {
    window.print();
  }

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">Citizen Service</span>
        <h1>Online Application Status Tracker</h1>
        <p>
          Enter your <strong>MOSJE Tracking ID</strong> (e.g. <code>MOSJE-582914</code>) or registered 10-digit mobile number to inspect the real-time processing stage, nodal scrutiny notes, and channel partner allocation.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="tracker-search-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="tracker-search-form"
        >
          <div className="tracker-input-group">
            <span className="tracker-input-icon">🔍</span>
            <input
              type="text"
              className="tracker-input"
              placeholder="Enter Tracking ID (e.g. MOSJE-582914) or Mobile Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Searching…" : "Track Status →"}
            </button>
          </div>
        </form>

        <div className="tracker-demo-chips">
          <span className="demo-chip-label">Quick Demo IDs for Evaluation:</span>
          {DEMO_SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="demo-id-chip"
              onClick={() => {
                setQuery(s.id);
                handleSearch(s.id);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="panel" style={{ marginTop: 20, borderLeft: "4px solid #d32f2f" }}>
          <p className="field-error" style={{ margin: 0 }}>
            {error}
          </p>
        </div>
      )}

      {/* Result View */}
      {app && (
        <div className="tracker-result-panel" style={{ marginTop: 24 }}>
          {/* Top Status Header */}
          <div className="tracker-result-header">
            <div>
              <span className="badge badge-published" style={{ fontSize: 13, textTransform: "uppercase" }}>
                {app.status}
              </span>
              <h2 style={{ fontSize: 22, marginTop: 8, marginBottom: 4 }}>
                Tracking ID: {app.trackingId}
              </h2>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
                Scheme: <strong>{app.schemeSnapshot?.name || "NSFDC Concessional Loan"}</strong> · Submitted on{" "}
                {new Date(app.submittedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="tracker-header-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={printSlip}>
                🖨️ Print Status Slip
              </button>
            </div>
          </div>

          {/* 4-Stage Progress Stepper */}
          <div className="stage-tracker-container">
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Processing Pipeline</h3>
            <div className="stage-pipeline">
              {[
                { step: 1, title: "e-KYC & Submission", desc: "Aadhaar verified via OTP" },
                { step: 2, title: "District Nodal Scrutiny", desc: "Eligibility & income check" },
                { step: 3, title: "Partner Bank Appraisal", desc: "Field inspection & quota" },
                { step: 4, title: "Sanction & Disbursal", desc: "Credit & subsidy release" },
              ].map((st) => {
                const isCurrent = (app.stage || 1) === st.step;
                const isDone = (app.stage || 1) > st.step;
                return (
                  <div
                    key={st.step}
                    className={`pipeline-step ${isDone ? "step-completed" : isCurrent ? "step-active" : "step-pending"}`}
                  >
                    <div className="step-indicator">
                      {isDone ? "✓" : st.step}
                    </div>
                    <div className="step-info">
                      <div className="step-title">{st.title}</div>
                      <div className="step-desc">{st.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Information Grids */}
          <div className="tracker-details-grid">
            <div className="panel">
              <h4 style={{ fontSize: 15, marginBottom: 12, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                Beneficiary &amp; Project Summary
              </h4>
              <div className="detail-table">
                <div className="detail-row">
                  <span className="label">Applicant Name:</span>
                  <span className="value">{app.formData?.applicantName || "Registered Citizen"}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Registered Mobile:</span>
                  <span className="value">XXXXXX{app.mobile?.slice(-4) || "3210"}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Project Cost:</span>
                  <span className="value">₹{Number(app.formData?.projectCost || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Concessional Loan Amount:</span>
                  <span className="value"><strong>₹{Number(app.formData?.loanAmount || 0).toLocaleString("en-IN")}</strong></span>
                </div>
                <div className="detail-row">
                  <span className="label">Enterprise Sector:</span>
                  <span className="value">{app.formData?.projectType || "Micro-Enterprise"}</span>
                </div>
              </div>
            </div>

            <div className="panel">
              <h4 style={{ fontSize: 15, marginBottom: 12, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                Assigned Channel Partner &amp; Terms
              </h4>
              <div className="detail-table">
                <div className="detail-row">
                  <span className="label">Empanelled Partner:</span>
                  <span className="value">
                    <strong>{app.formData?.partnerName || "State Bank of India — Malviya Nagar"}</strong>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Locked Interest Rate:</span>
                  <span className="value">{app.schemeSnapshot?.interestRate || 5.0}% p.a.</span>
                </div>
                <div className="detail-row">
                  <span className="label">Moratorium Period:</span>
                  <span className="value">{app.schemeSnapshot?.moratoriumMonths || 6} months</span>
                </div>
                <div className="detail-row">
                  <span className="label">Tenure:</span>
                  <span className="value">{app.schemeSnapshot?.tenureMonths || 48} months</span>
                </div>
                <div className="detail-row">
                  <span className="label">Government Subsidy Split:</span>
                  <span className="value">
                    {app.schemeSnapshot?.govtSharePct || 90}% Govt : {app.schemeSnapshot?.beneficiarySharePct || 10}% Beneficiary
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit History Timeline */}
          {app.history && app.history.length > 0 && (
            <div className="panel" style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: 15, marginBottom: 14 }}>Official Action Audit Trail</h4>
              <ul className="timeline-list">
                {app.history.map((h, i) => (
                  <li key={i} className="timeline-item">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong>{h.title}</strong>
                        <span className="timeline-date">{h.date}</span>
                      </div>
                      <p className="timeline-note">{h.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* New Application CTA */}
      <div className="panel" style={{ marginTop: 28, textAlign: "center", background: "#f8fafc" }}>
        <h4 style={{ margin: "0 0 6px", fontSize: 16 }}>Need to apply for a new concessional credit scheme?</h4>
        <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 14 }}>
          Our conversational multilingual assistant matches your project with notified MoSJE/NSFDC schemes in minutes.
        </p>
        <button type="button" className="btn btn-primary" onClick={onApplyNew}>
          Start New Application →
        </button>
      </div>
    </div>
  );
}
