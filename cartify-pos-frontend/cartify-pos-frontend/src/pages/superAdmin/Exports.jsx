import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllStores } from "@/Redux Toolkit/features/Store/storeThunk";
import { getStoreRegistrations, getStoreStatusDistribution, getSuperAdminDashboardOverview } from "@/Redux Toolkit/features/Admin Dashboard/adminDashboardThunk";

const csvValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const Exports = () => {
  const dispatch = useDispatch();
  const { stores, loading: storesLoading, error: storesError } = useSelector((state) => state.store);
  const { overview, registrations, statusDistribution, error: dashboardError } = useSelector((state) => state.adminDashboard);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshError, setRefreshError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setRefreshError("");
    try {
      const results = await Promise.all([
        dispatch(getAllStores()).unwrap(),
        dispatch(getSuperAdminDashboardOverview()).unwrap(),
        dispatch(getStoreRegistrations(30)).unwrap(),
        dispatch(getStoreStatusDistribution()).unwrap(),
      ]);
      if (results) setLastUpdated(new Date());
    } catch (error) {
      setRefreshError(error || "Some export data could not be refreshed.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => { loadData(); }, [loadData]);

  const download = (name, headers, rows) => {
    const csv = [headers, ...rows].map((row) => row.map(csvValue).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportStores = () => download("cartify-stores.csv",
    ["ID", "Store", "Type", "Status", "Address", "Phone", "Email"],
    stores.map((store) => [store.id, store.brand, store.storeType, store.status, store.contact?.address, store.contact?.phone, store.contact?.email]));

  const exportDashboard = () => download("cartify-dashboard.csv",
    ["Metric", "Value"],
    [["Total stores", overview?.totalStore], ["Pending stores", overview?.pendingStore], ["Active stores", overview?.activeStore], ["Blocked stores", overview?.blockedStore]]);

  const exportRegistrations = () => download("cartify-store-registrations.csv",
    ["Date", "Day", "New stores"], registrations.map((item) => [item.date, item.day, item.count]));

  const exportStatus = () => download("cartify-store-status.csv",
    ["Status", "Stores"], statusDistribution.map((item) => [item.status, item.count]));

  const exportFullReport = () => {
    const report = { exportedAt: new Date().toISOString(), overview, stores, registrations, statusDistribution };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "cartify-admin-report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const error = refreshError || storesError || dashboardError;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Exports</h1><p className="text-sm text-muted-foreground">Download current records from the Cartify database.</p></div>
        <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Not refreshed yet"}</span><Button variant="outline" onClick={loadData} disabled={loading || storesLoading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{loading ? "Refreshing..." : "Refresh data"}</Button></div>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Store records</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">{stores.length} live store records loaded.</p><Button onClick={exportStores} disabled={!stores.length}><Download className="mr-2 h-4 w-4" />Export stores CSV</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Dashboard summary</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">Overview, registrations ({registrations.length}), and status data are loaded from the API.</p><Button onClick={exportDashboard} disabled={!overview}><Download className="mr-2 h-4 w-4" />Export summary CSV</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Registration history</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">Daily store registrations for the last 30 days.</p><Button onClick={exportRegistrations} disabled={!registrations.length}><Download className="mr-2 h-4 w-4" />Export registrations</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Complete report</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">Download overview, stores, registrations, and status data together.</p><Button onClick={exportFullReport} disabled={!overview && !stores.length}><Download className="mr-2 h-4 w-4" />Export JSON report</Button></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Store status data</CardTitle></CardHeader><CardContent><div className="mb-4 grid gap-3 sm:grid-cols-3">{statusDistribution.map((item) => <div key={item.status} className="rounded-lg border p-3"><p className="text-sm text-muted-foreground">{item.status}</p><p className="text-xl font-semibold">{item.count}</p></div>)}</div><Button variant="outline" onClick={exportStatus} disabled={!statusDistribution.length}><Download className="mr-2 h-4 w-4" />Export status CSV</Button></CardContent></Card>
    </div>
  );
};

export default Exports;
