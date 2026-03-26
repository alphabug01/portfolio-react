import { useEffect } from "react";

/**
 * Creates a subtle cursor glow effect on desktop devices.
 */
export function useCursorGlow() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const glow = document.createElement("div");
    glow.classList.add("cursor-glow");
    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let animId;
    let idleTimer = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Set will-change while moving, clear it when idle to release compositor layer
      glow.style.willChange = "transform";
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        glow.style.willChange = "auto";
      }, 300);
    };

    document.addEventListener("mousemove", onMouseMove);

    const animateGlow = () => {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
      animId = requestAnimationFrame(animateGlow);
    };

    animateGlow();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
      clearTimeout(idleTimer);
      glow.remove();
    };
  }, []);
}
