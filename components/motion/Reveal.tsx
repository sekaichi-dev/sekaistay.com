"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * スクロールで要素がせり上がりながら現れる共通演出（sense-trust 踏襲 / GSAP ScrollTrigger）。
 * stagger=true で直下の子要素を順番に出す（カードグリッド等）。
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  y = 32,
  stagger = false,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  stagger?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger ? Array.from(el.children) : [el];
    // sense-trust 準拠: opacity 0→1 ＋ yPercent 30→0, duration 0.65, ease power2.out
    const fromVars = stagger ? { yPercent: 30 } : { y };
    const toVars = stagger ? { yPercent: 0 } : { y: 0 };
    const ctx = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0, ...fromVars });
      gsap.to(targets, {
        autoAlpha: 1,
        ...toVars,
        duration: 0.65,
        ease: "power2.out",
        delay,
        stagger: stagger ? 0.1 : 0,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [y, stagger, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
