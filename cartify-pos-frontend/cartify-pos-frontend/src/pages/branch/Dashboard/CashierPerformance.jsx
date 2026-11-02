import React from "react";
import { Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getDailySalesChart, getTopCashierByRevenue } from "@/Redux Toolkit/features/Branch Analytics/branchAnalyticsThunk";

const CashierPerformance = () => {

  const { branch } = useSelector((state) => state.branch);
  const {
    topCashiers = [],
    loading,
    error,
  } = useSelector((state) => state.branchAnalytics);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!branch?.id) return;

    dispatch(getTopCashierByRevenue({ branchId: branch.id }));
  }, [branch?.id, dispatch]);

  const cashierRows = Array.isArray(topCashiers)
    ? topCashiers
    : topCashiers?.data ?? topCashiers?.content ?? [];

  const data = cashierRows.map((item) => ({
    name: item.cashierName ?? item.name ?? item.cashier?.name ?? "Unknown cashier",
    sales: Number(item.totalRevenue ?? item.revenue ?? item.sales ?? 0),
  }));

  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const averageSales = data.length ? Math.round(totalSales / data.length) : 0;
  const bestCashier = data.reduce(
    (prev, current) => (prev.sales > current.sales ? prev : current),
    { name: "-", sales: 0 }
  );

  const chartConfig = {
  sales: {
    label: "Sales",
    color: "#16a34a",
  },
};
  console.log(data)
  return (
    <Card className="shadow-sm border rounded-xl">

      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Cashier Performance
        </CardTitle>
      </CardHeader>

      <CardContent>

        {/* Chart + Right Section */}

        <div className="grid grid-cols-12 gap-6 items-center">

          {/* Chart */}

          <div className="col-span-10">

            {data.length > 0 && (
              <ChartContainer config={chartConfig}>

              <ResponsiveContainer
                width="100%"
                height={380}
              >

                <BarChart
                  layout="vertical"
                  data={data}
                  margin={{
                    top: 5,
                    right: 40,
                    left: 10,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#E5E7EB"
                  />

                  <XAxis
                    type="number"
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fontSize: 14 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fontSize: 15 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <ChartTooltip
                    cursor={{
                      fill: "rgba(22,163,74,.08)",
                    }}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          `₹${Number(value).toLocaleString("en-IN")}`,
                          "Sales",
                        ]}
                      />
                    }
                  />

                  <Bar
                    dataKey="sales"
                    fill="#16a34a"
                    radius={[0, 8, 8, 0]}
                    barSize={32}
                  />

                </BarChart>

              </ResponsiveContainer>

              </ChartContainer>
            )}

            {loading && <p className="text-sm text-muted-foreground">Loading cashiers...</p>}
            {!loading && error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && !error && data.length === 0 && (
              <p className="text-sm text-muted-foreground">No cashier sales found.</p>
            )}

          </div>

          {/* Right Section */}

          <div className="col-span-2 flex flex-col items-center justify-center">

            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">

              <Users
                className="text-green-600"
                size={40}
              />

            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Top 5
            </h2>

            <p className="text-gray-500 text-lg">
              Cashiers
            </p>

          </div>

        </div>

        {/* Summary */}

      <div className="grid grid-cols-4 gap-4 mt-8 border-t pt-5">

  <div className="rounded-lg border p-5">
    <p className="text-sm text-gray-500">
      Total Sales
    </p>

    <h2 className="mt-2 text-2xl font-bold text-green-600">
      ₹{totalSales.toLocaleString("en-IN")}
    </h2>
  </div>

  <div className="rounded-lg border p-5">
    <p className="text-sm text-gray-500">
      Average Sales
    </p>

    <h2 className="mt-2 text-2xl font-bold">
      ₹{averageSales.toLocaleString("en-IN")}
    </h2>
  </div>

  <div className="rounded-lg border p-5">
    <p className="text-sm text-gray-500">
      Top Cashier
    </p>

    <h2 className="mt-2 text-2xl font-semibold">
      {bestCashier.name}
    </h2>
  </div>

  <div className="rounded-lg border p-5">
    <p className="text-sm text-gray-500">
      Highest Sales
    </p>

    <h2 className="mt-2 text-2xl font-bold text-green-600">
      ₹{bestCashier.sales.toLocaleString("en-IN")}
    </h2>
  </div>

</div>

      </CardContent>

    </Card>
  );
};

export default CashierPerformance;