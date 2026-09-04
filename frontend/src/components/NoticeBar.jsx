import { useState } from "react";

const NOTICES = [
  "📢 Beneficiaries are advised to keep their Aadhaar-linked mobile number ready for OTP verification.",
  "⚡ Concessional interest rate of 4.0% p.a. locked for Educational Loan Scheme (v2) for Academic Year 2026–27.",
  "✅ Mahila Samriddhi Yojana (MSY): Moratorium extended to 6 months for women-led micro enterprises.",
  "ℹ️ Please apply only through empanelled SCAs and Public Sector Banks listed on the MARG portal. No middleman fees are charged.",
  "📋 Special Credit Drive active across 12 States & UTs for artisan clusters and rural nano-enterprises.",
];

export default function NoticeBar({ onSelectNotice }) {
  const [isPaused, setIsPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  function nextNotice() {
    setActiveIdx((prev) => (prev + 1) % NOTICES.length);
  }

  function prevNotice() {
    setActiveIdx((prev) => (prev - 1 + NOTICES.length) % NOTICES.length);
  }

  return (
    <div className="gov-notice-strip" role="region" aria-label="Official announcements ticker">
      <div className="gov-notice-inner">
        <div className="gov-notice-badge">
          <span className="notice-dot" aria-hidden="true" />
          <span>LATEST UPDATES</span>
        </div>

        <div
          className="gov-notice-marquee-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`gov-notice-marquee ${isPaused ? "paused" : ""}`}>
            <span className="notice-item">{NOTICES[activeIdx]}</span>
          </div>
        </div>

        <div className="gov-notice-controls" aria-label="Announcement controls">
          <button
            type="button"
            className="notice-ctrl-btn"
            onClick={prevNotice}
            title="Previous announcement"
            aria-label="Previous announcement"
          >
            ‹
          </button>
          <span className="notice-counter">
            {activeIdx + 1}/{NOTICES.length}
          </span>
          <button
            type="button"
            className="notice-ctrl-btn"
            onClick={nextNotice}
            title="Next announcement"
            aria-label="Next announcement"
          >
            ›
          </button>
          <button
            type="button"
            className="notice-ctrl-btn notice-pause-btn"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
          >
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
      </div>
    </div>
  );
}
