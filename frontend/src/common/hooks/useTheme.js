import * as React from "react";

const THEME_KEY = "pulsekar_theme";

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setTheme] = React.useState(getInitialTheme);

  React.useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  return {
    theme,
    toggleTheme,
  };
}
