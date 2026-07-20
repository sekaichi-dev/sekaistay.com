type Props = {
  className?: string;
  opacity?: number;
  color?: string; // CSS color, default white
};

/**
 * 背景に敷く微細なドットパターン。親要素を relative にして overlay する。
 * opacity は 0 〜 1。
 */
export default function DotPattern({
  className = "",
  opacity = 0.08,
  color = "#ffffff",
}: Props) {
  const encoded = encodeURIComponent(color);
  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='2' cy='2' r='1.2' fill='${encoded}'/></svg>")`,
        backgroundSize: "24px 24px",
        opacity,
      }}
    />
  );
}
