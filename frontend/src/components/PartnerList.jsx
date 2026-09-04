import { useEffect, useState } from "react";
import { api } from "../api";
import { t } from "../i18n";
import ChakraIcon from "./ChakraIcon";

const TYPE_LABEL = { PSB: "Public Sector Bank", SCA: "State Channelizing Agency", RRB: "Regional Rural Bank", "NBFC-MFI": "NBFC-MFI" };

// Default to Jaipur if geolocation is denied — keeps the demo moving on stage.
const FALLBACK_LOCATION = { lat: 26.9124, lng: 75.7873, label: "Jaipur (approximate)" };

export default function PartnerList({ lang, onContinue }) {
  const [status, setStatus] = useState("locating"); // locating | ready | error
  const [coords, setCoords] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords(FALLBACK_LOCATION);
      setStatus("ready");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: "Your location" });
        setStatus("ready");
      },
      () => {
        setCoords(FALLBACK_LOCATION);
        setStatus("ready");
      },
      { timeout: 6000 }
    );
  }, []);

  useEffect(() => {
    if (status !== "ready" || !coords) return;
    api
      .getPartners(coords.lat, coords.lng)
      .then(setResult)
      .catch((err) => setError(err.message));
  }, [status, coords]);

  function mapsUrl(p) {
    const query = encodeURIComponent(`${p.name}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=`;
  }
  function directionsUrl(p) {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  }

  return (
    <div className="panel">
      {status === "locating" && <p>Finding your location…</p>}
      {error && <div className="field-error">{error}</div>}

      {coords && (
        <p className="field-hint" style={{ marginBottom: 16 }}>
          Showing partners near {coords.label}.
        </p>
      )}

      {result && (
        <>
          {result.widened && (
            <p className="field-hint" style={{ marginBottom: 12 }}>
              No healthy partners within the usual 25 km — search widened to {result.radiusKm} km.
            </p>
          )}
          <div className="partner-line-list">
            {result.partners.map((p) => (
              <div key={p.id} className="partner-line" tabIndex={0}>
                <span className="partner-line-chakra">
                  <ChakraIcon size={16} />
                </span>

                <div className="partner-line-main">
                  <h4>{p.name}</h4>
                  <span className="partner-line-type">{TYPE_LABEL[p.type] || p.type}</span>
                </div>

                <span className="partner-line-distance">{p.distanceKm} km</span>

                <div className="partner-line-reveal">
                  <span className="partner-line-quota">Quota {p.quotaRemainingPct}% left</span>
                  <div className="partner-line-actions">
                    <a className="link-btn" href={`tel:${p.phone}`}>Call</a>
                    <a className="link-btn" href={directionsUrl(p)} target="_blank" rel="noreferrer">
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="footnote">
            List is sorted by distance and filtered to partners with NPA ≤ 10% and active budget quota —
            no live map tiles are loaded, which keeps this screen fast on slow connections.
          </p>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={onContinue}>
              {t(lang, "continue")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
