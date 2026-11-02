import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store, ArrowUpRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentSales } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";

const formatRelativeDate = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Today • ${time}`;
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString();
};

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

// Status → badge color. Adjust these string matches once you confirm
// your real OrderStatus enum values (e.g. COMPLETED, PENDING, CANCELLED).
const statusBadgeClass = (status) => {
  const s = (status || "").toUpperCase();
  if (s.includes("COMPLETE") || s.includes("DELIVERED") || s.includes("PAID")) {
    return "bg-green-100 text-green-600";
  }
  if (s.includes("PENDING") || s.includes("PROCESSING")) {
    return "bg-yellow-100 text-yellow-700";
  }
  if (s.includes("CANCEL") || s.includes("FAILED")) {
    return "bg-red-100 text-red-600";
  }
  return "bg-gray-100 text-gray-600";
};

// ⚠️ Verify this matches where the current store's id actually lives
// in your Redux state (same pattern used in DashboardState.jsx).
const RecentSales = () => {
  const dispatch = useDispatch();

  const storeId = useSelector((state) => state.store?.store?.id);
  const { recentSales, loading } = useSelector((state) => state.storeAnalytics);

  useEffect(() => {
    if (storeId) {
      dispatch(getRecentSales(storeId));
    }
  }, [dispatch, storeId]);

  const orders = recentSales?.recentOrders || [];

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm h-full">

      <CardHeader className="flex flex-row items-center justify-between pb-3">

        <CardTitle className="text-lg font-semibold">
          Recent Sales
        </CardTitle>

        <ArrowUpRight className="w-5 h-5 text-gray-400" />

      </CardHeader>

      <CardContent className="pt-0">

        {loading && !recentSales && (
          <p className="text-sm text-muted-foreground py-4">Loading recent sales...</p>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No recent sales yet.</p>
        )}

        <div className="space-y-3">

          {orders.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-3 hover:bg-gray-50 transition"
            >

              {/* Left */}

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">

                  <Store className="h-5 w-5 text-green-600" />

                </div>

                <div>

                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.branchName}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {formatRelativeDate(item.createdAt)}
                  </p>

                </div>

              </div>

              {/* Right */}

              <div className="text-right">

                <p className="text-base font-bold text-gray-900">
                  {formatCurrency(item.totalAmount)}
                </p>

                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(item.status)}`}>
                  {item.status || "Unknown"}
                </span>

              </div>

            </div>
          ))}

        </div>

        {/* Footer */}

        <div className="mt-5 border-t pt-4 flex items-center justify-between">

          <div>

            <p className="text-xs text-gray-500">
              Last 7 Days Revenue
            </p>

            <h2 className="text-xl font-bold text-gray-900">
              {formatCurrency(recentSales?.todaysRevenue)}
            </h2>

          </div>

          <div className="text-right">

            <p className="text-xs text-gray-500">
              Transactions
            </p>

            <h2 className="text-xl font-bold text-green-600">
              {recentSales?.todaysTransactions ?? 0}
            </h2>

          </div>

        </div>

      </CardContent>

    </Card>
  );
};

export default RecentSales;