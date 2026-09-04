import { LANGUAGES, t } from "../i18n";

export default function LanguageSelect({ lang, setLang, onContinue }) {
  return (
    <div className="panel">
      <h2 className="panel-title">{t(lang, "chooseLanguage")}</h2>
      <p className="panel-subtitle">
        Pick the language you're most comfortable with — you can change this anytime.
      </p>
      <div className="lang-grid">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            className={`lang-tile ${lang === l.code ? "selected" : ""}`}
            onClick={() => setLang(l.code)}
            type="button"
          >
            <span className="lang-tile-script">{l.label}</span>
            <span className="lang-tile-native">{l.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={onContinue}>
          {t(lang, "continue")}
        </button>
      </div>
    </div>
  );
}
