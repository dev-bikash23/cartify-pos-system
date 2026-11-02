import React, { useEffect, useState } from "react";
import { ChevronDown, Palette } from "lucide-react";

export const GLOBAL_SETTINGS_KEY = "cartify-global-settings";

const readTheme = () => {
  try {
    const globalSettings = JSON.parse(localStorage.getItem(GLOBAL_SETTINGS_KEY) || "null");
    if (globalSettings?.theme) return globalSettings.theme;
    const storeSettings = JSON.parse(localStorage.getItem("cartify-store-settings") || "null");
    return storeSettings?.theme || "light";
  } catch {
    return "light";
  }
};

export const applyGlobalTheme = (theme) => {
  const selectedTheme = theme || "light";
  document.documentElement.classList.toggle("dark", selectedTheme === "dark");
  document.documentElement.dataset.theme = selectedTheme;
};

const ThemeSelector = ({ compact = false }) => {
  const [theme, setTheme] = useState(readTheme);
  const themeOptions = [
    { value: "light", label: "Light", color: "bg-slate-200" },
    { value: "red", label: "Red", color: "bg-red-500" },
    { value: "dark", label: "Dark", color: "bg-slate-800" },
  ];
  const selectedTheme = themeOptions.find((option) => option.value === theme) || themeOptions[0];

  useEffect(() => {
    applyGlobalTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeUpdate = (event) => {
      const nextTheme = event.detail?.theme || "light";
      setTheme(nextTheme);
      applyGlobalTheme(nextTheme);
    };
    window.addEventListener("cartify-settings-updated", handleThemeUpdate);
    return () => window.removeEventListener("cartify-settings-updated", handleThemeUpdate);
  }, []);

  const changeTheme = (event) => {
    const nextTheme = event.target.value;
    const settings = { theme: nextTheme };
    localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
    setTheme(nextTheme);
    applyGlobalTheme(nextTheme);
    window.dispatchEvent(new CustomEvent("cartify-settings-updated", { detail: settings }));
  };

  return (
    <div className={`flex items-center gap-2 rounded-xl border border-border bg-card/95 shadow-sm backdrop-blur ${compact ? "px-2 py-1.5" : "px-3 py-2"}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Palette className="h-4 w-4" />
      </span>
      <div className="flex min-w-0 flex-col">
        {!compact && <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Appearance</span>}
        <label htmlFor="global-theme" className="sr-only">Application theme</label>
        <div className="relative flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${selectedTheme.color}`} aria-hidden="true" />
          <select id="global-theme" aria-label="Application theme" value={theme} onChange={changeTheme} className="h-6 cursor-pointer appearance-none bg-transparent pr-5 text-xs font-semibold text-foreground outline-none">
            {themeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
