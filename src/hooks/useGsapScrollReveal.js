import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Replaces CSS-based reveal with GSAP ScrollTrigger-powered reveal.
 * Observes all `.reveal` elements and animates them from opacity 0 + translateY(30px).
 * Re-runs when triggerKey changes (e.g. on route change).
 */
export function useGsapScrollReveal(triggerKey = 0) {
  useEffect(() => {
    const createdTriggers = [];

    const rafId = requestAnimationFrame(() => {
      const els = document.querySelectorAll(".reveal:not(.visible)");

      els.forEach((el) => {
        const tween = gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 98%",
              toggleActions: "play none none none",
              once: true,
              onEnter: () => el.classList.add("visible"),
            },
          },
        );

        if (tween.scrollTrigger) {
          createdTriggers.push(tween.scrollTrigger);
        }
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(rafId);
      createdTriggers.forEach((st) => st.kill());
    };
  }, [triggerKey]);
}
