'use client'

import { useInView } from './hooks'

interface RevealSectionProps {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}

/**
 * RevealSection — Wraps any content and reveals it with
 * a smooth fade-up animation when scrolled into view.
 * The `delay` prop offsets the animation for staggered effects.
 */
export default function RevealSection({ children, delay = 0, style = {} }: RevealSectionProps) {
  const [ref, isVisible] = useInView(0.1)

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
