import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreRegistrations } from "@/Redux Toolkit/features/Admin Dashboard/adminDashboardThunk";

const StoreRegistrationChart = () => {
  const dispatch = useDispatch();
  const { registrations, loading, error } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(getStoreRegistrations(7));
  }, [dispatch]);

  const data = Array.isArray(registrations) ? registrations : [];
  const total = data.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const average = data.length ? total / data.length : 0;
  const peak = data.reduce((best, item) => Number(item.count) > Number(best?.count || 0) ? item : best, null);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Store Registrations</CardTitle>
        <p className="text-sm text-muted-foreground">New store accounts over the last 7 days</p>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}
        <div className="h-65">
          {loading && data.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">Loading registrations...</p>
          ) : data.every((item) => Number(item.count) === 0) ? (
            <p className="py-8 text-sm text-muted-foreground">No stores registered in this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} width={36} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [value, "Stores"]} />
                <Bar dataKey="count" name="Stores" fill="#16a34a" radius={[5, 5, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4 text-sm">
          <div><p className="text-muted-foreground">Total</p><strong>{total}</strong></div>
          <div><p className="text-muted-foreground">Daily average</p><strong>{average.toFixed(1)}</strong></div>
          <div><p className="text-muted-foreground">Peak day</p><strong>{peak?.day || "—"}</strong></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreRegistrationChart;