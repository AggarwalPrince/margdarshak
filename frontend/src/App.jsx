import { useState } from "react";
import { t } from "./i18n";

// Core Structure & Chrome
import GovHeader from "./components/GovHeader";
import GovFooter from "./components/GovFooter";
import NoticeBar from "./components/NoticeBar";
import Breadcrumbs from "./components/Breadcrumbs";

// Informational & Portal Pages
import LandingPage from "./components/LandingPage";
import AboutMarg from "./components/AboutMarg";
import AboutAuthority from "./components/AboutAuthority";
import Leadership from "./components/Leadership";
import OfficialsDirectory from "./components/OfficialsDirectory";
import SchemesPage from "./components/SchemesPage";
import EmiCalculatorPage from "./components/EmiCalculatorPage";
import ApplicationTracker from "./components/ApplicationTracker";
import DownloadsPage from "./components/DownloadsPage";
import HelpdeskPage from "./components/HelpdeskPage";
import PartnersDirectoryPage from "./components/PartnersDirectoryPage";

// Citizen Application Journey Steps
import LanguageSelect from "./components/LanguageSelect";
import LoginOTP from "./components/LoginOTP";
import VoiceAssistant from "./components/VoiceAssistant";
import SchemeMatcher from "./components/SchemeMatcher";
import FinancialCalculator from "./components/FinancialCalculator";
import PartnerList from "./components/PartnerList";
import ApplicationUpload from "./components/ApplicationUpload";
import Confirmation from "./components/Confirmation";

// Admin / Back-Office
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

const JOURNEY_STEPS = ["language", "login", "voice", "match", "calculator", "partners", "upload", "done"];
const STEP_LABEL = {
  language: "Language",
  login: "Aadhaar e-KYC",
  voice: "Voice Input",
  match: "Eligible Schemes",
  calculator: "Amortisation",
  partners: "Bank Branch",
  upload: "Documents",
  done: "Submission",
};

export default function App() {
  // Modes: landing | about_marg | about | leadership | officials | schemes | calculator | tracker | downloads | helpdesk | partners_directory | journey | admin
  const [mode, setMode] = useState("landing");
  const [lang, setLang] = useState("en");
  const [highContrast, setHighContrast] = useState(false);

  // Citizen Journey State
  const [stepIdx, setStepIdx] = useState(0);
  const [auth, setAuth] = useState(null); // { mobile, token }
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [matchForm, setMatchForm] = useState(null);
  const [calcResult, setCalcResult] = useState(null);
  const [application, setApplication] = useState(null);
  const [calcPresetScheme, setCalcPresetScheme] = useState(null);
  const [trackerPresetId, setTrackerPresetId] = useState("");

  // Admin State
  const [admin, setAdmin] = useState(null);

  const step = JOURNEY_STEPS[stepIdx];

  function next() {
    setStepIdx((i) => Math.min(i + 1, JOURNEY_STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restartJourney() {
    setStepIdx(0);
    setAuth(null);
    setVoiceTranscript("");
    setSelectedScheme(null);
    setMatchForm(null);
    setCalcResult(null);
    setApplication(null);
    setCalcPresetScheme(null);
    setMode("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startJourney(preset = null) {
    setStepIdx(0);
    if (preset) {
      setSelectedScheme(preset);
    }
    setMode("journey");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToCalculatorFor(scheme) {
    setCalcPresetScheme(scheme);
    setMode("calculator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToTrackerWithId(id) {
    setTrackerPresetId(id);
    setMode("tracker");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleAdminActor() {
    if (!admin) return;
    if (admin.username === "admin_ravi") {
      setAdmin({
        username: "admin_priya",
        name: "Priya Sharma",
        role: "Approving Officer (Checker)",
      });
    } else {
      setAdmin({
        username: "admin_ravi",
        name: "Ravi Kumar",
        role: "Scheme Officer (Maker)",
      });
    }
  }

  return (
    <div className={`app-shell ${highContrast ? "high-contrast" : ""}`}>
      {/* 1. Government Identity Header */}
      <GovHeader
        mode={mode}
        setMode={setMode}
        lang={lang}
        setLang={setLang}
        onRestart={restartJourney}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* 2. Scrolling Notice / Ticker Bar */}
      <NoticeBar onSelectNotice={() => setMode("schemes")} />

      {/* 3. Hierarchical Breadcrumbs */}
      <Breadcrumbs mode={mode} setMode={setMode} subLabel={mode === "journey" ? STEP_LABEL[step] : null} />

      {/* 4. Main Page Container */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`main ${mode === "admin" ? "main-wide" : ""} ${mode === "landing" ? "main-landing" : ""} ${
          ["schemes", "about", "about_marg", "officials", "leadership", "tracker", "downloads", "helpdesk", "partners_directory"].includes(mode)
            ? "main-wide"
            : ""
        } ${mode === "journey" && (step === "language" || step === "login") ? "main-journey-wide" : ""}`}
      >
        {/* HOMEPAGE */}
        {mode === "landing" && (
          <LandingPage
            lang={lang}
            setMode={setMode}
            onStartJourney={() => startJourney()}
          />
        )}

        {/* ABOUT MARG */}
        {mode === "about_marg" && <AboutMarg setMode={setMode} />}

        {/* STATUTORY AUTHORITY (NSFDC) */}
        {mode === "about" && <AboutAuthority setMode={setMode} />}

        {/* GOVERNANCE & BOARD */}
        {mode === "leadership" && <Leadership />}

        {/* OFFICIALS DIRECTORY */}
        {mode === "officials" && <OfficialsDirectory />}

        {/* SCHEMES PAGE */}
        {mode === "schemes" && (
          <SchemesPage
            onApply={goToCalculatorFor}
            onDirectApply={(scheme) => startJourney(scheme)}
          />
        )}

        {/* EMI CALCULATOR */}
        {mode === "calculator" && (
          <EmiCalculatorPage
            lang={lang}
            presetScheme={calcPresetScheme}
            onApply={(scheme) => startJourney(scheme)}
          />
        )}

        {/* APPLICATION STATUS TRACKER */}
        {mode === "tracker" && (
          <ApplicationTracker
            initialTrackingId={trackerPresetId}
            onApplyNew={() => startJourney()}
          />
        )}

        {/* DOWNLOADS & FORMS */}
        {mode === "downloads" && <DownloadsPage />}

        {/* CITIZEN HELPDESK & CPGRAMS GRIEVANCE */}
        {mode === "helpdesk" && <HelpdeskPage />}

        {/* PARTNERS DIRECTORY */}
        {mode === "partners_directory" && (
          <PartnersDirectoryPage onApplyAtPartner={() => startJourney()} />
        )}

        {/* CITIZEN APPLICATION JOURNEY */}
        {mode === "journey" && (
          <div className="journey-shell">
            <div className="stepper" aria-label="Application Progress">
              {JOURNEY_STEPS.map((s, i) => (
                <span
                  key={s}
                  className={`step-dot ${i === stepIdx ? "active" : i < stepIdx ? "done" : ""}`}
                >
                  <span className="step-num">{i + 1}</span>
                  <span className="step-text">{STEP_LABEL[s]}</span>
                </span>
              ))}
            </div>

            {step === "language" && (
              <div className="journey-grid">
                <LanguageSelect lang={lang} setLang={setLang} onContinue={next} />
                <aside className="journey-aside">
                  <svg className="aside-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" />
                  </svg>
                  <h3>Bhashini Multilingual Readiness</h3>
                  <p>
                    Hindi, Marathi, and Tamil are fully supported in this demo. Beneficiaries can speak or read terms in their native mother tongue.
                  </p>
                  <ul className="aside-list">
                    <li>Conversational voice assistance</li>
                    <li>Notified interest rates and subsidies translated</li>
                    <li>Switch languages anytime from the header</li>
                  </ul>
                </aside>
              </div>
            )}

            {step === "login" && (
              <div className="journey-grid">
                <LoginOTP
                  lang={lang}
                  onVerified={(a) => {
                    setAuth(a);
                    next();
                  }}
                />
                <aside className="journey-aside">
                  <svg className="aside-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3 4 6v6c0 5 3.4 8.5 8 9 4.6-.5 8-4 8-9V6l-8-3Zm0 6v6m-3-3h6" />
                  </svg>
                  <h3>Aadhaar e-KYC Verification</h3>
                  <p>
                    Direct citizen authentication via Mobile OTP. Generates an encrypted session token tied to your tracking dossier.
                  </p>
                  <ul className="aside-list">
                    <li>Single-use OTP valid for 5 minutes</li>
                    <li>Demo Mode: Code <strong>123456</strong> pre-hinted on screen</li>
                    <li>Data stored in accordance with Aadhaar Act norms</li>
                  </ul>
                </aside>
              </div>
            )}

            {step === "voice" && (
              <VoiceAssistant
                lang={lang}
                onTranscript={setVoiceTranscript}
                onContinue={next}
              />
            )}

            {step === "match" && (
              <SchemeMatcher
                lang={lang}
                onSelect={(scheme, form) => {
                  setSelectedScheme(scheme);
                  setMatchForm(form);
                  next();
                }}
              />
            )}

            {step === "calculator" && selectedScheme && (
              <FinancialCalculator
                lang={lang}
                scheme={selectedScheme}
                formData={matchForm}
                onContinue={(res) => {
                  setCalcResult(res);
                  next();
                }}
              />
            )}

            {step === "partners" && <PartnerList lang={lang} onContinue={next} />}

            {step === "upload" && selectedScheme && (
              <ApplicationUpload
                lang={lang}
                mobile={auth?.mobile}
                scheme={selectedScheme}
                formData={{ ...matchForm, ...calcResult, voiceTranscript }}
                onDone={(app_) => {
                  setApplication(app_);
                  next();
                }}
              />
            )}

            {step === "done" && application && (
              <Confirmation
                lang={lang}
                application={application}
                onRestart={restartJourney}
                onTrack={goToTrackerWithId}
              />
            )}
          </div>
        )}

        {/* ADMIN LOGIN */}
        {mode === "admin" && !admin && <AdminLogin onLogin={setAdmin} />}

        {/* ADMIN PANEL (MAKER-CHECKER) */}
        {mode === "admin" && admin && (
          <AdminPanel
            admin={admin}
            onLogout={() => {
              setAdmin(null);
              setMode("landing");
            }}
            onSwitchAdmin={toggleAdminActor}
          />
        )}
      </main>

      {/* 5. Substantial Institutional Footer */}
      <GovFooter setMode={setMode} />
    </div>
  );
}
