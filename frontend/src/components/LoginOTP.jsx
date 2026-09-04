import { useState } from "react";
import { api } from "../api";
import { t } from "../i18n";

export default function LoginOTP({ lang, onVerified }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("mobile"); // mobile | otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await api.sendOtp(mobile);
      setHint(res.devHint || "");
      setStage("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.verifyOtp(mobile, otp);
      onVerified({ mobile: res.mobile, token: res.token });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      {stage === "mobile" ? (
        <form onSubmit={handleSendOtp}>
          <h2 className="panel-title">Verify your mobile number</h2>
          <p className="panel-subtitle">We'll send a 6-digit code to confirm it's you.</p>
          <div className="field">
            <label>{t(lang, "mobileLabel")}</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="98XXXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </div>
          {error && <div className="field-error">{error}</div>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Sending…" : t(lang, "sendOtp")}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <h2 className="panel-title">Enter the code</h2>
          <p className="panel-subtitle">Sent to +91 {mobile.replace(/(\d{5})(\d{5})/, "$1 $2")}</p>
          <div className="field">
            <label>{t(lang, "enterOtp")}</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            {hint && <div className="field-hint">{hint} (demo mode, no SMS sent)</div>}
          </div>
          {error && <div className="field-error">{error}</div>}
          <div className="form-actions">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Verifying…" : t(lang, "verify")}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setStage("mobile")}>
              Change number
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
