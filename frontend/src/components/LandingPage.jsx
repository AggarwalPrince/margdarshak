import HeroGraphic from "./HeroGraphic";
import { t } from "../i18n";

export default function LandingPage({ lang, setMode, onStartJourney }) {
  const CITIZEN_SERVICES = [
    {
      id: "srv_match",
      title: "Find a Scheme",
      desc: "Smart eligibility matching based on project cost, business sector, and annual family income.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
      action: () => setMode("schemes"),
      btnText: "Explore Schemes",
    },
    {
      id: "srv_apply",
      title: "Apply Online",
      desc: "Paperless multilingual citizen application journey with voice input and instant Aadhaar e-KYC.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      action: onStartJourney,
      btnText: "Start Application →",
      primary: true,
    },
    {
      id: "srv_track",
      title: "Track Status",
      desc: "Track real-time progress across 4 stages using your MOSJE Tracking ID or registered mobile.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      action: () => setMode("tracker"),
      btnText: "Track Now",
    },
    {
      id: "srv_calc",
      title: "Scheme & EMI Calculator",
      desc: "Pre-calculate monthly EMI, government subsidy share, and moratorium before applying.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="16" y1="14" x2="16" y2="18" />
          <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
        </svg>
      ),
      action: () => setMode("calculator"),
      btnText: "Open Calculator",
    },
    {
      id: "srv_partners",
      title: "Partner Institutions",
      desc: "Locate empanelled State Channelising Agencies, Public Sector Banks, and RRBs with healthy NPA records.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
        </svg>
      ),
      action: () => setMode("partners_directory"),
      btnText: "Find Branches",
    },
    {
      id: "srv_help",
      title: "Grievance & Helpdesk",
      desc: "CPGRAMS-aligned citizen grievance redressal system with ticket tracking and toll-free assistance.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      ),
      action: () => setMode("helpdesk"),
      btnText: "Citizen Helpdesk",
    },
  ];

  const STATS = [
    { num: "25+", label: "Notified Schemes", sub: "Central Sector & State" },
    { num: "100+", label: "Partner Institutions", sub: "SCAs, PSBs & RRBs" },
    { num: "12", label: "States & UTs Covered", sub: "Expanding Pan-India" },
    { num: "24×7", label: "Digital Access", sub: "Multilingual Assistance" },
    { num: "₹450 Cr+", label: "Credit Disbursed", sub: "Concessional Subsidy" },
    { num: "98.4%", label: "Grievance Redressed", sub: "Under CPGRAMS Norms" },
  ];

  return (
    <div className="gov-landing-container">
      {/* Hero Section */}
      <section className="gov-hero-banner" aria-label="Portal introduction">
        <div className="gov-hero-content">
          <div className="gov-hero-pill">
            <span className="gov-emblem-small">🇮🇳</span>
            <span>MARG — Marginalized Assistance &amp; Resource Gateway</span>
          </div>
          <h1 className="gov-hero-title">
            Unified Access to Concessional Financial Assistance
          </h1>
          <p className="gov-hero-desc">
            A citizen-centric digital platform under the{" "}
            <strong>Ministry of Social Justice &amp; Empowerment (MoSJE)</strong> &amp;{" "}
            <strong>National Scheduled Castes Finance &amp; Development Corporation (NSFDC)</strong>{" "}
            for discovering suitable government loan schemes, evaluating eligibility, routing to solvent channel partners, and tracking applications.
          </p>

          <div className="gov-hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onStartJourney}
            >
              🔎 Find a Scheme &amp; Apply
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => setMode("tracker")}
            >
              📄 Track Application
            </button>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => setMode("schemes")}
            >
              📢 Browse Schemes
            </button>
          </div>
        </div>

        <div className="gov-hero-visual">
          <HeroGraphic />
        </div>
      </section>

      {/* Quick Links Strip */}
      <div className="gov-quick-links-strip" role="navigation" aria-label="Quick Links">
        <span className="quick-links-title">QUICK LINKS:</span>
        <button type="button" onClick={() => setMode("schemes")}>
          🔍 Search Schemes
        </button>
        <button type="button" onClick={() => setMode("calculator")}>
          🧮 EMI Calculator
        </button>
        <button type="button" onClick={() => setMode("tracker")}>
          📄 Application Status
        </button>
        <button type="button" onClick={() => setMode("downloads")}>
          📥 Download Forms
        </button>
        <button type="button" onClick={() => setMode("partners_directory")}>
          🏦 Empanelled Banks
        </button>
        <button type="button" onClick={() => setMode("helpdesk")}>
          ☎ Toll-Free: 1800-11-0031
        </button>
      </div>

      {/* Citizen Services Grid */}
      <section className="gov-services-section">
        <div className="section-title-wrap">
          <span className="section-eyebrow">DIRECT CITIZEN SERVICES</span>
          <h2>Digital Services on the MARG Portal</h2>
          <div className="title-divider" />
        </div>

        <div className="gov-services-grid">
          {CITIZEN_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className={`gov-service-card ${srv.primary ? "service-card-primary" : ""}`}
            >
              <div className="service-card-icon">{srv.icon}</div>
              <h3>{srv.title}</h3>
              <p>{srv.desc}</p>
              <button
                type="button"
                className={`btn btn-sm ${srv.primary ? "btn-primary" : "btn-outline"}`}
                onClick={srv.action}
              >
                {srv.btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MARG at a Glance Statistics Strip */}
      <section className="gov-stats-strip" aria-label="MARG Statistics">
        <div className="stats-strip-header">
          <h3>MARG AT A GLANCE</h3>
          <span className="stats-strip-tag">Illustrative Demo Figures</span>
        </div>
        <div className="stats-grid">
          {STATS.map((st) => (
            <div className="stat-box" key={st.label}>
              <div className="stat-number">{st.num}</div>
              <div className="stat-label">{st.label}</div>
              <div className="stat-sub">{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Column Section: Announcements & Guidelines */}
      <div className="gov-two-col-feed">
        <div className="gov-feed-panel">
          <div className="panel-header">
            <h3>📢 What's New &amp; Gazette Circulars</h3>
            <button
              type="button"
              className="panel-view-all"
              onClick={() => setMode("schemes")}
            >
              View All →
            </button>
          </div>
          <ul className="gov-notice-feed-list">
            <li>
              <span className="notice-tag tag-new">NEW</span>
              <span className="notice-date">01 Sep 2026</span>
              <p className="notice-text">
                <strong>Educational Loan Scheme (v2):</strong> Concessional interest rate held at 4.0% p.a. for FY 2026–27.
              </p>
            </li>
            <li>
              <span className="notice-tag tag-update">UPDATE</span>
              <span className="notice-date">10 Jun 2026</span>
              <p className="notice-text">
                <strong>Term Loan Scheme (v4):</strong> Maximum project cost ceiling enhanced to ₹50,00,000 to promote MSME clusters.
              </p>
            </li>
            <li>
              <span className="notice-tag tag-update">CIRCULAR</span>
              <span className="notice-date">22 May 2026</span>
              <p className="notice-text">
                <strong>Mahila Samriddhi Yojana (MSY):</strong> Moratorium period extended to 6 months for women-led nano-enterprises.
              </p>
            </li>
            <li>
              <span className="notice-tag tag-advisory">ADVISORY</span>
              <span className="notice-date">15 Apr 2026</span>
              <p className="notice-text">
                <strong>Channel Partner Quota Allocation:</strong> Empanelment of Regional Rural Banks widened across Rajasthan and Maharashtra.
              </p>
            </li>
          </ul>
        </div>

        <div className="gov-feed-panel">
          <div className="panel-header">
            <h3>🏛️ Institutional Framework &amp; Integrity</h3>
            <button
              type="button"
              className="panel-view-all"
              onClick={() => setMode("about_marg")}
            >
              Learn More →
            </button>
          </div>
          <div className="gov-pillars-wrap">
            <div className="pillar-item">
              <div className="pillar-num">01</div>
              <div>
                <h4>Multilingual Voice-First Access</h4>
                <p>Designed for non-tech citizens in regional languages (Hindi, Marathi, Tamil) with Bhashini architecture readiness.</p>
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-num">02</div>
              <div>
                <h4>Pre-Application Financial Transparency</h4>
                <p>Loan amount, interest subvention, govt share, and exact EMI are locked in before submission — no surprise terms.</p>
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-num">03</div>
              <div>
                <h4>Solvent Partner Routing (NPA &lt; 10%)</h4>
                <p>Directs applications only to channel partners and bank branches with active lending quotas and sound recovery records.</p>
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-num">04</div>
              <div>
                <h4>Maker-Checker Administrative Governance</h4>
                <p>Two-tier administrative scrutiny with immutable audit logging prevents unilateral alterations to scheme parameters.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIH Video Demo Advisory */}
      <div className="gov-sih-note">
        <strong>Note for Smart India Hackathon (SIH) Evaluation:</strong> This portal operates on self-contained demo data to ensure 100% video and live presentation reliability without relying on live external SMS gateways or third-party bank APIs.
      </div>
    </div>
  );
}
