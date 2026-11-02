import React, { useMemo } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NotificationPopover from "@/components/NotificationPopover";
import { getStoreAlerts } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";

const StoreTopbar = () => {
  // ⚠️ Verify these match your actual Redux state shape —
  // same pattern as state.branch?.branch and state.user?.userProfile
  // used elsewhere in the app.
  const store = useSelector((state) => state.store?.store);
  const storeLoading = useSelector((state) => state.store?.loading);
  const userProfile = useSelector((state) => state.user?.userProfile);
  const storeAlerts = useSelector((state) => state.storeAnalytics?.storeAlerts);
  const alerts = useMemo(
    () => (storeAlerts || []).filter((alert) => alert.severity !== "OK"),
    [storeAlerts]
  );
  const dispatch = useDispatch();
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

        {/* Notification */}
        <NotificationPopover items={alerts.map((alert) => alert.message || `${alert.severity} inventory alert`)} label="Inventory notifications" />

        {/* User Profile */}
        <Link to="/store/profile" className="flex h-10 items-center gap-3 rounded-lg px-1 hover:bg-gray-50">

          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">

            {userProfile?.profilePicture ? <img src={userProfile.profilePicture} alt="" className="h-full w-full rounded-full object-cover" /> : <User className="h-5 w-5 text-green-600" />}

          </div>

          <div className="leading-tight">

            <p className="text-sm font-semibold text-gray-900">
              {userProfile?.fullName || "—"}
            </p>

            <p className="text-xs text-gray-500">
              {userProfile?.email || "—"}
            </p>
          </div>
        </Link>

      </div>

    </header>
  );
};

export default StoreTopbar;