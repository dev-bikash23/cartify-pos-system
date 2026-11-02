import React, { useMemo, useState } from "react";
import { Bell, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminTopbar = () => {
  const { userProfile } = useSelector((state) => state.user);
  const { overview, statusDistribution } = useSelector((state) => state.adminDashboard);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [read, setRead] = useState(false);
  const notificationsEnabled = (() => {
    try {
      return JSON.parse(localStorage.getItem("cartify-admin-settings") || "{}").notifications !== false;
    } catch {
      return true;
    }
  })();
  const notifications = useMemo(() => [
    overview?.pendingStore ? `${overview.pendingStore} store request(s) are waiting for review.` : "No pending store requests.",
    statusDistribution.length ? "Store status data is available for review." : "Dashboard status data is loading.",
  ], [overview, statusDistribution]);
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
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {currentDate}
        </p>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-gray-100"
          onClick={() => { if (notificationsEnabled) { setNotificationsOpen((current) => !current); setRead(true); } }}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-700" />

          {notificationsEnabled && !read && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>}
        </Button>
        {notificationsOpen && (
          <div className="absolute right-24 top-14 z-20 w-80 rounded-lg border bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Notifications</h2><button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X className="h-4 w-4" /></button></div>
            <div className="space-y-2">{notifications.map((notification) => <p key={notification} className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{notification}</p>)}</div>
          </div>
        )}

        {/* User Profile */}
        <Link to="/super-admin/profile" className="flex h-10 items-center gap-3 rounded-lg px-1 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500">

          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">

            {userProfile?.profilePicture ? <img src={userProfile.profilePicture} alt="" className="h-full w-full rounded-full object-cover" /> : <User className="h-5 w-5 text-green-600" />}

          </div>

          <div className="leading-tight">

            <p className="text-sm font-semibold text-gray-900">
              {userProfile?.fullName || "Administrator"}
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

export default AdminTopbar;
