import BranchSidebar from "@/pages/branch/sidebar/BranchSidebar";
import StoreTopbar from "@/pages/store/Dashboard/StoreTopbar";
import { ShoppingCart } from "lucide-react";
import { Users } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { FileText } from "lucide-react";
import { Settings } from "lucide-react";
import { BadgeDollarSign } from "lucide-react";
import { CreditCard } from "lucide-react";
import { Truck } from "lucide-react";
import { Tag } from "lucide-react";
import { Store } from "lucide-react";
import { LayoutDashboard } from "lucide-react";

import React from "react";
import { Outlet } from "react-router-dom";

const navLinks = [
  {
    name: "Dashboard",
    path: "/store/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Stores",
    path: "/store/stores",
    icon: <Store className="w-5 h-5" />,
  },
  {
    name: "Branches",
    path: "/store/branches",
    icon: <Store className="w-5 h-5" />,
  },
  {
    name: "Products",
    path: "/store/products",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    name: "Categories",
    path: "/store/categories",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    name: "Employees",
    path: "/store/employees",
    icon: <Users className="w-5 h-5" />,
  }, 
  {
    name: "Alerts",
    path: "/store/alerts",
    icon: <Truck className="w-5 h-5" />,
  }, 
  {
    name: "Sales",
    path: "/store/sales",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  // {
  //   name: "Transactions",
  //   path: "/store/transactions",
  //   icon: <CreditCard className="w-5 h-5" />,
  // },
  {
    name: "Reports",
    path: "/store/reports",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: "Upgrade Plan",
    path: "/store/upgrade",
    icon: <BadgeDollarSign className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/store/settings",
    icon: <Settings className="w-5 h-5" />,
  },
]

const StoreDashboardLayout = ({children}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar */}
     <BranchSidebar
    navItems={navLinks}
/>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        <StoreTopbar />

        <main className="flex-1 overflow-y-auto px-5 py-4 md:px-6 md:py-5">
         {children || <Outlet />}
        </main>

      </div>

    </div>
  );
};

export default StoreDashboardLayout;
