import { useEffect, useState } from "react";
import { api } from "../api";

const EMPTY_FORM = {
  name: "",
  code: "",
  description: "",
  minIncome: 0,
  maxIncome: 500000,
  minProjectCost: 0,
  maxProjectCost: 140000,
  projectTypes: "Retail,Services",
  interestRate: 6.5,
  govtSharePct: 90,
  beneficiarySharePct: 10,
  moratoriumMonths: 6,
  tenureMonths: 60,
};

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function AdminPanel({ admin, onLogout, onSwitchAdmin }) {
  const [tab, setTab] = useState("dashboard"); // dashboard | schemes | pending | applications | partners | audit
  const [schemes, setSchemes] = useState([]);
  const [pending, setPending] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [applications, setApplications] = useState([]);
  const [partners, setPartners] = useState([]);
  const [toast, setToast] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  async function refreshAll() {
    try {
      const [s, p, a, apps, pts] = await Promise.all([
        api.adminGetSchemes(),
        api.adminGetPending(),
        api.adminGetAuditLog(),
        api.adminGetApplications(),
        api.getAllPartners(),
      ]);
      setSchemes(s || []);
      setPending(p || []);
      setAuditLog(a || []);
      setApplications(apps || []);
      setPartners(pts || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setCreating(true);
    setEditingId(null);
  }

  function startEdit(scheme) {
    setForm({
      ...scheme,
      projectTypes: Array.isArray(scheme.projectTypes) ? scheme.projectTypes.join(",") : scheme.projectTypes,
    });
    setEditingId(scheme.id);
    setCreating(false);
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toPayload() {
    return {
      ...form,
      minIncome: Number(form.minIncome),
      maxIncome: Number(form.maxIncome),
      minProjectCost: Number(form.minProjectCost),
      maxProjectCost: Number(form.maxProjectCost),
      interestRate: Number(form.interestRate),
      govtSharePct: Number(form.govtSharePct),
      beneficiarySharePct: Number(form.beneficiarySharePct),
      moratoriumMonths: Number(form.moratoriumMonths),
      tenureMonths: Number(form.tenureMonths),
      projectTypes: typeof form.projectTypes === "string"
        ? form.projectTypes.split(",").map((s) => s.trim()).filter(Boolean)
        : form.projectTypes,
      actor: admin.username,
    };
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.adminCreateScheme(toPayload());
      flash("New scheme created as draft");
      setCreating(false);
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.adminUpdateScheme(editingId, toPayload());
      if (res.pending) {
        flash("Maker-Checker: Modification staged as pending change. Requires approval from an approving officer.");
      } else {
        flash("Draft updated successfully.");
      }
      setEditingId(null);
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePublish(id) {
    try {
      await api.adminPublishScheme(id, admin.username);
      flash("Scheme officially published to citizen portal.");
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeprecate(id) {
    try {
      await api.adminDeprecateScheme(id, admin.username);
      flash("Scheme archived / deprecated.");
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleApprove(changeId) {
    setError("");
    try {
      await api.adminApprovePending(changeId, admin.username);
      flash("Pending change approved and published. Scheme version incremented.");
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(changeId) {
    setError("");
    try {
      await api.adminRejectPending(changeId, admin.username);
      flash("Pending proposal rejected.");
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAdvanceApplication(appId, nextStage, stageName, note) {
    try {
      await api.adminUpdateApplicationStatus(appId, {
        stage: nextStage,
        stageName,
        status: nextStage === 4 ? "sanctioned" : "processing",
        note,
        actor: admin.name,
      });
      flash(`Application updated to: ${stageName}`);
      refreshAll();
    } catch (err) {
      setError(err.message);
    }
  }

  const publishedCount = schemes.filter((s) => s.status === "published").length;
  const draftCount = schemes.filter((s) => s.status === "draft").length;

  return (
    <div className="gov-page-container">
      {/* Admin Institutional Header */}
      <div className="admin-header-bar">
        <div className="admin-title-wrap">
          <span className="eyebrow-pill">NSFDC / Department Administration</span>
          <h1 style={{ fontSize: 24, margin: "6px 0 4px" }}>
            Scheme Management &amp; Maker-Checker Portal
          </h1>
          <div className="admin-meta-row">
            <span className="admin-officer-badge">
              👤 Officer: <strong>{admin.name}</strong> ({admin.username})
            </span>
            <span className="admin-role-badge">
              Role: <strong>{admin.role}</strong>
            </span>
            <span className="admin-login-time">
              Last Login: Today at 09:15 AM (IST)
            </span>
          </div>
        </div>

        <div className="admin-header-actions">
          {onSwitchAdmin && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onSwitchAdmin}
              title="Switch between Maker (Ravi) and Checker (Priya) for live demo"
            >
              🔄 Switch Officer
            </button>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Toast message */}
      {toast && (
        <div className="panel toast-banner" style={{ background: "#ecfdf5", borderColor: "#10b981", margin: "16px 0" }}>
          <p style={{ margin: 0, color: "#065f46", fontSize: 14 }}>
            🔔 {toast}
          </p>
        </div>
      )}

      {error && (
        <div className="panel" style={{ background: "#fef2f2", borderColor: "#ef4444", margin: "16px 0" }}>
          <p className="field-error" style={{ margin: 0 }}>
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tabs admin-tabs">
        <button
          type="button"
          className={`tab-btn ${tab === "dashboard" ? "active" : ""}`}
          onClick={() => setTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === "schemes" ? "active" : ""}`}
          onClick={() => setTab("schemes")}
        >
          📋 Scheme Management ({schemes.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === "pending" ? "active" : ""}`}
          onClick={() => setTab("pending")}
        >
          ⚖️ Pending Approvals ({pending.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === "applications" ? "active" : ""}`}
          onClick={() => setTab("applications")}
        >
          📑 Applications Registry ({applications.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === "partners" ? "active" : ""}`}
          onClick={() => setTab("partners")}
        >
          🏦 Channel Partners ({partners.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === "audit" ? "active" : ""}`}
          onClick={() => setTab("audit")}
        >
          📜 Audit Trail ({auditLog.length})
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {tab === "dashboard" && (
        <div>
          <div className="admin-stat-cards">
            <div className="admin-stat-card">
              <div className="card-top-row">
                <span className="stat-card-title">Published Schemes</span>
                <span className="card-icon">📢</span>
              </div>
              <div className="stat-card-value">{publishedCount}</div>
              <div className="stat-card-sub">{draftCount} Drafts in progress</div>
            </div>

            <div className="admin-stat-card highlight">
              <div className="card-top-row">
                <span className="stat-card-title">Maker-Checker Pending</span>
                <span className="card-icon">⚖️</span>
              </div>
              <div className="stat-card-value">{pending.length}</div>
              <div className="stat-card-sub">Awaiting secondary officer approval</div>
            </div>

            <div className="admin-stat-card">
              <div className="card-top-row">
                <span className="stat-card-title">Applications Received</span>
                <span className="card-icon">📄</span>
              </div>
              <div className="stat-card-value">{applications.length}</div>
              <div className="stat-card-sub">Across 12 participating States/UTs</div>
            </div>

            <div className="admin-stat-card">
              <div className="card-top-row">
                <span className="stat-card-title">Channel Partners</span>
                <span className="card-icon">🏦</span>
              </div>
              <div className="stat-card-value">{partners.length}</div>
              <div className="stat-card-sub">Average NPA ratio: 4.8%</div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>
              Maker-Checker Integrity System Active
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Under Central Vigilance and Ministry of Social Justice &amp; Empowerment guidelines, no single administrative officer can unilaterally amend interest rates, subsidy shares, or project ceilings on published schemes.
              Parameters proposed by a <strong>Scheme Officer (Maker)</strong> remain quarantined until a certified <strong>Approving Officer (Checker)</strong> validates the modification.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEMES */}
      {tab === "schemes" && (
        <div>
          <div className="form-actions" style={{ marginBottom: 18, justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>
              Manage statutory loan parameters, versions, and publication status.
            </span>
            <button type="button" className="btn btn-gold btn-sm" onClick={startCreate}>
              + Propose New Scheme
            </button>
          </div>

          {/* Create or Edit Form */}
          {(creating || editingId) && (
            <div className="panel" style={{ marginBottom: 24, border: "2px solid var(--navy)" }}>
              <h3 style={{ fontSize: 17, marginBottom: 16 }}>
                {creating ? "Propose New Scheme (Creates Draft)" : "Edit Scheme Parameters (Maker Action)"}
              </h3>
              <form onSubmit={creating ? handleCreate : handleSaveEdit}>
                <div className="calc-grid">
                  <div className="field">
                    <label>Scheme Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Scheme Code *</label>
                    <input
                      value={form.code}
                      onChange={(e) => updateField("code", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Official Description</label>
                  <input
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="calc-grid">
                  <div className="field">
                    <label>Concessional Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.interestRate}
                      onChange={(e) => updateField("interestRate", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Government Share (%)</label>
                    <input
                      type="number"
                      value={form.govtSharePct}
                      onChange={(e) => updateField("govtSharePct", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Beneficiary Contribution (%)</label>
                    <input
                      type="number"
                      value={form.beneficiarySharePct}
                      onChange={(e) => updateField("beneficiarySharePct", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Moratorium (Months)</label>
                    <input
                      type="number"
                      value={form.moratoriumMonths}
                      onChange={(e) => updateField("moratoriumMonths", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Max Project Cost (₹)</label>
                    <input
                      type="number"
                      value={form.maxProjectCost}
                      onChange={(e) => updateField("maxProjectCost", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Eligible Sectors (comma-separated)</label>
                    <input
                      value={form.projectTypes}
                      onChange={(e) => updateField("projectTypes", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {creating ? "Create as Draft Scheme" : "Stage Changes (Submit to Checker)"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setCreating(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Schemes List Table */}
          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Scheme Name</th>
                  <th>Version</th>
                  <th>Interest</th>
                  <th>Govt Share</th>
                  <th>Max Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.code}</strong></td>
                    <td>{s.name}</td>
                    <td>v{s.version}</td>
                    <td>{s.interestRate}%</td>
                    <td>{s.govtSharePct}%</td>
                    <td>₹{Number(s.maxProjectCost).toLocaleString("en-IN")}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => startEdit(s)}
                        >
                          Edit
                        </button>
                        {s.status === "draft" && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handlePublish(s.id)}
                          >
                            Publish
                          </button>
                        )}
                        {s.status === "published" && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: "#d32f2f" }}
                            onClick={() => handleDeprecate(s.id)}
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PENDING APPROVALS (MAKER-CHECKER) */}
      {tab === "pending" && (
        <div>
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>
            Maker-Checker Staging Area
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
            Review parameter amendments submitted by Scheme Officers. Under governance policy, approving requires a different officer than the proposer.
          </p>

          {pending.length === 0 ? (
            <div className="panel" style={{ textAlign: "center", padding: 32 }}>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                No pending scheme modifications awaiting approval.
              </p>
            </div>
          ) : (
            <div className="card-list">
              {pending.map((chg) => {
                const scheme = schemes.find((s) => s.id === chg.schemeId);
                const isProposer = admin.username === chg.proposedBy;
                return (
                  <div key={chg.id} className="scheme-card" style={{ borderLeft: "4px solid #f2711c" }}>
                    <div className="scheme-card-top">
                      <div>
                        <span className="badge badge-draft">PENDING APPROVAL</span>
                        <h4 style={{ margin: "6px 0 2px", fontSize: 16 }}>
                          Proposed update to: {scheme?.name || chg.schemeId}
                        </h4>
                        <span className="footnote" style={{ margin: 0 }}>
                          Proposed by <strong>{chg.proposedBy}</strong> on{" "}
                          {new Date(chg.proposedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="panel" style={{ background: "#f8fafc", margin: "14px 0" }}>
                      <strong style={{ fontSize: 13, textTransform: "uppercase", color: "var(--muted)" }}>
                        Proposed Modifications:
                      </strong>
                      <pre style={{ margin: "8px 0 0", fontSize: 13, whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(chg.changes, null, 2)}
                      </pre>
                    </div>

                    {isProposer ? (
                      <div className="footnote" style={{ color: "#d97706" }}>
                        ⚠️ You proposed this change as <strong>{admin.username}</strong>. Another officer (e.g. <code>admin_priya</code>) must review and approve it.
                      </div>
                    ) : (
                      <div className="form-actions" style={{ marginTop: 12 }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApprove(chg.id)}
                        >
                          ✓ Approve &amp; Publish (v{(scheme?.version || 1) + 1})
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: "#d32f2f" }}
                          onClick={() => handleReject(chg.id)}
                        >
                          ✕ Reject Proposal
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: APPLICATIONS REGISTRY */}
      {tab === "applications" && (
        <div>
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>
            Citizen Applications Registry
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
            Inspect incoming concessional credit requests, review applicant parameters, and advance processing stages.
          </p>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Applicant Name</th>
                  <th>Mobile</th>
                  <th>Scheme</th>
                  <th>Loan Amount</th>
                  <th>Current Stage</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td><code>{app.trackingId}</code></td>
                    <td><strong>{app.formData?.applicantName || "Citizen"}</strong></td>
                    <td>{app.mobile}</td>
                    <td>{app.schemeSnapshot?.code || "LOAN"}</td>
                    <td>₹{Number(app.formData?.loanAmount || 0).toLocaleString("en-IN")}</td>
                    <td>Stage {app.stage || 1}: {app.stageName || "Submitted"}</td>
                    <td><StatusBadge status={app.status || "submitted"} /></td>
                    <td>
                      {(app.stage || 1) < 4 ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            handleAdvanceApplication(
                              app.id,
                              (app.stage || 1) + 1,
                              (app.stage || 1) === 1
                                ? "District Nodal Scrutiny Completed"
                                : (app.stage || 1) === 2
                                ? "Forwarded to Channel Partner"
                                : "Loan Sanctioned & Disbursed",
                              "Processed by Department Administration"
                            )
                          }
                        >
                          Advance Stage →
                        </button>
                      ) : (
                        <span style={{ color: "#059669", fontSize: 13, fontWeight: 600 }}>
                          ✓ Disbursed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PARTNERS MONITOR */}
      {tab === "partners" && (
        <div>
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>
            Channel Partner Risk &amp; Quota Monitoring
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
            Live status of empanelled banks and State Channelising Agencies. NPA ratio &gt; 10% automatically restricts new routing.
          </p>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Partner Name</th>
                  <th>Type</th>
                  <th>State</th>
                  <th>City</th>
                  <th>NPA Ratio</th>
                  <th>Refinance Quota</th>
                  <th>Routing Health</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => {
                  const healthy = p.npaPct <= 10;
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="badge badge-published">{p.type}</span></td>
                      <td>{p.state}</td>
                      <td>{p.city}</td>
                      <td style={{ color: healthy ? "#059669" : "#dc2626", fontWeight: 600 }}>
                        {p.npaPct}%
                      </td>
                      <td>{p.quotaRemainingPct}% Available</td>
                      <td>
                        {healthy ? (
                          <span style={{ color: "#059669" }}>● Active</span>
                        ) : (
                          <span style={{ color: "#dc2626" }}>● Quota Paused</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {tab === "audit" && (
        <div>
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>
            Immutable Statutory Audit Trail
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
            Complete chronological record of all administrative actions, scheme notifications, approvals, and application transitions.
          </p>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Timestamp (UTC)</th>
                  <th>Officer</th>
                  <th>Action</th>
                  <th>Entity ID</th>
                  <th>Audit Detail</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((log) => (
                  <tr key={log.id}>
                    <td>
                      {new Date(log.timestamp).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td><code>{log.actor}</code></td>
                    <td><strong>{log.action}</strong></td>
                    <td><code>{log.schemeId || "-"}</code></td>
                    <td>{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
