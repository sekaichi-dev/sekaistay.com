type Props = {
  beforeLabel?: string;
  before: string;
  afterLabel?: string;
  after: string;
  className?: string;
};

/**
 * Before/After の強烈対比。
 * 左：打消し線の旧価格、右：新価格（強調色）、間に → 矢印。
 */
export default function BeforeAfterBar({
  beforeLabel = "業界相場",
  before,
  afterLabel = "SEKAI STAY",
  after,
  className = "",
}: Props) {
  return (
    <div
      className={`inline-flex items-center gap-4 sm:gap-6 bg-white/5 border border-white/10 rounded-md px-5 py-4 ${className}`}
    >
      <div className="text-center">
        <p className="text-[10px] text-white/50 tracking-widest font-bold mb-1">
          {beforeLabel}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-white/60 line-through decoration-switch-teal-deep decoration-[3px]">
          {before}
        </p>
      </div>
      <svg
        className="w-6 h-6 sm:w-8 sm:h-8 text-switch-teal-bright shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
      <div className="text-center">
        <p className="text-[10px] text-switch-teal-bright tracking-widest font-bold mb-1">
          {afterLabel}
        </p>
        <p className="text-3xl sm:text-4xl font-bold gradient-text-hero">
          {after}
        </p>
      </div>
    </div>
  );
}
