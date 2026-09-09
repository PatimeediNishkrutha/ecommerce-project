import React from "react";
import { useTheme } from "./ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "24px",
        padding: "6px",
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;