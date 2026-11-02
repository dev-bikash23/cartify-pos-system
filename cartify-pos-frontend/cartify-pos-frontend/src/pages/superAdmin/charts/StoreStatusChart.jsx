import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreStatusDistribution } from "@/Redux Toolkit/features/Admin Dashboard/adminDashboardThunk";

const COLORS = { ACTIVE: "#15803d", PENDING: "#d97706", BLOCKED: "#dc2626" };

const StoreStatusChart = () => {
  const dispatch = useDispatch();
  const { statusDistribution, loading, error } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(getStoreStatusDistribution());
  }, [dispatch]);

  const data = Array.isArray(statusDistribution) ? statusDistribution : [];
  const total = data.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Store Status Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Current account approval status</p>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2">
          <div className="h-55">
            {loading && data.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">Loading store statuses...</p>
            ) : total === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">No store accounts found.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={48} outerRadius={82} paddingAngle={3}>
                    {data.map((item) => <Cell key={item.status} fill={COLORS[item.status] || "#64748b"} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.status} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[item.status] || "#64748b" }} />
                  {item.status}
                </span>
                <strong>{item.count}</strong>
              </div>
            ))}
            <div className="flex justify-between border-t pt-3 text-sm"><span>Total stores</span><strong>{total}</strong></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreStatusChart;