import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

/**
 * Wraps children in #smooth-wrapper > #smooth-content for GSAP ScrollSmoother.
 * Provides a globally accessible smoother instance via window.__smoother.
 */
export default function SmoothScroller({ children }) {
  const wrapperRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1,
    })

    // Expose globally so other components can use smoother.scrollTo()
    window.__smoother = smoother

    return () => {
      smoother.kill()
      delete window.__smoother
    }
  }, [])

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
