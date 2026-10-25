export default function Logo({ className = "" }) {
  return (
    <svg
      className={`logo ${className}`.trim()}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Job Application Tracker logo"
    >
      <rect width="40" height="40" rx="12" fill="currentColor" opacity=".14" />
      <path
        d="M12 13h16v14H12zM16 13v-3h8v3M16 20l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
