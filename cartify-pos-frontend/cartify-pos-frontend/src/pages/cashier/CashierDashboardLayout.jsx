import React, { useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import {
  ReceiptIcon,
  RotateCcw,
  Clock,
  ShoppingCart,
  Users,
  UserCircle,
  Plus,
  FolderPlus,
  Package,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "@/context/hook/useSidebar";
import { SidebarProvider } from "@/context/hook/SidebarProvider";
import { getBranchById } from "@/Redux Toolkit/features/Branch/branchThunk";

const navLinks = [
  { path: "/cashier", icon: <ShoppingCart size={20} />, label: "POS Terminal" },
  { action: true, icon: <Plus size={20} />, label: "Add Product" },
  { action: "category", icon: <FolderPlus size={20} />, label: "Add Category" },
  { path: "/cashier/inventory", icon: <Package size={20} />, label: "Inventory" },
  { path: "/cashier/orders", icon: <Clock size={20} />, label: "Orders History" },
  { path: "/cashier/customers", icon: <Users size={20} />, label: "Customers" },
  { path: "/cashier/returns", icon: <RotateCcw size={20} />, label: "Returns / Refund" },
  { path: "/cashier/shift-summary", icon: <ReceiptIcon size={20} />, label: "Shift Summary" },
  { path: "/cashier/profile", icon: <UserCircle size={20} />, label: "Profile" },
];

const LayoutContent = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();

  // Adjust this to wherever your branch data actually lives in Redux
  const branch = useSelector((state) => state.branch?.branch);
  const branchId = useSelector((state) => state.user?.userProfile?.branchId);

  useEffect(() => {
    if (branchId && branch?.id !== branchId) {
      dispatch(getBranchById({ id: branchId }));
    }
  }, [branchId, branch?.id, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed z-30 h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          navItems={navLinks}
          onClose={() => setSidebarOpen(false)}
          branch={branch}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

const CashierDashboardLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default CashierDashboardLayout;