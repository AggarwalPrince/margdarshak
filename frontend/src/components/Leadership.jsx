const MINISTERIAL = [
  {
    role: "Union Minister, Social Justice & Empowerment",
    note: "Cabinet-level head of the administrative Ministry that oversees NSFDC and approves its policy direction.",
  },
  {
    role: "Minister of State, Social Justice & Empowerment",
    note: "Assists the Cabinet Minister; the Ministry currently has more than one Minister of State.",
  },
];

const BOARD_ROLES = [
  {
    role: "Chairman-cum-Managing Director (CMD)",
    note: "Chief executive of NSFDC, nominated by the Government of India. Runs day-to-day operations and chairs the Board.",
  },
  {
    role: "Government Nominee Directors",
    note: "Serving officers nominated by the Ministry of Social Justice & Empowerment and the Ministry of Finance, representing the government's shareholding.",
  },
  {
    role: "Functional Directors",
    note: "Head finance, operations and monitoring verticals within NSFDC and report to the CMD.",
  },
  {
    role: "SCA / Channel Partner Representative Directors",
    note: "Bring the on-the-ground perspective of State Channelising Agencies that actually disburse loans to beneficiaries.",
  },
  {
    role: "Company Secretary",
    note: "Handles statutory compliance under the Companies Act, 2013 and Board secretarial functions.",
  },
];

const REGIONAL = [
  { title: "Regional / Zonal Offices", body: "NSFDC coordinates with State Channelising Agencies (SCAs) — one per state or UT — which act as its local disbursing arm." },
  { title: "State Channelising Agencies (SCAs)", body: "State-government-owned corporations (like the Rajasthan SC/ST Finance Corporation) that appraise applications and disburse NSFDC-refinanced loans locally." },
  { title: "Empanelled Banks & NBFC-MFIs", body: "Public Sector Banks, Regional Rural Banks and NBFC-MFIs empanelled to channel select schemes, widening reach beyond SCA branches." },
];

export default function Leadership() {
  return (
    <div>
      <div className="page-header">
        <span className="eyebrow-pill">Who Runs This</span>
        <h1>Governance &amp; leadership</h1>
        <p>
          NSFDC sits inside a two-layer governance structure: ministerial oversight from the Government of India,
          and corporate governance by NSFDC's own Board of Directors, which actually approves and revises each
          loan scheme shown on this platform.
        </p>
      </div>

      <h2 className="section-heading">Ministerial oversight</h2>
      <div className="org-list">
        {MINISTERIAL.map((m) => (
          <div className="org-card" key={m.role}>
            <div className="org-card-role">{m.role}</div>
            <p>{m.note}</p>
          </div>
        ))}
      </div>
      <p className="footnote">
        The Ministry of Social Justice &amp; Empowerment is currently headed by Dr. Virendra Kumar as Union
        Minister, assisted by Ministers of State including Shri Ramdas Athawale. Ministerial appointments change
        with the Council of Ministers — refer to socialjustice.gov.in for the current names.
      </p>

      <h2 className="section-heading" style={{ marginTop: 32 }}>NSFDC Board of Directors</h2>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: -8, marginBottom: 18 }}>
        The Board is the body that actually sanctions, revises and retires loan schemes. Its composition follows
        the standard pattern used across NSFDC, NSTFDC, NBCFDC and similar central-sector corporations:
      </p>
      <div className="org-list">
        {BOARD_ROLES.map((b) => (
          <div className="org-card" key={b.role}>
            <div className="org-card-role">{b.role}</div>
            <p>{b.note}</p>
          </div>
        ))}
      </div>
      <p className="footnote">
        Named office-bearers change with postings and transfers. Rather than risk showing a stale name on a demo
        build, this page lists the roles that make up the Board — for who currently holds each position, see the
        "Who's Who" section of nsfdc.nic.in.
      </p>

      <h2 className="section-heading" style={{ marginTop: 32 }}>How schemes reach a beneficiary</h2>
      <div className="feature-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {REGIONAL.map((r) => (
          <div className="feature-card" key={r.title}>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </div>
        ))}
      </div>

      <p className="footnote" style={{ marginTop: 24 }}>
        This page describes NSFDC's real governance structure for context, but does not assert current named
        office-bearers where that information changes frequently. It is part of an SIH demo build and is not an
        official NSFDC publication.
      </p>
    </div>
  );
}
