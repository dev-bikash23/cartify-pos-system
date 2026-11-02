import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from 'react-redux'

const BranchTopbar = () => {
  const { userProfile } = useSelector((state) => state.user);
  
  const {branch}=useSelector(state=>state.branch)
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

        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
        >
          <Bell size={20} />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>

        </Button>

        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">

            <User className="text-green-600" size={20} />

          </div>

          <div>

            <p className="font-medium">
              {userProfile.fullName}
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

export default BranchTopbar;