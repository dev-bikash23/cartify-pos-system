import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, BellRing, PackageCheck, PackageX, RefreshCw, Volume2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";
import { getStoreAlerts, getStoreAlertSales } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const StoreAlerts = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store.store);
  const { loading, error } = useSelector((state) => state.storeAnalytics);
  const storeAlerts = useSelector((state) => state.storeAnalytics?.storeAlerts || []);
  const [sales, setSales] = useState([]);
  const soundPlayed = useRef(false);

  const playUrgentSound = () => {
    if (soundPlayed.current) return;
    soundPlayed.current = true;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 740;
      gain.gain.setValueAtTime(0.06, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.35);
    } catch {
      // Browsers may block sound until the user interacts with the page.
    }
  };

  const loadAlerts = async () => {
    const result = store?.id
      ? { payload: store, type: "store/existing" }
      : await dispatch(getStoreByAdmin());
    const storeId = result.payload?.id;
    if (storeId) {
      const [alertsResult, salesResult] = await Promise.all([
        dispatch(getStoreAlerts(storeId)),
        dispatch(getStoreAlertSales(storeId)),
      ]);
      if (getStoreAlertSales.fulfilled.match(salesResult)) setSales(salesResult.payload);
      if (getStoreAlerts.fulfilled.match(alertsResult) && alertsResult.payload.some((item) => item.severity === "CRITICAL")) {
        playUrgentSound();
      }
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [store?.id]);

  const critical = storeAlerts.filter((item) => item.severity === "CRITICAL").length;
  const warnings = storeAlerts.filter((item) => item.severity === "WARNING").length;
  const overstock = storeAlerts.filter((item) => item.status === "OVERSTOCK").length;
  const healthy = storeAlerts.filter((item) => item.status === "HEALTHY").length;
  const actionable = storeAlerts.filter((item) => item.status !== "HEALTHY");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BellRing className="text-green-600" /> Alerts
          </h1>
          <p className="mt-1 text-sm text-gray-500">Stock health, recent sales, and replenishment guidance.</p>
        </div>
        <Button variant="outline" onClick={loadAlerts} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Critical", critical, "bg-red-50 text-red-700"],
          ["Low stock", warnings, "bg-amber-50 text-amber-700"],
          ["High stock", overstock, "bg-blue-50 text-blue-700"],
          ["Healthy", healthy, "bg-green-50 text-green-700"],
        ].map(([label, value, style]) => (
          <Card key={label}><CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-2xl font-bold ${style}`}>{value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Sales trend</h2>
              <p className="text-sm text-gray-500">Units sold across the last 7 days</p>
            </div>
            <Volume2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Line type="monotone" dataKey="units" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4">
            <h2 className="font-semibold">Stock overview</h2>
            <p className="text-sm text-gray-500">Every product and its current stock position</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {storeAlerts.map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.productName}</p>
                  <p className="text-xs text-gray-500">Stock {item.quantity} · Safe {item.safeStock}</p>
                </div>
                <span className={`ml-3 shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                  item.status === "OUT_OF_STOCK" ? "bg-red-100 text-red-700" :
                  item.status === "LOW_STOCK" ? "bg-amber-100 text-amber-700" :
                  item.status === "OVERSTOCK" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {actionable.length === 0 && !loading ? (
        <Card><CardContent className="flex min-h-52 flex-col items-center justify-center gap-3 text-center">
          <PackageCheck className="h-10 w-10 text-green-600" />
          <h2 className="font-semibold">Everything looks good</h2>
          <p className="text-sm text-gray-500">Stock levels are within the safe range.</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {actionable.map((alert) => (
            <Card key={alert.productId} className={alert.severity === "CRITICAL" ? "border-red-200" : alert.status === "OVERSTOCK" ? "border-blue-200" : "border-amber-200"}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className={`rounded-full p-3 ${alert.severity === "CRITICAL" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{alert.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                  <p className="mt-2 text-xs text-gray-500">SKU: {alert.sku} · Stock: {alert.quantity} · Safe: {alert.safeStock}</p>
                  <p className="mt-1 text-xs text-gray-500">Sold last 7 days: {alert.soldLast7Days} · Reorder: {alert.reorderQuantity} units{alert.daysOfCover == null ? "" : ` · Cover: ${alert.daysOfCover} days`}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreAlerts;