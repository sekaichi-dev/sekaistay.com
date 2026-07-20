type Props = {
  direction?: "down" | "up";
  label?: string;
  className?: string;
  colorClass?: string; // Tailwind color class e.g. "text-switch-accent"
};

/**
 * 下向き脈打ち矢印。direction="up" で上向きに反転。
 */
export default function BounceArrow({
  direction = "down",
  label,
  className = "",
  colorClass = "text-switch-accent",
}: Props) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {direction === "up" && label && (
        <span className={`text-xs font-bold ${colorClass}`}>{label}</span>
      )}
      <svg
        className={`w-6 h-6 sm:w-8 sm:h-8 bounce-arrow ${colorClass}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ transform: direction === "up" ? "rotate(180deg)" : undefined }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
      {direction === "down" && label && (
        <span className={`text-xs font-bold ${colorClass}`}>{label}</span>
      )}
    </div>
  );
}
