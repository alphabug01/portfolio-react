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

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reducedMotion } = context.conditions;

        const rafId = requestAnimationFrame(() => {
          const els = document.querySelectorAll(".reveal:not(.visible)");

          els.forEach((el) => {
            if (reducedMotion) {
              // Show immediately without animation
              gsap.set(el, { opacity: 1, y: 0 });
              el.classList.add("visible");
              return;
            }

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
      },
    );

    return () => mm.revert();
  }, [triggerKey]);
}
