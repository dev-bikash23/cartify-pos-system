import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";
import { getMonthlySales } from "@/Redux Toolkit/features/Store Analytics/storeAnalyticsThunk";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#16a34a",
  },
};

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

// ⚠️ Verify this matches where the current store's id actually lives
// in your Redux state (same pattern used in DashboardState.jsx).
const SalesTrend = () => {
  const dispatch = useDispatch();

  const storeId = useSelector((state) => state.store?.store?.id);
  const { monthlySales, loading } = useSelector((state) => state.storeAnalytics);

  useEffect(() => {
    if (storeId) {
      dispatch(getMonthlySales(storeId));
    }
  }, [dispatch, storeId]);

  const chartData = monthlySales || [];

  const { totalSales, highest, average, growth } = useMemo(() => {
    if (!chartData.length) {
      return { totalSales: 0, highest: 0, average: 0, growth: 0 };
    }

    const values = chartData.map((d) => d.sales || 0);
    const total = values.reduce((sum, v) => sum + v, 0);
    const max = Math.max(...values);
    const avg = total / values.length;

    // Growth: first vs last month in the 12-month window shown.
    const first = values[0];
    const last = values[values.length - 1];
    const growthPct = first > 0 ? ((last - first) / first) * 100 : 0;

    return { totalSales: total, highest: max, average: avg, growth: growthPct };
  }, [chartData]);

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm h-full">

      <CardHeader className="flex flex-row items-center justify-between pb-3">

        <div>
          <CardTitle className="text-lg font-semibold">
            Sales Trend
          </CardTitle>

          <p className="text-sm text-gray-500 mt-1">
            Monthly sales performance
          </p>
        </div>

        <div className="text-right">

          <p className="text-xs text-gray-500">
            Total Sales
          </p>

          <h2 className="text-xl font-bold text-green-600">
            {formatCurrency(totalSales)}
          </h2>

        </div>

      </CardHeader>

      <CardContent className="pt-0">

        <div className="h-[320px]">

          {loading && !monthlySales && (
            <p className="text-sm text-muted-foreground">Loading sales trend...</p>
          )}

          {!loading && chartData.length > 0 && (
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
            >

              <ResponsiveContainer width="100%" height="100%">

                <LineChart
                  data={chartData}
                  margin={{
                    top: 15,
                    right: 20,
                    left: 5,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />

                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#16a34a",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </ChartContainer>
          )}

        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 border-t pt-4">

          <div className="text-center">

            <p className="text-xs text-gray-500">
              Highest
            </p>

            <h3 className="text-lg font-bold text-green-600">
              {formatCurrency(highest)}
            </h3>

          </div>

          <div className="text-center">

            <p className="text-xs text-gray-500">
              Average
            </p>

            <h3 className="text-lg font-bold">
              {formatCurrency(average)}
            </h3>

          </div>

          <div className="text-center">

            <p className="text-xs text-gray-500">
              Growth
            </p>

            <h3 className={`text-lg font-bold ${growth >= 0 ? "text-green-600" : "text-red-500"}`}>
              {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
            </h3>

          </div>

        </div>

      </CardContent>

    </Card>
  );
};

export default SalesTrend;