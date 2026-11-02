import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getBranchById } from "@/Redux Toolkit/features/Branch/branchThunk";
import { logout } from "@/Redux Toolkit/features/User/userThunk";

// const dummyBranch = {
//   name: "Bhubaneswar East Branch",
//   address: "Baramunda Bus Stand, Bhubaneswar",
// };

const Sidebar = ({ navItems, onClose, branch }) => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.user);
  const { branch: fetchedBranch } = useSelector((state) => state.branch);
  const navigate=useNavigate();

  const displayBranch = branch || fetchedBranch;

  useEffect(() => {
    if (userProfile?.branchId) {
      dispatch(getBranchById({ id: userProfile.branchId }));
    }
  }, [userProfile, dispatch]);

  const handleLogout=()=>{
    dispatch(logout()).then(() => navigate("/"));
  }
  return (
  
    <div className="w-64 h-screen bg-white border-r shadow-lg flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">
        <h1 className="text-xl font-bold">
          Cartify <span className="text-green-600">Shopping Mall</span>
        </h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/cashier"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer — Branch Info */}
      <div className="border-t p-4 space-y-1">
        <h2 className="text-sm font-semibold text-gray-900 truncate">
          {displayBranch?.name}
        </h2>
        <div className="flex items-start gap-1.5">
          <MapPin size={13} className="text-green-600 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 leading-4">
            {displayBranch?.address}
          </p>
        </div>

        <div className="pt-10">

          <Button className={"py-5 w-full"} onClick={handleLogout}>
            Logout
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;