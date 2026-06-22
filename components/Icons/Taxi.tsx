export default function Taxi({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.5 9.5l-1.2-3.6A2 2 0 0 0 16.4 4.5H7.6a2 2 0 0 0-1.9 1.4L4.5 9.5A2.5 2.5 0 0 0 3 11.8V18a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1h11v1a1 1 0 0 0 1 1H20a1 1 0 0 0 1-1v-6.2a2.5 2.5 0 0 0-1.5-2.3zM7.6 6.5h8.8l1 3H6.6l1-3zM6.5 15a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM10 2h4v1.5h-4V2z" />
    </svg>
  );
}
