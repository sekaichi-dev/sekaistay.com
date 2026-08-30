'use client'

import { useEffect, useRef, ReactNode } from 'react'

/**
 * Wraps children in a fade-up animation triggered by IntersectionObserver.
 * Adds .is-visible when 15% of the element is in viewport.
 */
export default function ScrollFade({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el) // once only
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  )
}
