// 24-spoke chakra motif, drawn from scratch (national emblem style, no external asset).
export default function ChakraIcon({ size = 24, className = "" }) {
  const spokes = Array.from({ length: 24 });
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4.5" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
      {spokes.map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="9"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </svg>
  );
}
