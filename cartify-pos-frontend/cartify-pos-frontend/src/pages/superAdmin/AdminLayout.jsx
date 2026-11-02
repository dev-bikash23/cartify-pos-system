import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar"; 

import {
  FileText,
  Download,
  Clock,
  Settings,
  Store,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react";


const navLinks = [
  {
    name: "Dashboard",
    path: "/super-admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Stores",
    path: "/super-admin/stores",
    icon: <Store className="w-5 h-5" />,
  },
  {
    name: "Subscription Plans",
    path: "/super-admin/subscriptions",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: "Pending Requests",
    path: "/super-admin/requests",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    name: "Exports",
    path: "/super-admin/exports",
    icon: <Download className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/super-admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: "Profile",
    path: "/super-admin/profile",
    icon: <UserRound className="w-5 h-5" />,
  },
  {
    name: "Users",
    path: "/super-admin/users",
    icon: <Users className="w-5 h-5" />,
  },
];

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar */}
      <AdminSidebar navItems={navLinks} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto px-5 py-4 md:px-6 md:py-5">
          {children || <Outlet />}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;