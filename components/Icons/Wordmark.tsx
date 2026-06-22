export default function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 70" className={className} aria-hidden="true">
      <path
        d="M 32.10,59.87 L 3.162,37.45 Q 0,35 3.162,32.55 L 32.10,10.13 Q 40,4 50,4 L 210,4 Q 220,4 227.9,10.13 L 256.84,32.55 Q 260,35 256.84,37.45 L 227.9,59.87 Q 220,66 210,66 L 50,66 Q 40,66 32.10,59.87 Z"
        fill="#1D4ED8"
        stroke="#1E3A8A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text
        x="76"
        y="44"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="26"
        fill="#FFFFFF"
        letterSpacing="1.5"
      >
        STAR
      </text>
      <g transform="translate(130,35)">
        <path
          fill="#FFFFFF"
          d="M0,-10 L2.245,-3.090 L9.511,-3.090 L3.633,1.180 L5.878,8.090 L0,3.82 L-5.878,8.090 L-3.633,1.180 L-9.511,-3.090 L-2.245,-3.090 Z"
        />
      </g>
      <text
        x="190"
        y="44"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="26"
        fill="#FFFFFF"
        letterSpacing="1.5"
      >
        CABS
      </text>
    </svg>
  );
}
