export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#1D4ED8" />
      <path
        fill="#FFFFFF"
        d="M24,8 L28.11,18.34 L39.22,19.05 L30.66,26.16 L33.40,36.94 L24,31 L14.60,36.94 L17.34,26.16 L8.78,19.05 L19.89,18.34 Z"
      />
    </svg>
  );
}
