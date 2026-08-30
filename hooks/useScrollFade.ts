"use client";

import { useEffect, useRef } from "react";

export function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    const targets = el.querySelectorAll(".fade-in");
    targets.forEach((t) => observer.observe(t));

    // フォールバック: hash 遷移やリロードで要素が既に画面内にあるのに
    // IntersectionObserver が発火しないケースに備え、1秒後に強制表示。
    const fallback = window.setTimeout(() => {
      targets.forEach((t) => {
        if (!t.classList.contains("visible")) {
          const rect = (t as HTMLElement).getBoundingClientRect();
          const inView =
            rect.top < window.innerHeight && rect.bottom > 0;
          if (inView) t.classList.add("visible");
        }
      });
    }, 1000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return ref;
}
