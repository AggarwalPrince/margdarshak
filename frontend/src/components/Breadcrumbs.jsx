const MODE_LABELS = {
  landing: "Home",
  about_marg: "About MARG",
  about: "Statutory Authority (NSFDC)",
  leadership: "Governance & Ministerial Oversight",
  officials: "Officials Directory",
  schemes: "Notified Loan Schemes",
  calculator: "EMI & Moratorium Calculator",
  tracker: "Application Status Tracker",
  partners_directory: "Empanelled Partner Institutions",
  downloads: "Documents & Forms",
  helpdesk: "Citizen Helpdesk & Grievance Redressal",
  journey: "Citizen Application Journey",
  admin: "Department Administration Portal",
};

export default function Breadcrumbs({ mode, setMode, subLabel }) {
  if (mode === "landing") return null;

  return (
    <nav className="gov-breadcrumb-nav" aria-label="Breadcrumb hierarchy">
      <div className="gov-breadcrumb-inner">
        <ol className="gov-breadcrumb-list">
          <li className="gov-breadcrumb-item">
            <button
              type="button"
              className="gov-breadcrumb-link"
              onClick={() => setMode("landing")}
            >
              Home
            </button>
          </li>
          <li className="gov-breadcrumb-sep" aria-hidden="true">
            /
          </li>
          <li className="gov-breadcrumb-item active" aria-current="page">
            <span>{MODE_LABELS[mode] || mode}</span>
          </li>
          {subLabel && (
            <>
              <li className="gov-breadcrumb-sep" aria-hidden="true">
                /
              </li>
              <li className="gov-breadcrumb-item active" aria-current="page">
                <span>{subLabel}</span>
              </li>
            </>
          )}
        </ol>
      </div>
    </nav>
  );
}
