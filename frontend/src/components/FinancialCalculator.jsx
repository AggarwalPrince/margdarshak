import { useMemo, useState } from "react";
import { t } from "../i18n";

// Standard reducing-balance EMI formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
function calcEmi(principal, annualRatePct, months) {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

export default function FinancialCalculator({ lang, scheme, formData, onContinue }) {
  const govtShare = scheme.govtSharePct / 100;
  const minProjectCost = scheme.minProjectCost || 10000;
  const minLoan = Math.round(minProjectCost * govtShare);
  const maxLoan = Math.round(scheme.maxProjectCost * govtShare);

  // Initialize from previous step or default
  const defaultLoan = formData?.loanAmount
    ? Number(formData.loanAmount)
    : formData?.projectCost
    ? Math.round(Number(formData.projectCost) * govtShare)
    : Math.min(100000, maxLoan);

  const [loanAmount, setLoanAmount] = useState(Math.min(maxLoan, Math.max(minLoan, defaultLoan)));
  const [tenure, setTenure] = useState(scheme.tenureMonths || 36);

  function handleLoanInput(val) {
    const num = Number(val);
    setLoanAmount(num);
  }

  const validLoan = Math.min(maxLoan, Math.max(minLoan, loanAmount || minLoan));
  const projectCost = useMemo(() => validLoan / govtShare, [validLoan, govtShare]);
  const beneficiaryContribution = projectCost - validLoan;

  const emi = useMemo(() => calcEmi(validLoan, scheme.interestRate, tenure), [validLoan, scheme.interestRate, tenure]);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - validLoan;

  const fmt = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  const QUICK_PRESETS = [
    { label: "₹50,000", val: 50000 },
    { label: "₹1,00,000", val: 100000 },
    { label: "₹1,40,000", val: 140000 },
    { label: "₹2,50,000", val: 250000 },
    { label: `Max (₹${(maxLoan / 100000).toFixed(1)}L)`, val: maxLoan },
  ].filter((p) => p.val <= maxLoan);

  return (
    <div className="panel" style={{ maxWidth: 840, margin: "0 auto" }}>
      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge badge-published">{scheme.code}</span>
            <h2 style={{ fontSize: 20, margin: "6px 0 2px" }}>{scheme.name} — EMI Calculator</h2>
          </div>
          <span className="scheme-version">v{scheme.version} · Notified Scheme</span>
        </div>
        <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 13.5 }}>
          Enter your exact required loan amount. Monthly EMI and moratorium are computed dynamically.
        </p>
      </div>

      {/* 1. DIRECT LOAN AMOUNT INPUT */}
      <div style={{ background: "#f8fafc", border: "2px solid #0b2545", borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <label style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#0b2545", marginBottom: 8 }}>
          <span>💰 Enter Loan Amount You Need (₹)</span>
          <span style={{ color: "#0284c7" }}>Range: {fmt(minLoan)} – {fmt(maxLoan)}</span>
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0b2545" }}>₹</span>
          <input
            type="number"
            min={minLoan}
            max={maxLoan}
            step={5000}
            value={loanAmount}
            onChange={(e) => handleLoanInput(e.target.value)}
            style={{ fontSize: 20, fontWeight: 800, padding: "10px 14px", flex: 1, borderRadius: 6, border: "2px solid #cbd5e1" }}
            placeholder="Type loan amount..."
          />
        </div>

        {/* Range slider */}
        <div style={{ marginTop: 14 }}>
          <input
            type="range"
            min={minLoan}
            max={maxLoan}
            step={5000}
            value={validLoan}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#0b2545" }}
          />
        </div>

        {/* Quick select buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Quick Amounts:</span>
          {QUICK_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="filter-chip"
              style={{
                background: validLoan === p.val ? "#0b2545" : "#ffffff",
                color: validLoan === p.val ? "#ffffff" : "#1e293b",
                border: "1px solid #cbd5e1",
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 600,
              }}
              onClick={() => setLoanAmount(p.val)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. REPAYMENT TENURE */}
      <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 8, padding: 18, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
            📅 Repayment Tenure: <strong>{tenure} months</strong> ({Math.round(tenure / 12 * 10) / 10} years)
          </label>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Max allowed: {scheme.tenureMonths} months</span>
        </div>

        <input
          type="range"
          min={12}
          max={scheme.tenureMonths}
          step={6}
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#0284c7" }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {[12, 24, 36, 48, 60, scheme.tenureMonths]
            .filter((v, i, a) => v <= scheme.tenureMonths && a.indexOf(v) === i)
            .map((m) => (
              <button
                key={m}
                type="button"
                className="filter-chip"
                style={{
                  background: tenure === m ? "#0284c7" : "#f1f5f9",
                  color: tenure === m ? "#ffffff" : "#334155",
                  border: "1px solid #cbd5e1",
                  fontSize: 12,
                }}
                onClick={() => setTenure(m)}
              >
                {m} mo ({m / 12} yr)
              </button>
            ))}
        </div>
      </div>

      {/* 3. PROMINENT LIVE EMI RESULT CARD */}
      <div
        className="calc-result"
        style={{
          background: "linear-gradient(135deg, #0b2545 0%, #163e66 100%)",
          color: "#ffffff",
          borderRadius: 10,
          padding: "24px 20px",
          textAlign: "center",
          marginBottom: 24,
          boxShadow: "0 6px 18px rgba(11, 37, 69, 0.2)",
        }}
      >
        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fbbf24", fontWeight: 800 }}>
          Your Estimated Monthly Repayment
        </span>
        <div style={{ fontSize: 38, fontWeight: 900, color: "#ffffff", margin: "6px 0 2px" }}>
          {fmt(emi)}
          <span style={{ fontSize: 16, fontWeight: 600, color: "#93c5fd" }}> / month</span>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.12)", display: "inline-block", padding: "4px 14px", borderRadius: 999, fontSize: 13, margin: "8px 0 16px", color: "#6ee7b7", fontWeight: 700 }}>
          ✓ {scheme.moratoriumMonths} Months Moratorium (Zero principal EMI during start-up period)
        </div>

        <div className="calc-breakdown" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24" }}>{scheme.interestRate}%</div>
            <div style={{ fontSize: 12, color: "#cbd5e1" }}>Concessional Rate</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24" }}>{fmt(totalInterest)}</div>
            <div style={{ fontSize: 12, color: "#cbd5e1" }}>Total Interest</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24" }}>{fmt(totalPayable)}</div>
            <div style={{ fontSize: 12, color: "#cbd5e1" }}>Total Repayment</div>
          </div>
        </div>
      </div>

      {/* 4. SUBSIDY & CONTRIBUTION BREAKDOWN */}
      <div className="calc-grid" style={{ marginBottom: 20 }}>
        <div className="field" style={{ background: "#f8fafc", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}>
          <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase" }}>Loan Requested</label>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0b2545" }}>{fmt(validLoan)}</div>
          <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>NSFDC Refinance ({scheme.govtSharePct}%)</span>
        </div>

        <div className="field" style={{ background: "#f8fafc", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}>
          <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase" }}>Implied Total Project Cost</label>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0b2545" }}>{fmt(projectCost)}</div>
          <span style={{ fontSize: 12, color: "#64748b" }}>Unit setup &amp; equipment</span>
        </div>

        <div className="field" style={{ background: "#f8fafc", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}>
          <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase" }}>Beneficiary Contribution</label>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0b2545" }}>{fmt(beneficiaryContribution)}</div>
          <span style={{ fontSize: 12, color: "#d97706", fontWeight: 600 }}>Your share ({scheme.beneficiarySharePct}%)</span>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() =>
            onContinue({
              loanAmount: validLoan,
              projectCost: Math.round(projectCost),
              tenure,
              emi: Math.round(emi),
            })
          }
        >
          Confirm {fmt(validLoan)} Loan &amp; Choose Nearby Bank Branch →
        </button>
      </div>
    </div>
  );
}
