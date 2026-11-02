import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const store = {
  name: "Admin Dashboard",
};

const userProfile = {
  name: "Pablo Panday",
  email: "pablo@gmail.com",
};

const AdminTopbar = () => {
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
          {store.name}
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
        >
          <Bell className="h-5 w-5 text-gray-700" />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">

            <User className="h-5 w-5 text-green-600" />

          </div>

          <div className="leading-tight">

            <p className="text-sm font-semibold text-gray-900">
              {userProfile.name}
            </p>

            <p className="text-xs text-gray-500">
              {userProfile.email}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminTopbar;
