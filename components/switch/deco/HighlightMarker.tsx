import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  draw?: boolean; // true なら入場時に描画アニメ
  className?: string;
};

/**
 * 黄色マーカー風の下線強調。
 * draw=true で左→右に引かれるアニメーションが発火。
 */
export default function HighlightMarker({
  children,
  draw = false,
  className = "",
}: Props) {
  return (
    <span
      className={`${draw ? "highlight-marker-draw" : "highlight-marker"} ${className}`}
    >
      {children}
    </span>
  );
}
