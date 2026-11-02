import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/Redux Toolkit/features/User/userThunk";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Package,
  Users,
  UserCircle,
  FileText,
  Settings,
  LogOut,
  MapPin,
  Store,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getBranchById } from "@/Redux Toolkit/features/Branch/branchThunk";

const BranchSidebar = ({
    branch = null,
    navItems = [],
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()).then(() => navigate("/"));
  };

  const { userProfile } = useSelector((state) => state.user);
  const { branch: fetchedBranch } = useSelector((state) => state.branch);

  const displayBranch = branch || fetchedBranch;

  useEffect(() => {
    if (userProfile?.branchId) {
      dispatch(getBranchById({ id: userProfile.branchId }));
    }
  }, [userProfile, dispatch]);


  return (
    <aside className="w-64 xl:w-72 h-full bg-white border-r shadow-sm flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="px-6 pt-5 pb-4">

        <div className="flex items-center gap-3">

          <div className="bg-green-100 rounded-xl p-2">
            <Store className="w-6 h-6 text-green-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Cartify <span className="text-green-600">Shopping Mall</span>
            </h1>

            <p className="text-xs text-gray-500">
              Branch Management
            </p>
          </div>

        </div>

      </div>

      {/* Branch Card (Only show if branch is provided) */}
{displayBranch && (
  <div className="mx-4 rounded-xl bg-green-50 border border-green-100 p-4">

    <h2 className="font-semibold text-gray-900">
      {displayBranch.name}
    </h2>

    <div className="flex items-start gap-2 mt-2">

      <MapPin
        size={15}
        className="text-green-600 mt-0.5"
      />

      <p className="text-xs text-gray-600 leading-5">
        {displayBranch.address}
      </p>

    </div>

  </div>
)}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">

        {navItems.map((item) => {

          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 mb-2 transition-all duration-200
              ${
                active
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}

              <span className="font-medium text-sm">
                {item.name}
              </span>

            </Link>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="border-t p-4">

        <Button className="w-full h-10 bg-green-600 hover:bg-green-700" onClick={handleLogout}>

          <LogOut className="mr-2 h-4 w-4" />

          Logout

        </Button>

      </div>

    </aside>
  );
};

export default BranchSidebar;