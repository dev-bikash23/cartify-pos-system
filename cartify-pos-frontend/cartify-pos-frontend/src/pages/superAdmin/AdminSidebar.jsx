import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/Redux Toolkit/features/User/userThunk";

const AdminSidebar = ({ navItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()).then(() => navigate("/"));
  };

  return (
    <div className="w-64 h-screen bg-white border-r shadow-lg flex flex-col shrink-0">

      {/* Header */}
      <div className="flex items-center gap-2 p-5 border-b">
        <Shield className="h-6 w-6 text-green-600" />
        <h1 className="text-xl font-bold">
          Super <span className="text-green-600">Admin</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
        <div className="border-t p-4">
      
              <Button className="w-full h-10 bg-green-600 hover:bg-green-700" onClick={handleLogout}>
      
                <LogOut className="mr-2 h-4 w-4" />
      
                Logout
      
              </Button>
      
            </div>
      {/* Footer */}
      <div className="border-t p-4 text-center text-xs text-gray-500">
        Cartify Shopping Mall v1.0
      </div>
    </div>
  );
};

export default AdminSidebar;