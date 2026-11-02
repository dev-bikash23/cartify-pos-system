import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Store,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getStoreOverview } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";

const DashboardState = () => {
  const dispatch = useDispatch();

  const { storeOverview } = useSelector((state) => state.storeAnalytics);

  // ⚠️ Verify this matches where the current store's id actually lives
  // in your Redux state (e.g. state.store?.store?.id), similar to how
  // branchId was sourced from state.branch?.branch?.id earlier.
  const storeId = useSelector((state) => state.store?.store?.id);

  useEffect(() => {
    if (storeId) {
      dispatch(getStoreOverview(storeId));
    }
  }, [dispatch, storeId]);

  const stats = [
    {
      title: "Total Sales",
      value: storeOverview?.totalSales || 0,
      icon: DollarSign,
      change: 12.5,
    },
    {
      title: "Total Branches",
      value: storeOverview?.totalBranches || 0,
      icon: Store,
      change: -4.0,
    },
    {
      title: "Total Products",
      value: storeOverview?.totalProducts || 0,
      icon: ShoppingCart,
      change: 8.7,
    },
    {
      title: "Total Employees",
      value: storeOverview?.totalEmployees || 0,
      icon: Users,
      change: 5.2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        const positive = item.change >= 0;

        return (
          <Card
            key={index}
            className="rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-200"
          >
            <CardContent className="p-4">

              <div className="flex items-center justify-between">

                {/* Left */}
                <div className="flex-1">

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    {item.value}
                  </h2>

                  <div
                    className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                      positive
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}

                    {Math.abs(item.change)}%

                    <span className="ml-1 text-gray-500">
                      vs last month
                    </span>

                  </div>

                </div>

                {/* Right Icon */}

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">

                  <Icon className="h-6 w-6 text-green-600" />

                </div>

              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardState;