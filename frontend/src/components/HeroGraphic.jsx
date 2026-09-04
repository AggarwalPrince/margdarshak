// A custom illustration grounded in what this product actually does: an
// applicant is matched to a scheme, then routed to a healthy nearby partner.
// Deliberately not a generic gradient blob or stock icon set.
export default function HeroGraphic() {
  return (
    <svg
      className="hero-graphic"
      viewBox="0 0 420 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagram of an applicant being matched to a scheme and routed to a nearby partner branch"
    >
      <circle cx="210" cy="200" r="190" fill="#16233F" opacity="0.04" />
      <circle cx="210" cy="200" r="150" fill="#C68A2E" opacity="0.05" />

      {/* connecting path */}
      <path
        d="M95 300 C 130 250, 130 190, 95 140"
        stroke="#C68A2E"
        strokeWidth="2.5"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />
      <path
        d="M95 140 C 150 110, 230 110, 260 150"
        stroke="#16233F"
        strokeWidth="2.5"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />
      <path
        d="M260 150 C 300 190, 300 250, 260 290"
        stroke="#2E7D6B"
        strokeWidth="2.5"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />

      {/* applicant node */}
      <g transform="translate(95,140)">
        <circle r="34" fill="#FBF9F4" stroke="#16233F" strokeWidth="2" />
        <path d="M-10 8 a10 10 0 0 1 20 0 M0 -4 a7 7 0 1 0 0.01 0" stroke="#16233F" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="0" y="52" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill="#16233F">Applicant</text>
      </g>

      {/* scheme node */}
      <g transform="translate(220,120)">
        <circle r="38" fill="#FFFFFF" stroke="#C68A2E" strokeWidth="2.5" />
        <path d="M-14 -8 h28 M-14 0 h28 M-14 8 h18" stroke="#C68A2E" strokeWidth="2.2" strokeLinecap="round" />
        <text x="0" y="56" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill="#16233F">Matched scheme</text>
      </g>

      {/* partner node */}
      <g transform="translate(260,290)">
        <circle r="36" fill="#FFFFFF" stroke="#2E7D6B" strokeWidth="2.5" />
        <path d="M-14 10 h28 M-14 10 v-14 l14 -8 l14 8 v14 M-6 10 v-8 h12 v8" stroke="#2E7D6B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="0" y="54" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill="#16233F">Nearby partner</text>
      </g>

      {/* small floating tick to suggest completion */}
      <g transform="translate(330,150)">
        <circle r="16" fill="#2E7D6B" />
        <path d="M-6 0 L-1.5 5 L7 -6" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
