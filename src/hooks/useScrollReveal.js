import { useEffect, useRef } from 'react'

/**
 * Custom hook that adds scroll-reveal animation to elements.
 * Returns a ref to attach to the element you want to reveal.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    )

    // If the ref points to a container, observe all .reveal children
    const revealEls = el.querySelectorAll('.reveal')
    if (revealEls.length > 0) {
      revealEls.forEach((child) => observer.observe(child))
    } else if (el.classList.contains('reveal')) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return ref
}

/**
 * Hook that observes all .reveal elements in the document.
 * Use once at the App level to handle all reveal animations.
 */
export function useGlobalScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    // Small delay to ensure DOM is painted
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])
}
