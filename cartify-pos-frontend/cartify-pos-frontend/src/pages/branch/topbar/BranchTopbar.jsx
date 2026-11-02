import React from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import NotificationPopover from "@/components/NotificationPopover";

const BranchTopbar = () => {
  const { userProfile } = useSelector((state) => state.user);
  
  const {branch}=useSelector(state=>state.branch)
  const notifications = branch?.id ? [`Branch ${branch.name || "operations"} dashboard is active.`] : [];
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>

        <h1 className="text-xl font-semibold">
          Branch Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

      </div>

      <div className="flex items-center gap-5">

        <NotificationPopover items={notifications} label="Branch notifications" />

        <Link to="/branch/profile" className="flex h-10 items-center gap-3 rounded-lg px-1 hover:bg-gray-50">

          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">

            {userProfile?.profilePicture ? <img src={userProfile.profilePicture} alt="" className="h-full w-full rounded-full object-cover" /> : <User className="text-green-600" size={20} />}

          </div>

          <div>

            <p className="font-medium">
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

export default BranchTopbar;