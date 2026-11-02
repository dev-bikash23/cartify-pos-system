import React, { useEffect, useState } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";
import { getMonthlySales, getRecentSales, getStoreOverview } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const StoreReports = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store.store);
  const { storeOverview, recentSales, monthlySales, loading, error } = useSelector((state) => state.storeAnalytics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadReport = async () => {
    setIsRefreshing(true);
    try {
      const result = await dispatch(getStoreByAdmin());
      const storeId = result.payload?.id || store?.id;
      if (!storeId) return;
      await Promise.all([
        dispatch(getStoreOverview(storeId)).unwrap(),
        dispatch(getRecentSales(storeId)).unwrap(),
        dispatch(getMonthlySales(storeId)).unwrap(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => { loadReport(); }, [store?.id]);

  const downloadReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total revenue", storeOverview?.totalSales || 0],
      ["Last 7 days revenue", recentSales?.todaysRevenue || 0],
      ["Last 7 days transactions", recentSales?.todaysTransactions || 0],
      ...((monthlySales || []).map((month) => [`Revenue ${month.month}`, month.sales || 0])),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `cartify-sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-4"><div><h1 className="flex items-center gap-2 text-3xl font-bold"><FileText className="text-green-600" /> Reports</h1><p className="mt-1 text-sm text-gray-500">Current store performance report from POS data.</p></div><div className="flex gap-2"><Button variant="outline" onClick={loadReport} disabled={loading || isRefreshing}><RefreshCw className="mr-2 h-4 w-4" />{isRefreshing ? "Refreshing..." : "Refresh"}</Button><Button onClick={downloadReport}><Download className="mr-2 h-4 w-4" />CSV</Button></div></div>
    {error && <p className="text-sm text-red-600">{error}</p>}
    <Card><CardContent className="p-5"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs text-gray-500">Total revenue</p><p className="mt-1 text-2xl font-bold text-green-700">{money(storeOverview?.totalSales)}</p></div><div><p className="text-xs text-gray-500">Last 7 days</p><p className="mt-1 text-2xl font-bold">{money(recentSales?.todaysRevenue)}</p></div><div><p className="text-xs text-gray-500">Transactions</p><p className="mt-1 text-2xl font-bold">{recentSales?.todaysTransactions || 0}</p></div><div><p className="text-xs text-gray-500">Branches</p><p className="mt-1 text-2xl font-bold">{storeOverview?.totalBranches || 0}</p></div></div></CardContent></Card>
    <Card><CardContent className="p-5"><h2 className="mb-4 font-semibold">Monthly report</h2><div className="divide-y">{(monthlySales || []).map((month) => <div key={month.month} className="flex justify-between py-3"><span>{month.month}</span><span className="font-semibold">{money(month.sales)}</span></div>)}</div></CardContent></Card>
  </div>;
};

export default StoreReports;