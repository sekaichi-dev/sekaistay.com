"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * sense-trust の `.u-text-slide-up` 踏襲。
 * overflow-hidden の行マスクで、スクロールで下から 0 へスライドアップ（CSS transition）。
 * IntersectionObserver で一度だけ js-show を付与。発火しなかった場合のフォールバックも持つ（非表示固定の回避）。
 */
export default function TextSlideUp({
  children,
  as: Tag = "span",
  className = "",
  lineDelay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  lineDelay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("js-show");
      return;
    }
    const show = () => el.classList.add("js-show");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    // 万一トリガーが発火しなくても、3秒後には必ず表示（非表示固定を防ぐ）
    const fallback = window.setTimeout(show, 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag ref={ref} className={`slide-up ${className}`}>
      <span className="slide-up__inner" style={{ transitionDelay: `${lineDelay}s` } as CSSProperties}>
        {children}
      </span>
    </Tag>
  );
}
