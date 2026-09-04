import { useState } from "react";

const DEMO_ADMINS = {
  admin_ravi: { password: "demo123", name: "Ravi Kumar", role: "Scheme Officer (Maker)" },
  admin_priya: { password: "demo123", name: "Priya Sharma", role: "Approving Officer (Checker)" },
};

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const account = DEMO_ADMINS[username];
    if (!account || account.password !== password) {
      setError("Invalid credentials. Try admin_ravi / demo123 or admin_priya / demo123.");
      return;
    }
    onLogin({ username, ...account });
  }

  function quickLogin(uname) {
    const account = DEMO_ADMINS[uname];
    onLogin({ username: uname, ...account });
  }

  return (
    <div className="gov-page-container" style={{ padding: "40px 16px" }}>
      <div className="panel" style={{ maxWidth: 460, margin: "0 auto", borderTop: "4px solid var(--navy)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span className="eyebrow-pill" style={{ marginBottom: 8 }}>Department Access</span>
          <h2 style={{ fontSize: 20, margin: "4px 0" }}>NSFDC / Ministry Administration</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
            Authorized access for Scheme Officers &amp; Approving Authorities
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Department Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_ravi or admin_priya"
              required
            />
          </div>
          <div className="field">
            <label>Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="field-error" style={{ marginBottom: 14 }}>{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" style={{ width: "100%" }}>
            Authenticate &amp; Enter Portal →
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
          <span style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
            One-Click Login for SIH Demo Evaluation:
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ justifyContent: "space-between", display: "flex", padding: "8px 12px" }}
              onClick={() => quickLogin("admin_ravi")}
            >
              <span>👤 <strong>Ravi Kumar</strong> (Scheme Officer)</span>
              <span className="badge badge-draft">Maker</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ justifyContent: "space-between", display: "flex", padding: "8px 12px" }}
              onClick={() => quickLogin("admin_priya")}
            >
              <span>👤 <strong>Priya Sharma</strong> (Approving Officer)</span>
              <span className="badge badge-published">Checker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
