import gsap from "gsap";
import { useEffect } from "react";

/**
 * Animates card elements directly when data finishes loading.
 * This bypasses ScrollTrigger so async-rendered cards are never stuck at opacity 0.
 * @param {React.RefObject} containerRef - ref attached to the grid container
 * @param {boolean} ready - set to true when data has loaded and cards are in the DOM
 * @param {string} [selector='.card-item'] - selector for the card elements to animate
 */
export function useCardReveal(containerRef, ready, selector = ".card-item") {
  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(selector);
    if (!cards.length) return;

    // Kill any lingering tweens on these elements before re-animating
    gsap.killTweensOf(cards);

    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.07,
        clearProps: "transform",
      },
    );
  }, [ready, containerRef, selector]);
}
