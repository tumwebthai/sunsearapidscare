'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * useTypewriter — Cycles through an array of phrases
 * with a typing & deleting animation effect.
 * Used in the Hero section to show rotating taglines.
 */
export function useTypewriter(
  phrases: string[],
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 2000
) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pause)
    } else if (isDeleting && text === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    } else {
      timeout = setTimeout(
        () => {
          setText(
            isDeleting
              ? current.substring(0, text.length - 1)
              : current.substring(0, text.length + 1)
          )
        },
        isDeleting ? deletingSpeed : typingSpeed
      )
    }
    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pause])

  return text
}

/**
 * useInView — Triggers a boolean flag when the element
 * scrolls into the viewport (IntersectionObserver).
 * Once triggered, it stays true (one-time reveal).
 */
export function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}
