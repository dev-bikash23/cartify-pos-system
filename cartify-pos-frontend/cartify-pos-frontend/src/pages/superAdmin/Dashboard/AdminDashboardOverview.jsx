import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSuperAdminDashboardOverview } from "@/Redux Toolkit/features/Admin Dashboard/adminDashboardThunk";
import { Store, Clock, CheckCircle, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboardOverview = () => {
  const dispatch = useDispatch();
  const { overview, loading, error } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(getSuperAdminDashboardOverview());
  }, [dispatch]);

  const kpis = [
        {
          title: "Total Store  ",
          value: overview?.totalStore?.toLocaleString() ?? (loading ? "…" : "0"),
          icon: Store,
          description: "from last month",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50",
        },
        {
          title: "Pending Store",
          value: overview?.pendingStore ?? (loading ? "…" : "0"),
          icon: Clock,
          description: "awaiting approval",
          iconColor: "text-amber-600",
          iconBg: "bg-amber-50",
        },
        {
          title: "Active Store",
          value: overview?.activeStore ?? (loading ? "…" : "0"),
          icon: CheckCircle,
          description: "currently operational",
          iconColor: "text-green-600",
          iconBg: "bg-green-50",
        },
        {
          title: "Blocked Store",
          value: overview?.blockedStore ?? (loading ? "…" : "0"),
          icon: Ban,
          description: "suspended account",
          iconColor: "text-red-600",
          iconBg: "bg-red-50",
        },
      ];

  return (
    <div>
    {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.title}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-l font-semibold text-gray-900">
                    {kpi.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">
                    {kpi.value}
                  </h3>
                  <p className="text-s text-muted-foreground mt-1">
                    {kpi.description}
                  </p>
                </div>

                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${kpi.iconBg}`}
                >
                  <Icon className={`h-4.5 w-4.5 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
    </div>
  );
};

export default AdminDashboardOverview;