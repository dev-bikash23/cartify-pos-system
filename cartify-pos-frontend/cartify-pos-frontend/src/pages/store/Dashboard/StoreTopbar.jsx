import React from "react";
import { Bell, User, Palette, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStoreAlerts } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";

const StoreTopbar = () => {
  // ⚠️ Verify these match your actual Redux state shape —
  // same pattern as state.branch?.branch and state.user?.userProfile
  // used elsewhere in the app.
  const store = useSelector((state) => state.store?.store);
  const storeLoading = useSelector((state) => state.store?.loading);
  const userProfile = useSelector((state) => state.user?.userProfile);
  const alerts = useSelector((state) => (state.storeAnalytics?.storeAlerts || [])
    .filter((alert) => alert.severity !== "OK"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartify-store-settings") || "null")?.theme || "light";
    } catch {
      return "light";
    }
  });

  const themeNames = {
    light: "White + Green",
    red: "Red + Dark",
    dark: "Dark Operations",
  };

  const changeTheme = (nextTheme) => {
    const currentSettings = JSON.parse(localStorage.getItem("cartify-store-settings") || "{}");
    const nextSettings = { ...currentSettings, theme: nextTheme };
    localStorage.setItem("cartify-store-settings", JSON.stringify(nextSettings));
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent("cartify-settings-updated", { detail: nextSettings }));
  };

  const toggleNightMode = () => {
    changeTheme(theme === "dark" ? "light" : "dark");
  };
  const soundPlayed = useRef(false);

  useEffect(() => {
    if (!store?.id) dispatch(getStoreByAdmin());
  }, [dispatch, store?.id]);

  const playUrgentSound = () => {
    if (soundPlayed.current) return;
    soundPlayed.current = true;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 740;
      gain.gain.setValueAtTime(0.06, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.35);
    } catch {
      // Browser autoplay policies may require a prior user interaction.
    }
  };

  useEffect(() => {
    if (!store?.id) return;
    dispatch(getStoreAlerts(store.id)).then((result) => {
      if (result.meta?.requestStatus === "fulfilled" && result.payload.some((alert) => alert.severity === "CRITICAL")) {
        playUrgentSound();
      }
    });
  }, [dispatch, store?.id]);

  useEffect(() => {
    const handleThemeUpdate = (event) => setTheme(event.detail?.theme || "light");
    window.addEventListener("cartify-settings-updated", handleThemeUpdate);
    return () => window.removeEventListener("cartify-settings-updated", handleThemeUpdate);
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">

      {/* Left Section */}
      <div className="flex flex-col justify-center">

        <h1 className="text-2xl font-bold leading-none text-gray-900">
          {store?.brand || (storeLoading ? "Loading store..." : "Cartify Shopping Mall")}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {currentDate}
        </p>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2">
          <Palette className="h-4 w-4 text-primary" />
          <label htmlFor="topbar-theme" className="sr-only">Theme</label>
          <select
            id="topbar-theme"
            value={theme}
            onChange={(event) => changeTheme(event.target.value)}
            title={`Theme: ${themeNames[theme]}`}
            className="h-8 max-w-36 bg-transparent text-xs font-medium text-foreground outline-none"
          >
            <option value="light">White + Green</option>
            <option value="red">Red + Dark</option>
            <option value="dark">Dark Operations</option>
          </select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNightMode}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="h-9 w-9 rounded-full text-foreground hover:bg-muted"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-gray-100"
          onClick={() => navigate("/store/alerts")}
          title="View inventory alerts"
        >
          <Bell className="h-5 w-5 text-gray-700" />

          {alerts.length > 0 && (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-center text-[10px] font-bold text-white">
              {alerts.length > 99 ? "99+" : alerts.length}
            </span>
          )}
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">

            <User className="h-5 w-5 text-green-600" />

          </div>

          <div className="leading-tight">

            <p className="text-sm font-semibold text-gray-900">
              {userProfile?.fullName || "—"}
            </p>

            <p className="text-xs text-gray-500">
              {userProfile?.email || "—"}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default StoreTopbar;