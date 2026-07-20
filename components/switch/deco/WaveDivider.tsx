type Props = {
  /** 上の色 → 下の色。Tailwind bg クラスではなく CSS color を渡す */
  fromColor?: string;
  toColor?: string;
  /** 上向き(top) or 下向き(bottom) */
  direction?: "top" | "bottom";
  className?: string;
  /** 上半分（fromColor側）にドットパターンを重ねる */
  withDots?: boolean;
};

/**
 * セクション間に挿入する波形ディバイダー。
 * minpaku-go.com のやわらかいセクション区切りを再現。
 */
export default function WaveDivider({
  fromColor = "#ffffff",
  toColor = "#f7f8fa",
  direction = "bottom",
  className = "",
  withDots = false,
}: Props) {
  const isTop = direction === "top";

  return (
    <div
      className={`w-full overflow-hidden leading-[0] relative ${className}`}
      style={{ backgroundColor: fromColor, marginTop: "-1px" }}
    >
      {withDots && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='2' cy='2' r='1.2' fill='%23ffffff'/></svg>\")",
            backgroundSize: "24px 24px",
            opacity: 0.04,
          }}
        />
      )}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className={`relative w-full block h-[28px] sm:h-[40px] ${isTop ? "rotate-180" : ""}`}
        style={{ display: "block", verticalAlign: "top" }}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
