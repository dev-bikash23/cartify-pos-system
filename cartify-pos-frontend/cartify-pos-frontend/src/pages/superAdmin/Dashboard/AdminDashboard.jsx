import React from "react";
import AdminDashboardOverview from "./AdminDashboardOverview";
import StoreRegistrationChart from "../charts/StoreRegistrationChart";
import StoreStatusChart from "../charts/StoreStatusChart";

const AdminDashboard = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bold text-2xl">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Overview of all stores and system statistics
        </p>
      </div>

      <AdminDashboardOverview />

      <div className="grid gap-4 lg:grid-cols-2">
        <StoreRegistrationChart />
        <StoreStatusChart />
      </div>
    </div>
  );
};

export default AdminDashboard;