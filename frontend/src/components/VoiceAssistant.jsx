import { useEffect, useRef, useState } from "react";
import { t } from "../i18n";

// Maps our app language codes to BCP-47 tags the Web Speech API expects.
const SPEECH_LANG = { en: "en-IN", hi: "hi-IN", mr: "mr-IN", ta: "ta-IN" };

export default function VoiceAssistant({ lang, onTranscript, onContinue }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = SPEECH_LANG[lang] || "en-IN";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [lang]);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setListening(true);
    }
  }

  function handleContinue() {
    onTranscript(transcript);
    onContinue();
  }

  return (
    <div className="voice-box">
      <p style={{ marginTop: 0, color: "var(--muted)" }}>{t(lang, "speakOrType")}</p>

      {supported ? (
        <>
          <button
            type="button"
            className={`mic-btn ${listening ? "listening" : ""}`}
            onClick={toggleListening}
            aria-label={t(lang, "tapToSpeak")}
          >
            🎙️
          </button>
          <div>{listening ? t(lang, "listening") : t(lang, "tapToSpeak")}</div>
        </>
      ) : (
        <div className="field-hint">
          Voice input isn't supported in this browser — type below instead. (Chrome/Edge desktop or Android recommended for the demo.)
        </div>
      )}

      <div className="transcript-box">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="e.g. I want to start a small grocery shop, project cost around 1 lakh rupees"
          rows={3}
          style={{ width: "100%", border: "none", background: "transparent", resize: "vertical" }}
        />
      </div>

      <div className="form-actions" style={{ justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={handleContinue}>
          {t(lang, "continue")}
        </button>
      </div>
      <p className="footnote">
        In production this transcript routes through Bhashini for regional-language ASR and translation.
        This demo uses the browser's native speech recognition directly.
      </p>
    </div>
  );
}
