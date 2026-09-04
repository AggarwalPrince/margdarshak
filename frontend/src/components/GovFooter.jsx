import ChakraIcon from "./ChakraIcon";

const LAST_UPDATED = "04 September 2026";
const VISITOR_COUNT = "24,81,905";

export default function GovFooter({ setMode }) {
  function go(key) {
    setMode(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="gov-footer" role="contentinfo">
      <div className="gov-footer-top">
        {/* Col 1: About MARG */}
        <div className="gov-footer-col">
          <h4>ABOUT MARG</h4>
          <ul>
            <li>
              <button type="button" onClick={() => go("about_marg")}>
                About MARG Portal
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("about")}>
                Apex Corporation (NSFDC)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("leadership")}>
                Ministerial Governance &amp; Board
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("officials")}>
                Officials Directory
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("admin")}>
                NSFDC Department Login
              </button>
            </li>
          </ul>
        </div>

        {/* Col 2: Beneficiary Services */}
        <div className="gov-footer-col">
          <h4>BENEFICIARY SERVICES</h4>
          <ul>
            <li>
              <button type="button" onClick={() => go("schemes")}>
                Browse Concessional Schemes
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("journey")}>
                Apply for Financial Assistance
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("calculator")}>
                EMI &amp; Moratorium Calculator
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("tracker")}>
                Track Application Status
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("partners_directory")}>
                Find Empanelled Bank Branches
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Documents & Support */}
        <div className="gov-footer-col">
          <h4>DOCUMENTS &amp; HELPDESK</h4>
          <ul>
            <li>
              <button type="button" onClick={() => go("downloads")}>
                Download Application Forms
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("helpdesk")}>
                File a Citizen Grievance (CPGRAMS)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("helpdesk")}>
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button type="button" onClick={() => go("helpdesk")}>
                National Toll-Free Helpline: 1800-11-0031
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Official External Links */}
        <div className="gov-footer-col">
          <h4>GOVERNMENT PORTALS</h4>
          <ul className="gov-footer-external">
            <li>
              <a href="https://socialjustice.gov.in" target="_blank" rel="noreferrer">
                socialjustice.gov.in — Ministry of Social Justice
              </a>
            </li>
            <li>
              <a href="https://nsfdc.nic.in" target="_blank" rel="noreferrer">
                nsfdc.nic.in — NSFDC Official Portal
              </a>
            </li>
            <li>
              <a href="https://www.india.gov.in" target="_blank" rel="noreferrer">
                india.gov.in — National Portal of India
              </a>
            </li>
            <li>
              <a href="https://www.digitalindia.gov.in" target="_blank" rel="noreferrer">
                digitalindia.gov.in — Digital India
              </a>
            </li>
            <li>
              <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer">
                pgportal.gov.in — CPGRAMS Grievance Portal
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="gov-footer-meta">
        <div className="gov-footer-meta-item">
          <span className="label">Total Beneficiary Visitors:</span>
          <span className="value">{VISITOR_COUNT}</span>
        </div>
        <div className="gov-footer-meta-item">
          <span className="label">Portal Content Last Updated:</span>
          <span className="value">{LAST_UPDATED}</span>
        </div>
        <div className="gov-footer-meta-item">
          <span className="label">Accessibility Compliance:</span>
          <span className="value">GIGW (Guidelines for Indian Govt Websites) &amp; W3C AAA</span>
        </div>
      </div>

      <div className="tricolor-strip" aria-hidden="true" />

      {/* Footer Bottom Bar */}
      <div className="gov-footer-bottom">
        <div className="gov-footer-bottom-mark">
          <ChakraIcon size={20} />
          <span>Government of India</span>
        </div>

        <p className="gov-footer-attribution">
          Website Content Managed and Owned by the <strong>National Scheduled Castes Finance &amp; Development Corporation (NSFDC)</strong>,{" "}
          <strong>Ministry of Social Justice &amp; Empowerment</strong>, Government of India.
        </p>

        <p className="gov-footer-disclaimer">
          <strong>Smart India Hackathon (SIH) Prototype Build:</strong> This portal is a working demonstration of the MARG platform developed for SIH jury presentation. Scheme rules, EMI amortisation algorithms, channel partner health routing, and Maker-Checker governance are fully simulated with realistic sample data without external API dependencies.
        </p>

        <p className="gov-footer-copyright">
          © {new Date().getFullYear()} Ministry of Social Justice &amp; Empowerment, Government of India. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
