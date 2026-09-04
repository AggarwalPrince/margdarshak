import { useState } from "react";
import { api } from "../api";
import { t } from "../i18n";

const REQUIRED_DOCS = ["Aadhaar Card (e-KYC Proof)", "Caste Certificate", "Income Certificate / Self-Declaration"];

export default function ApplicationUpload({ lang, mobile, scheme, formData, onDone }) {
  const [uploaded, setUploaded] = useState({
    "Aadhaar Card (e-KYC Proof)": "aadhaar_verified_doc.pdf",
    "Caste Certificate": "caste_certificate_sc.pdf",
    "Income Certificate / Self-Declaration": "income_declaration.pdf",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleFile(doc, file) {
    setUploaded((u) => ({ ...u, [doc]: file?.name || null }));
  }

  const allUploaded = REQUIRED_DOCS.every((d) => uploaded[d]);

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    try {
      const res = await api.submitApplication({
        mobile,
        schemeId: scheme.id,
        formData: {
          ...formData,
          applicantName: formData?.applicantName || "Registered Citizen Beneficiary",
          loanAmount: formData?.loanAmount || Math.round(scheme.maxProjectCost * (scheme.govtSharePct / 100) * 0.5),
          projectCost: formData?.projectCost || scheme.maxProjectCost,
          documents: Object.keys(uploaded),
        },
      });
      onDone(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const loanAmount = Number(formData?.loanAmount || 100000);
  const emi = Number(formData?.emi || 0);

  return (
    <div className="panel" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12, marginBottom: 18 }}>
        <span className="eyebrow-pill">Step 7 of 8 · Application Dossier</span>
        <h2 style={{ fontSize: 20, margin: "6px 0 2px" }}>Upload Verification Documents</h2>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
          Final verification for your concessional loan application before submittal to the Nodal Agency.
        </p>
      </div>

      {/* Summary Terms Card */}
      <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>Required Loan</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0b2545" }}>₹{loanAmount.toLocaleString("en-IN")}</div>
          </div>
          <div>
            <span style={{ fontSize: 11, textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>Monthly EMI</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0284c7" }}>
              {emi > 0 ? `₹${emi.toLocaleString("en-IN")}` : "Calculated"}
              <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>/mo</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>Scheme &amp; Rate</span>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0b2545" }}>{scheme.code} ({scheme.interestRate}%)</div>
          </div>
        </div>
      </div>

      <div className="card-list">
        {REQUIRED_DOCS.map((doc) => (
          <div key={doc} className="field" style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: 14, borderRadius: 6 }}>
            <label style={{ fontWeight: 700, fontSize: 13.5 }}>{doc} *</label>
            <input type="file" onChange={(e) => handleFile(doc, e.target.files[0])} />
            {uploaded[doc] && (
              <div className="field-hint" style={{ color: "#059669", fontWeight: 600, marginTop: 4 }}>
                ✓ {uploaded[doc]} (Verified for demo)
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <div className="field-error" style={{ marginTop: 12 }}>{error}</div>}

      <div className="form-actions" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={!allUploaded || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting Application Dossier…" : `Submit Application for ₹${loanAmount.toLocaleString("en-IN")} Loan →`}
        </button>
      </div>

      <p className="footnote" style={{ textAlign: "center", marginTop: 14 }}>
        Demo Prototype: Sample test documents are pre-attached for seamless judging demonstration.
      </p>
    </div>
  );
}
