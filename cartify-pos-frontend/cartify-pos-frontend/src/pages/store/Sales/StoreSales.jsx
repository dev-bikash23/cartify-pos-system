import React, { useEffect } from "react";
import { BarChart3, RefreshCw, ShoppingBag, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";
import { getMonthlySales, getRecentSales, getStoreOverview } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const StoreSales = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store.store);
  const { storeOverview, recentSales, monthlySales, loading, error } = useSelector((state) => state.storeAnalytics);

  const loadSales = async () => {
    const result = store?.id ? { payload: store } : await dispatch(getStoreByAdmin());
    const storeId = result.payload?.id;
    if (!storeId) return;
    await Promise.all([
      dispatch(getStoreOverview(storeId)),
      dispatch(getRecentSales(storeId)),
      dispatch(getMonthlySales(storeId)),
    ]);
  };

  useEffect(() => { loadSales(); }, [store?.id]);

  const recentOrders = recentSales?.recentOrders || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><BarChart3 className="text-green-600" /> Sales</h1>
          <p className="mt-1 text-sm text-gray-500">Live sales performance from completed POS orders.</p>
        </div>
        <Button variant="outline" onClick={loadSales} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />{loading ? "Loading..." : "Refresh"}</Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total revenue", money(storeOverview?.totalSales), "text-green-700"],
          ["Last 7 days", money(recentSales?.todaysRevenue), "text-blue-700"],
          ["Transactions", recentSales?.todaysTransactions || 0, "text-purple-700"],
          ["Products sold", storeOverview?.totalProducts || 0, "text-amber-700"],
        ].map(([label, value, color]) => <Card key={label}><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>)}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4"><h2 className="font-semibold">Monthly revenue</h2><p className="text-sm text-gray-500">Real completed-order totals for the last 12 months</p></div>
          <div className="h-80 min-w-0"><ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}><BarChart data={monthlySales || []}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis tickFormatter={(value) => `₹${value}`} /><Tooltip formatter={(value) => money(value)} /><Bar dataKey="sales" fill="#16a34a" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-green-600" /><h2 className="font-semibold">Recent transactions</h2></div>
          {recentOrders.length === 0 ? <p className="text-sm text-gray-500">No completed transactions yet.</p> : <div className="space-y-2">{recentOrders.map((order) => <div key={order.id} className="flex items-center justify-between rounded-lg border p-3"><div><p className="font-medium">Order #{order.id}</p><p className="text-xs text-gray-500">{order.branchName} · {order.status || "Unknown"}</p></div><p className="font-semibold text-green-700">{money(order.totalAmount)}</p></div>)}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreSales;