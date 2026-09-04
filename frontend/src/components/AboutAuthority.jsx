const OBJECTIVES = [
  "Identify income-generating activities suited to Scheduled Caste beneficiaries and finance them at concessional rates.",
  "Channel funds through State Channelising Agencies (SCAs), Regional Rural Banks, Public Sector Banks and NBFC-MFIs so credit reaches beneficiaries close to home.",
  "Fund skill training and entrepreneurship development programmes alongside credit, not in place of it.",
  "Provide marketing support so beneficiary enterprises can sell what they produce.",
  "Monitor scheme implementation and the financial health of channelising agencies.",
];

const FUNCTIONS = [
  {
    title: "Scheme design & notification",
    body: "NSFDC's Board approves each loan scheme — eligibility, interest rate, government-to-beneficiary funding share, moratorium and tenure — before it is notified for use by channel partners.",
  },
  {
    title: "Refinance to channel partners",
    body: "NSFDC does not usually lend directly to individuals. It refinances State Channelising Agencies and empanelled banks, who carry out appraisal and disbursement on the ground.",
  },
  {
    title: "Skill & enterprise development",
    body: "Alongside credit, NSFDC funds skill training and entrepreneurship development programmes to improve repayment capacity and business survival.",
  },
  {
    title: "Monitoring & audit",
    body: "Scheme performance, channel partner NPA levels and quota utilisation are tracked centrally, with an internal audit trail for every scheme change.",
  },
];

export default function AboutAuthority({ setMode }) {
  return (
    <div>
      <div className="page-header">
        <span className="eyebrow-pill">Statutory Authority</span>
        <h1>About the National Scheduled Castes Finance &amp; Development Corporation</h1>
        <p>
          NSFDC is the apex financial institution of the Government of India dedicated to the economic
          empowerment of Scheduled Caste families. It is the authority that designs, notifies and revises every
          loan scheme offered on this platform.
        </p>
      </div>

      <div className="about-grid">
        <div className="panel">
          <h3 className="panel-title" style={{ fontSize: 17 }}>Who NSFDC is</h3>
          <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6 }}>
            NSFDC was incorporated in 1989 as a not-for-profit company under Section 8 of the Companies Act, 2013
            (formerly Section 25 of the Companies Act, 1956). It began as a joint corporation for Scheduled Castes
            and Scheduled Tribes and, after 2001, has worked solely for the Scheduled Caste community. It is
            wholly owned by the Government of India and administratively works under the Ministry of Social
            Justice &amp; Empowerment. Its head office is in New Delhi.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6 }}>
            Its stated mandate is to finance income-generating activities for members of Scheduled Caste families
            living below double the poverty line, so that beneficiaries can build sustainable livelihoods rather
            than depend on one-time grants.
          </p>
        </div>

        <div className="panel">
          <h3 className="panel-title" style={{ fontSize: 17 }}>Objectives</h3>
          <ul className="check-list">
            {OBJECTIVES.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="section-heading">How NSFDC functions</h2>
      <div className="feature-grid">
        {FUNCTIONS.map((f) => (
          <div className="feature-card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h3 className="panel-title" style={{ fontSize: 17 }}>Where the money comes from</h3>
        <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 0 }}>
          Each scheme fixes a government-to-beneficiary funding split — typically 85–100% financed through NSFDC's
          refinance line to the channel partner, with the beneficiary contributing the balance. Interest rates are
          kept concessional and vary by scheme; educational loans, for instance, are financed on more generous
          terms than larger term loans. Exact figures for each scheme are on the{" "}
          <button type="button" className="inline-link" onClick={() => setMode("schemes")}>Schemes page</button>.
        </p>
      </div>

      <p className="footnote" style={{ marginTop: 24 }}>
        This page summarises NSFDC's publicly stated mandate and functions for demo purposes. For the authoritative,
        current version, refer to the Ministry of Social Justice &amp; Empowerment (socialjustice.gov.in) and NSFDC
        (nsfdc.nic.in) websites.
      </p>
    </div>
  );
}
