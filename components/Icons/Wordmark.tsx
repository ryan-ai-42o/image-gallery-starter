export default function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 70" className={className} aria-hidden="true">
      <polygon points="0,35 40,4 220,4 260,35 220,66 40,66" fill="#1D4ED8" />
      <text
        x="76"
        y="44"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="24"
        fill="#FFFFFF"
        letterSpacing="1"
      >
        STAR
      </text>
      <g transform="translate(130,35)">
        <path
          fill="#FFFFFF"
          d="M0,-9 L2.35,-3.24 L8.56,-2.78 L3.80,1.24 L5.29,7.28 L0,4 L-5.29,7.28 L-3.80,1.24 L-8.56,-2.78 L-2.35,-3.24 Z"
        />
      </g>
      <text
        x="190"
        y="44"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="24"
        fill="#FFFFFF"
        letterSpacing="1"
      >
        CABS
      </text>
    </svg>
  );
}
