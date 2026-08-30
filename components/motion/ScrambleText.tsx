"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * sense-trust の `js-random`（巨大ゴースト文字のスクランブル）踏襲。
 * スクロールで視界に入った瞬間に一度だけ、ランダム文字→最終テキストへ収束する。
 */
export default function ScrambleText({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }

    let raf = 0;
    let frame = 0;
    const total = 34;
    const tick = () => {
      frame++;
      const progress = frame / total;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") out += " ";
        else if (i / text.length < progress) out += ch;
        else out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = out;
      if (frame < total) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            tick();
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} aria-hidden className={className} style={style}>
      {text}
    </span>
  );
}
