import { useState } from "react";
import { LANGUAGES, t } from "../i18n";
import ChakraIcon from "./ChakraIcon";

export default function GovHeader({
  mode,
  setMode,
  lang,
  setLang,
  onRestart,
  highContrast,
  setHighContrast,
}) {
  const [textScale, setTextScale] = useState(1);
  const [navOpen, setNavOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  function applyScale(next) {
    const clamped = Math.min(1.15, Math.max(0.9, next));
    setTextScale(clamped);
    document.documentElement.style.fontSize = `${clamped * 100}%`;
  }

  function go(key) {
    setMode(key);
    setNavOpen(false);
    setAboutDropdown(false);
    setServicesDropdown(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="gov-header-root">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 1. Utility Bar */}
      <div className="gov-utility-bar">
        <div className="gov-utility-inner">
          <div className="gov-utility-left">
            <span>भारत सरकार | Government of India</span>
          </div>

          <div className="gov-utility-right">
            <button
              type="button"
              className="util-link"
              onClick={() => document.getElementById("main-content")?.focus()}
            >
              Skip to Main Content
            </button>

            <span className="util-sep" aria-hidden="true">|</span>

            <span className="text-size-group" role="group" aria-label="Adjust text size">
              <button
                type="button"
                className="util-link"
                onClick={() => applyScale(textScale - 0.05)}
                aria-label="Decrease text size"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                className="util-link"
                onClick={() => applyScale(1)}
                aria-label="Reset text size"
                title="Reset font size"
              >
                A
              </button>
              <button
                type="button"
                className="util-link"
                onClick={() => applyScale(textScale + 0.05)}
                aria-label="Increase text size"
                title="Increase font size"
              >
                A+
              </button>
            </span>

            <span className="util-sep" aria-hidden="true">|</span>

            {/* High Contrast Accessibility Toggle */}
            <button
              type="button"
              className={`util-link util-contrast-btn ${highContrast ? "contrast-active" : ""}`}
              onClick={() => setHighContrast(!highContrast)}
              aria-label="Toggle High Contrast Mode"
              title="Toggle High Contrast Accessibility Mode"
            >
              {highContrast ? "☀️ Standard View" : "🌓 High Contrast"}
            </button>

            <span className="util-sep" aria-hidden="true">|</span>

            {/* Bilingual Switcher */}
            <select
              className="util-lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select portal language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            <span className="util-sep" aria-hidden="true">|</span>

            <button
              type="button"
              className="util-link util-admin-link"
              onClick={() => go("admin")}
            >
              🏛️ Officials Login
            </button>
          </div>
        </div>
      </div>

      {/* 2. Identity Bar */}
      <div className="gov-identity-bar">
        <div className="gov-identity-inner">
          <div
            className="gov-identity-mark"
            onClick={() => go("landing")}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            aria-label="Return to MARG Home"
          >
            <ChakraIcon size={44} />
          </div>

          <div className="gov-identity-text">
            <div className="gov-identity-hi">
              सामाजिक न्याय और अधिकारिता मंत्रालय | भारत सरकार
            </div>
            <div className="gov-identity-en">
              Ministry of Social Justice &amp; Empowerment · Government of India
            </div>
            <div className="gov-identity-sub">
              National Scheduled Castes Finance &amp; Development Corporation (NSFDC)
            </div>
          </div>

          <div
            className="gov-identity-brand"
            onClick={() => go("landing")}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            aria-label="Go to MARG homepage"
          >
            <div className="gov-identity-brand-name">MARG</div>
            <div className="gov-identity-brand-tag">
              Marginalized Assistance &amp; Resource Gateway
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Navigation Bar */}
      <nav className="gov-nav" aria-label="Primary Navigation">
        <div className="gov-nav-inner">
          <button
            type="button"
            className="gov-nav-toggle"
            onClick={() => setNavOpen(!navOpen)}
            aria-expanded={navOpen}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`gov-nav-list ${navOpen ? "open" : ""}`}>
            {/* HOME */}
            <li>
              <button
                type="button"
                className={`gov-nav-link ${mode === "landing" ? "active" : ""}`}
                onClick={() => go("landing")}
              >
                HOME
              </button>
            </li>

            {/* ABOUT US (Dropdown) */}
            <li
              className="gov-nav-item-has-dropdown"
              onMouseEnter={() => setAboutDropdown(true)}
              onMouseLeave={() => setAboutDropdown(false)}
            >
              <button
                type="button"
                className={`gov-nav-link ${
                  ["about_marg", "about", "officials", "leadership"].includes(mode)
                    ? "active"
                    : ""
                }`}
                onClick={() => setAboutDropdown(!aboutDropdown)}
                aria-haspopup="true"
                aria-expanded={aboutDropdown}
              >
                ABOUT US <span className="dropdown-arrow">▾</span>
              </button>
              {aboutDropdown && (
                <ul className="gov-dropdown-menu" role="menu">
                  <li>
                    <button
                      type="button"
                      className={`dropdown-item ${mode === "about_marg" ? "active" : ""}`}
                      onClick={() => go("about_marg")}
                    >
                      About MARG Gateway
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`dropdown-item ${mode === "about" ? "active" : ""}`}
                      onClick={() => go("about")}
                    >
                      Statutory Authority (NSFDC)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`dropdown-item ${mode === "officials" ? "active" : ""}`}
                      onClick={() => go("officials")}
                    >
                      Officials Directory
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`dropdown-item ${mode === "leadership" ? "active" : ""}`}
                      onClick={() => go("leadership")}
                    >
                      Governance &amp; Board
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* SCHEMES */}
            <li>
              <button
                type="button"
                className={`gov-nav-link ${mode === "schemes" ? "active" : ""}`}
                onClick={() => go("schemes")}
              >
                SCHEMES
              </button>
            </li>

            {/* CITIZEN SERVICES (Dropdown) */}
            <li
              className="gov-nav-item-has-dropdown"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                type="button"
                className={`gov-nav-link ${
                  ["journey", "calculator", "tracker"].includes(mode) ? "active" : ""
                }`}
                onClick={() => setServicesDropdown(!servicesDropdown)}
                aria-haspopup="true"
                aria-expanded={servicesDropdown}
              >
                SERVICES <span className="dropdown-arrow">▾</span>
              </button>
              {servicesDropdown && (
                <ul className="gov-dropdown-menu" role="menu">
                  <li>
                    <button
                      type="button"
                      className={`dropdown-item ${mode === "journey" ? "active" : ""}`}
                      onClick={() => go("journey")}
                    >
                      Apply for Assistance (Citizen Journey)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`dropdown-item ${mode === "calculator" ? "active" : ""}`}
                      onClick={() => go("calculator")}
                    >
                      EMI &amp; Moratorium Calculator
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`dropdown-item ${mode === "tracker" ? "active" : ""}`}
                      onClick={() => go("tracker")}
                    >
                      Track Application Status
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* PARTNERS */}
            <li>
              <button
                type="button"
                className={`gov-nav-link ${mode === "partners_directory" ? "active" : ""}`}
                onClick={() => go("partners_directory")}
              >
                PARTNER INSTITUTIONS
              </button>
            </li>

            {/* APPLICATION STATUS (Direct Quick Link) */}
            <li>
              <button
                type="button"
                className={`gov-nav-link ${mode === "tracker" ? "active" : ""}`}
                onClick={() => go("tracker")}
              >
                TRACK STATUS
              </button>
            </li>

            {/* DOCUMENTS */}
            <li>
              <button
                type="button"
                className={`gov-nav-link ${mode === "downloads" ? "active" : ""}`}
                onClick={() => go("downloads")}
              >
                DOCUMENTS
              </button>
            </li>

            {/* HELPDESK & GRIEVANCE */}
            <li>
              <button
                type="button"
                className={`gov-nav-link ${mode === "helpdesk" ? "active" : ""}`}
                onClick={() => go("helpdesk")}
              >
                GRIEVANCE &amp; HELPDESK
              </button>
            </li>
          </ul>

          <div className="gov-nav-actions">
            {mode === "journey" ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm gov-nav-restart"
                onClick={onRestart}
              >
                ← Start over
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-gold btn-sm nav-apply-cta"
                onClick={() => go("journey")}
              >
                Apply Online →
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Tricolor National Ribbon */}
      <div className="tricolor-strip" aria-hidden="true" />
    </header>
  );
}
