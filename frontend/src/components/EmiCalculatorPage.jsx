import { useEffect, useState } from "react";
import { api } from "../api";
import FinancialCalculator from "./FinancialCalculator";

export default function EmiCalculatorPage({ lang, presetScheme, onApply }) {
  const [schemes, setSchemes] = useState(null);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(presetScheme?.id || null);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    api
      .getSchemes()
      .then((data) => {
        setSchemes(data);
        if (!selectedId && data.length) setSelectedId(presetScheme?.id || data[0].id);
      })
      .catch((err) => setError(err.message || "Could not load schemes"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedScheme = schemes?.find((s) => s.id === selectedId) || null;

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">NSFDC · Dynamic Loan &amp; EMI Calculator</span>
        <h1>Enter your required loan amount to calculate EMI</h1>
        <p>
          Select a notified scheme below, enter the exact loan amount you need, and adjust the repayment tenure.
          The calculator computes the <strong>monthly EMI, total interest, moratorium grace period, and government subsidy share</strong> in real time.
        </p>
      </div>

      {error && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <p className="field-error" style={{ marginBottom: 8 }}>{error}</p>
        </div>
      )}

      {/* Scheme Selector Pills */}
      {schemes && (
        <div className="panel" style={{ marginBottom: 20, background: "#f8fafc" }}>
          <label style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#475569", display: "block", marginBottom: 8 }}>
            1. Select a Notified Scheme:
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {schemes.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`filter-chip ${selectedId === s.id ? "active" : ""}`}
                style={{
                  fontSize: 13.5,
                  padding: "8px 16px",
                  borderRadius: 6,
                  background: selectedId === s.id ? "#0b2545" : "#ffffff",
                  color: selectedId === s.id ? "#ffffff" : "#1e293b",
                  border: selectedId === s.id ? "2px solid #0b2545" : "1px solid #cbd5e1",
                  fontWeight: selectedId === s.id ? 700 : 500,
                }}
                onClick={() => {
                  setSelectedId(s.id);
                  setLastResult(null);
                }}
              >
                <strong>{s.code}</strong> — {s.name} ({s.interestRate}% p.a.)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Financial Calculator Component with direct loan amount input */}
      {selectedScheme && (
        <FinancialCalculator
          lang={lang}
          scheme={selectedScheme}
          formData={null}
          onContinue={(res) => {
            setLastResult(res);
            onApply(selectedScheme, res);
          }}
        />
      )}
    </div>
  );
}
