export default function AboutMarg({ setMode }) {
  const BENEFICIARY_GROUPS = [
    {
      title: "Scheduled Caste Entrepreneurs",
      desc: "Individuals starting micro or small-scale enterprises across retail, agriculture, allied activities, and transport.",
      icon: "🏪",
    },
    {
      title: "Women Entrepreneurs & SHGs",
      desc: "Concessional credit and lower interest subsidies via Mahila Samriddhi Yojana (MSY) for female self-help collectives.",
      icon: "👩‍💼",
    },
    {
      title: "Traditional Artisans & Craftspersons",
      desc: "Working capital, toolkit acquisition, and modernisation assistance for heritage handicraft clusters.",
      icon: "🏺",
    },
    {
      title: "Students Pursuing Higher Education",
      desc: "Subsidised educational loans covering tuition and living expenses for premier technical and professional degrees in India and abroad.",
      icon: "🎓",
    },
    {
      title: "Sanitation Workers & Dependents",
      desc: "Alternative dignified self-employment financing for sanitation workers and liberated manual scavengers.",
      icon: "🤝",
    },
    {
      title: "Rural Youth & Nano-Businesses",
      desc: "Fast-track micro-credit up to ₹1,40,000 with low equity contribution to establish village-level service points.",
      icon: "🚜",
    },
  ];

  const OBJECTIVES = [
    "Democratise scheme discovery by replacing complex bureaucratic booklets with conversational, multilingual assistance.",
    "Eliminate predatory middleman commissions by routing applications directly to empanelled State Channelising Agencies (SCAs) and banks.",
    "Enforce rigorous credit health standards by directing applications only to partner branches with NPA levels below 10%.",
    "Provide complete financial transparency before submission by displaying clear EMI, interest rate, and moratorium periods.",
    "Ensure tamper-proof administrative governance through a mandatory Maker-Checker approval protocol and immutable audit logs.",
  ];

  return (
    <div className="gov-page-container">
      <div className="page-header">
        <span className="eyebrow-pill">National Digital Initiative</span>
        <h1>About MARG — Marginalized Assistance &amp; Resource Gateway</h1>
        <p>
          MARG is a unified, citizen-centric digital gateway conceived under the{" "}
          <strong>Ministry of Social Justice &amp; Empowerment (MoSJE)</strong> and implemented in collaboration with the{" "}
          <strong>National Scheduled Castes Finance &amp; Development Corporation (NSFDC)</strong>. It bridges the critical last-mile credit gap for marginalized communities across India.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="about-grid" style={{ marginBottom: 28 }}>
        <div className="panel gov-highlight-panel">
          <div className="panel-badge-top">VISION</div>
          <h3 className="panel-title" style={{ fontSize: 18, marginTop: 8 }}>
            Economic Emancipation Through Equitable Credit
          </h3>
          <p style={{ color: "var(--text)", fontSize: 14.5, lineHeight: 1.65 }}>
            To create an inclusive, self-reliant Bharat where no eligible citizen from a marginalized community is denied economic opportunity due to a lack of formal institutional credit, information opacity, or procedural complexity.
          </p>
        </div>

        <div className="panel gov-highlight-panel green-accent">
          <div className="panel-badge-top green">MISSION</div>
          <h3 className="panel-title" style={{ fontSize: 18, marginTop: 8 }}>
            Dignified, Transparent &amp; Paperless Service Delivery
          </h3>
          <p style={{ color: "var(--text)", fontSize: 14.5, lineHeight: 1.65 }}>
            Deploying conversational AI, rule-based scheme engines, and geo-targeted channel partner routing to deliver transparent, concessional loan schemes directly to beneficiaries in their mother tongue with zero intermediaries.
          </p>
        </div>
      </div>

      {/* Objectives */}
      <div className="panel" style={{ marginBottom: 32 }}>
        <h3 className="panel-title" style={{ fontSize: 18, marginBottom: 16 }}>
          Core Objectives of the MARG Gateway
        </h3>
        <ul className="check-list">
          {OBJECTIVES.map((obj, i) => (
            <li key={i} style={{ marginBottom: 12 }}>
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* Beneficiary Groups */}
      <div className="section-title-wrap">
        <span className="section-eyebrow">WHO WE SERVE</span>
        <h2>Target Beneficiary Communities</h2>
        <div className="title-divider" />
      </div>

      <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginBottom: 32 }}>
        {BENEFICIARY_GROUPS.map((bg) => (
          <div className="feature-card" key={bg.title}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{bg.icon}</div>
            <h3>{bg.title}</h3>
            <p>{bg.desc}</p>
          </div>
        ))}
      </div>

      {/* Institutional Architecture */}
      <div className="panel" style={{ marginBottom: 32 }}>
        <h3 className="panel-title" style={{ fontSize: 18, marginBottom: 14 }}>
          Institutional Architecture &amp; Delivery Ecosystem
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.65 }}>
          MARG is not a private NBFC or a commercial credit broker. It is a statutory apex delivery mechanism operating directly within the framework of the Government of India:
        </p>

        <div className="architecture-stepper">
          <div className="arch-step">
            <span className="arch-num">1</span>
            <strong>Ministry Oversight</strong>
            <p>Policy formulation and concessional credit budget allocation by MoSJE.</p>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-step">
            <span className="arch-num">2</span>
            <strong>Apex Corporation (NSFDC)</strong>
            <p>Scheme parameters, subsidy guidelines, and central refinance management.</p>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-step">
            <span className="arch-num">3</span>
            <strong>Empanelled Channel Partners</strong>
            <p>Ground appraisal and disbursal via SCAs, Public Sector Banks, and RRBs.</p>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-step">
            <span className="arch-num">4</span>
            <strong>Beneficiary Citizen</strong>
            <p>End-to-end transparent credit, subsidized rates, and real-time tracking.</p>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 24 }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setMode("schemes")}
          >
            Explore Notified Schemes →
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setMode("officials")}
          >
            View Officials Directory
          </button>
        </div>
      </div>
    </div>
  );
}
