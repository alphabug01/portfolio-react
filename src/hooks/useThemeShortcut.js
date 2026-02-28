import { useEffect, useState } from "react";

export function useThemeShortcut() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeShortcut = (event) => {
      const isShortcutPressed =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d";

      if (!isShortcutPressed) {
        return;
      }

      const tagName = event.target?.tagName;
      const isEditable =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        event.target?.isContentEditable;

      if (isEditable) {
        return;
      }

      event.preventDefault();
      setTheme((previousTheme) =>
        previousTheme === "dark" ? "light" : "dark",
      );
    };

    window.addEventListener("keydown", handleThemeShortcut);
    return () => window.removeEventListener("keydown", handleThemeShortcut);
  }, []);
}
