import { useState } from "react";
import { api } from "../api";
import { t } from "../i18n";

const PROJECT_TYPES = ["Retail", "Agriculture", "Services", "Transport", "Manufacturing", "Education", "Handicrafts"];

const QUICK_LOANS = [50000, 100000, 140000, 250000, 500000];

// Standard reducing-balance EMI formula
function calcEmi(principal, annualRatePct, months) {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return Math.round((principal * r * factor) / (factor - 1));
}

export default function SchemeMatcher({ lang, onSelect }) {
  const [form, setForm] = useState({
    category: "SC",
    income: "240000",
    projectType: "Retail",
    loanAmount: "100000",
    projectCost: "111111", // ~90% loan
  });
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLoanAmountChange(val) {
    const num = Number(val) || 0;
    // Assume typical 90% govt share to compute implied project cost
    const impliedCost = Math.round(num / 0.9);
    setForm((f) => ({
      ...f,
      loanAmount: val,
      projectCost: impliedCost > 0 ? String(impliedCost) : "",
    }));
  }

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        projectCost: form.projectCost || form.loanAmount,
      };
      const res = await api.matchSchemes(payload);
      setMatches(res.matches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const requestedLoan = Number(form.loanAmount) || 100000;

  return (
    <div className="panel" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 14, marginBottom: 20 }}>
        <span className="eyebrow-pill">Eligibility &amp; Scheme Matching</span>
        <h2 style={{ fontSize: 20, margin: "6px 0 2px" }}>
          Tell us your required loan amount
        </h2>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Enter the loan assistance you need to start or expand your enterprise. We will match eligible MoSJE schemes and calculate your monthly EMI.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 1. REQUIRED LOAN AMOUNT (PROMINENT INPUT) */}
        <div className="field" style={{ background: "#f8fafc", padding: 16, borderRadius: 8, border: "2px solid #0b2545" }}>
          <label style={{ fontSize: 15, fontWeight: 800, color: "#0b2545", display: "flex", justifyContent: "space-between" }}>
            <span>💰 {t(lang, "loanAmount")} *</span>
            <span style={{ color: "#0284c7", fontWeight: 600 }}>
              Selected: ₹{Number(requestedLoan).toLocaleString("en-IN")}
            </span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0b2545" }}>₹</span>
            <input
              type="number"
              style={{ fontSize: 18, fontWeight: 700, padding: "10px 14px" }}
              placeholder="e.g. 100000"
              value={form.loanAmount}
              onChange={(e) => handleLoanAmountChange(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Quick Select:</span>
            {QUICK_LOANS.map((amt) => (
              <button
                key={amt}
                type="button"
                className="filter-chip"
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  background: Number(form.loanAmount) === amt ? "#0b2545" : "#ffffff",
                  color: Number(form.loanAmount) === amt ? "#ffffff" : "#1e293b",
                  border: "1px solid #cbd5e1",
                }}
                onClick={() => handleLoanAmountChange(amt)}
              >
                ₹{amt.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>

        {/* 2. OTHER ELIGIBILITY CRITERIA */}
        <div className="calc-grid" style={{ marginTop: 16 }}>
          <div className="field">
            <label>{t(lang, "category")}</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option value="SC">Scheduled Caste (verified certificate)</option>
              <option value="SC-pending">Scheduled Caste (undertaking declaration)</option>
            </select>
          </div>

          <div className="field">
            <label>{t(lang, "income")}</label>
            <input
              type="number"
              placeholder="e.g. 240000"
              value={form.income}
              onChange={(e) => update("income", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>{t(lang, "projectType")}</label>
            <select value={form.projectType} onChange={(e) => update("projectType", e.target.value)}>
              {PROJECT_TYPES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{t(lang, "projectCost")}</label>
            <input
              type="number"
              placeholder="Implied total project cost"
              value={form.projectCost}
              onChange={(e) => update("projectCost", e.target.value)}
            />
          </div>
        </div>

        {error && <div className="field-error" style={{ marginBottom: 14 }}>{error}</div>}

        <div className="form-actions" style={{ marginTop: 10 }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Calculating Matching Schemes & EMI…" : `🔍 Find Eligible Schemes for ₹${Number(requestedLoan).toLocaleString("en-IN")} →`}
          </button>
        </div>
      </form>

      {/* MATCH RESULTS WITH LIVE EMI DISPLAY */}
      {matches !== null && (
        <div style={{ marginTop: 28, borderTop: "2px solid var(--navy)", paddingTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, margin: "0 0 4px" }}>
                {t(lang, "recommended")} ({matches.length})
              </h3>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)" }}>
                Schemes below can fund your required loan of <strong>₹{requestedLoan.toLocaleString("en-IN")}</strong>. Monthly EMI is calculated directly on your loan figure.
              </p>
            </div>
          </div>

          {matches.length === 0 && (
            <div className="panel" style={{ background: "#fffbeb", textAlign: "center", padding: 24 }}>
              <p style={{ margin: 0, color: "#92400e" }}>
                No schemes matched this specific loan amount and sector combination. Try adjusting the loan amount or sector above.
              </p>
            </div>
          )}

          <div className="card-list">
            {matches.map((s) => {
              const maxSchemeLoan = Math.round(s.maxProjectCost * (s.govtSharePct / 100));
              const actualLoan = Math.min(requestedLoan, maxSchemeLoan);
              const estimatedMonthlyEmi = calcEmi(actualLoan, s.interestRate, s.tenureMonths);

              return (
                <div
                  key={s.id}
                  className="scheme-card"
                  style={{
                    border: "1.5px solid #cbd5e1",
                    borderLeft: "5px solid #0b2545",
                    padding: "20px 22px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <span className="badge badge-published">{s.code}</span>
                      <h3 style={{ margin: "6px 0 4px", fontSize: 18 }}>{s.name}</h3>
                      <p className="desc" style={{ margin: "0 0 12px" }}>{s.description}</p>
                    </div>

                    {/* LIVE EMI HIGHLIGHT BADGE */}
                    <div
                      style={{
                        background: "#f0f9ff",
                        border: "1.5px solid #0284c7",
                        borderRadius: 8,
                        padding: "10px 16px",
                        textAlign: "right",
                        minWidth: 160,
                      }}
                    >
                      <span style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: "#0369a1" }}>
                        Monthly EMI for ₹{actualLoan.toLocaleString("en-IN")}
                      </span>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#0b2545", margin: "2px 0" }}>
                        ₹{estimatedMonthlyEmi.toLocaleString("en-IN")}
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>/mo</span>
                      </div>
                      <span style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>
                        {s.moratoriumMonths} Months Moratorium
                      </span>
                    </div>
                  </div>

                  <div className="scheme-meta" style={{ marginTop: 12 }}>
                    <div className="meta-item">
                      <span className="label">Concessional Rate</span>
                      <span className="value">{s.interestRate}% p.a.</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Govt Share</span>
                      <span className="value">{s.govtSharePct}%</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Max Eligible Loan</span>
                      <span className="value">up to ₹{maxSchemeLoan.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Tenure</span>
                      <span className="value">{s.tenureMonths} months</span>
                    </div>
                  </div>

                  <div className="form-actions" style={{ marginTop: 16 }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        onSelect(s, {
                          ...form,
                          loanAmount: actualLoan,
                          projectCost: Math.round(actualLoan / (s.govtSharePct / 100)),
                        })
                      }
                    >
                      Select Scheme &amp; Adjust Amortisation Schedule →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
