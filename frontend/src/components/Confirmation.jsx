import { t } from "../i18n";

export default function Confirmation({ lang, application, onRestart, onTrack }) {
  function printSlip() {
    window.print();
  }

  function downloadSlip() {
    const text = `GOVERNMENT OF INDIA\nMINISTRY OF SOCIAL JUSTICE & EMPOWERMENT\nNSFDC / MARGDARSHAK DIGITAL PORTAL\n\nACKNOWLEDGMENT RECEIPT\n----------------------------------------\nTracking ID: ${application.trackingId}\nDate of Submission: ${new Date(application.submittedAt).toLocaleString("en-IN")}\nApplicant Mobile: ${application.mobile}\nScheme: ${application.schemeSnapshot?.name} (v${application.schemeSnapshot?.version})\nLocked Interest Rate: ${application.schemeSnapshot?.interestRate}% p.a.\nMoratorium Period: ${application.schemeSnapshot?.moratoriumMonths} months\nGovernment Share: ${application.schemeSnapshot?.govtSharePct}%\nAssigned Partner: ${application.formData?.partnerName || "Assigned Nodal Branch"}\nStatus: Application & e-KYC Submitted (Stage 1)\n----------------------------------------\nTrack online at: Margdarshak Portal -> Application Status Tracker\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${application.trackingId}_Receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="panel confirmation-panel" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
      <div className="confirmation-badge-icon" style={{ fontSize: 48, marginBottom: 12 }}>
        ✅
      </div>
      <span className="eyebrow-pill" style={{ background: "#ecfdf5", color: "#065f46" }}>
        Application Successfully Registered
      </span>
      <h2 style={{ fontSize: 24, margin: "10px 0 6px" }}>
        Concessional Loan Request Submitted
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Your application has been authenticated via Aadhaar e-KYC and queued for district nodal verification. An SMS notification with your permanent tracking reference has been recorded.
      </p>

      {/* Tracking ID Box */}
      <div className="tracking-box">
        <span className="tracking-label">Official Application Reference (Tracking ID)</span>
        <div className="tracking-number">{application.trackingId}</div>
        <span className="tracking-hint">Save this reference number to check appraisal progress</span>
      </div>

      {/* Summary Terms */}
      <div className="panel" style={{ background: "#f8fafc", textAlign: "left", margin: "20px 0" }}>
        <h4 style={{ fontSize: 14, margin: "0 0 10px", textTransform: "uppercase", color: "var(--muted)" }}>
          Locked Scheme Terms (Submission Snapshot)
        </h4>
        <div className="detail-table">
          <div className="detail-row">
            <span className="label">Notified Scheme:</span>
            <span className="value">
              <strong>{application.schemeSnapshot?.name}</strong> (v{application.schemeSnapshot?.version})
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Concessional Interest:</span>
            <span className="value">{application.schemeSnapshot?.interestRate}% p.a.</span>
          </div>
          <div className="detail-row">
            <span className="label">Moratorium:</span>
            <span className="value">{application.schemeSnapshot?.moratoriumMonths} months</span>
          </div>
          <div className="detail-row">
            <span className="label">Channel Partner:</span>
            <span className="value">{application.formData?.partnerName || "State Bank of India — Malviya Nagar"}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions" style={{ justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        {onTrack && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onTrack(application.trackingId)}
          >
            📄 Track Application Status Now →
          </button>
        )}
        <button type="button" className="btn btn-outline" onClick={downloadSlip}>
          📥 Download Receipt
        </button>
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          Home / New Application
        </button>
      </div>
    </div>
  );
}
