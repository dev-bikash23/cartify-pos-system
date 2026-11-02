import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import CashierRoutes from "./routes/CashierRoutes";
import BranchLayout from "./pages/branch/BranchLayout/BranchLayout";
import BranchRoutes from "./routes/BranchRoutes";
import StoreDashboardLayout from "./pages/store/Dashboard/StoreDashboardLayout";
import StoreRoutes from "./routes/StoreRoutes";
import AdminLayout from "./pages/superAdmin/AdminLayout";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Auth/Login";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUserProfile } from "./Redux Toolkit/features/User/userThunk";
import { useSelector } from "react-redux";
import { applyGlobalTheme } from "./components/ThemeSelector";

function App() {
   const dispatch = useDispatch();
   const { userProfile, profileLoading } = useSelector((state) => state.user);

   useEffect(() => {
    try {
      const globalSettings = JSON.parse(localStorage.getItem("cartify-global-settings") || "null");
      const legacySettings = JSON.parse(localStorage.getItem("cartify-store-settings") || "null");
      applyGlobalTheme(globalSettings?.theme || legacySettings?.theme || "light");
    } catch {
      applyGlobalTheme("light");
    }

    const handleSettingsUpdate = (event) => {
      applyGlobalTheme(event.detail?.theme || "light");
    };

    window.addEventListener("cartify-settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("cartify-settings-updated", handleSettingsUpdate);
   }, []);

   useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      dispatch(getUserProfile(token));
    }
  }, [dispatch]);

  if (profileLoading) {
    return null;
  }

  let content;

  if (userProfile?.role === "ROLE_BRANCH_CASHIER") {
     content = <Routes>
      <Route path="/*" element={<Navigate to="/cashier" />} />
      <Route path="/cashier/*" element={<CashierRoutes />} />
    </Routes>
  } else if (userProfile?.role === "ROLE_BRANCH_MANAGER" || userProfile?.role === "ROLE_BRANCH_ADMIN") {
    content = <Routes>
      <Route path="/*" element={<Navigate to="/branch" />} />
      <Route path="/branch/*" element={<BranchRoutes />} />
    </Routes>
  } else if (userProfile?.role === "ROLE_STORE_MANAGER" || userProfile?.role === "ROLE_STORE_ADMIN") {
    content = <Routes>
      <Route path="/*" element={<Navigate to="/store" />} />
      <Route path="/store/*" element={<StoreRoutes />} />
    </Routes>
  } else if (userProfile?.role === "ROLE_ADMIN") {
    content = <Routes>
      <Route path="/*" element={<Navigate to="/super-admin" />} />
      <Route path="/super-admin/*" element={<AdminRoutes />} />
    </Routes>
  } else {
    content = <Routes>
      <Route path="*" element={<Login />} />
    </Routes>
  }
  return (
    <>
    {/* // <Routes>
    //   <Route path="/" element={<Navigate to="/login" replace />} />

    //   <Route path="/login" element={<Login />} />

    //   <Route path="/cashier/*" element={<CashierRoutes />} />
    //   <Route path="/branch/*" element={<BranchRoutes />} />
    //   <Route path="/store/*" element={<StoreRoutes />} />
    //   <Route path="/super-admin/*" element={<AdminRoutes />} />
    // </Routes> */}
    {content}
    </>
  );
}

export default App;