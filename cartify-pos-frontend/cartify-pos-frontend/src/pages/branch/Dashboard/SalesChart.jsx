import React from "react";
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
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from "react";
import { getDailySalesChart } from "@/Redux Toolkit/features/Branch Analytics/branchAnalyticsThunk";


const chartConfig = {
  sales: {
    label: "Sales",
    color: "#16a34a",
  },
};

const SalesChart = () => {
  const { branch: fetchedBranch } = useSelector((state) => state.branch);
  const branch = fetchedBranch;
  const analytics=useSelector(state=>state.branchAnalytics)
  const dispatch = useDispatch();

  useEffect(() => {
    if (branch?.id) dispatch(getDailySalesChart({ branchId: branch.id }));
  }, [branch?.id, dispatch]);

  const data=analytics?.dailySales?.map((item)=> ({
    day: new Date(item.date).toLocaleDateString("en-IN", { weekday: "short" }),
    sales:Number(item.totalSales ?? 0),
  })) || []
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const averageSales = data.length ? Math.round(totalSales / data.length) : 0;
  const bestDay = data.reduce((best, current) => current.sales > (best?.sales ?? 0) ? current : best, null);
  return (
    <Card className="shadow-sm border">

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Sales Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">

        <ChartContainer config={chartConfig}>

          <ResponsiveContainer
            width="100%"
            height={330}
          >

            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 30,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280" }}
                padding={{
                  left: 20,
                  right: 20,
                }}
              />

              <YAxis
                width={65}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => `₹${value}`}
              />

              <ChartTooltip
                cursor={{ fill: "rgba(22,163,74,0.08)" }}
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
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartContainer>

        {/* Summary */}

        <div className="mt-6 border-t pt-5 grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-muted-foreground">
              Total Sales
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              ₹{totalSales.toLocaleString("en-IN")}
            </h2>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Average / Day
            </p>

            <h2 className="text-3xl font-bold">
              ₹                 {averageSales.toLocaleString("en-IN")}
            </h2>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Best Day
            </p>

            <h3 className="text-2xl font-semibold">
              {bestDay?.day ?? "-"}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Weekly Growth
            </p>

            <h3 className="text-2xl font-bold text-green-600">
              -
            </h3>
          </div>

        </div>

      </CardContent>

    </Card>
  );
};

export default SalesChart;