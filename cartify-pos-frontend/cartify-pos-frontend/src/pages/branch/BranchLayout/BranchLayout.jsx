import React from "react";
import { Outlet } from "react-router-dom";
import BranchSidebar from "../sidebar/BranchSidebar";
import BranchTopbar from "../topbar/BranchTopbar";

import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Package,
  Users,
  UserCircle,
  FileText,
  Settings,
} from "lucide-react";

import { useSelector } from 'react-redux'

const navItems = [
  {
    name: "Dashboard",
    path: "/branch/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Orders",
    path: "/branch/orders",
    icon: <ShoppingBag size={18} />,
  },
  {
    name: "Transactions",
    path: "/branch/transaction",
    icon: <CreditCard size={18} />,
  },
  {
    name: "Inventory",
    path: "/branch/inventory",
    icon: <Package size={18} />,
  },
  {
    name: "Employees",
    path: "/branch/employees",
    icon: <Users size={18} />,
  },
  {
    name: "Customers",
    path: "/branch/customers",
    icon: <UserCircle size={18} />,
  },
  {
    name: "Reports",
    path: "/branch/reports",
    icon: <FileText size={18} />,
  },
  {
    name: "Settings",
    path: "/branch/settings",
    icon: <Settings size={18} />,
  },
];

const BranchLayout = () => {
  const {branch}=useSelector(state=>state.branch)
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar */}
      <BranchSidebar branch={branch} navItems={navItems}/>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        <BranchTopbar />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default BranchLayout;