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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
];

const data = [
  {
    name: "Card",
    value: 52,
    percentage: 50,
    revenue: 42600,
  },
  {
    name: "UPI",
    value: 34,
    percentage: 33,
    revenue: 20400,
  },
  {
    name: "Cash",
    value: 18,
    percentage: 17,
    revenue: 14500,
  },
];

const chartConfig = data.reduce((acc, item, index) => {
  acc[item.name] = {
    label: item.name,
    color: COLORS[index],
  };
  return acc;
}, {});

const PaymentMethodChart = () => {
  const totalRevenue = data.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const totalTransactions = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const topMethod = data.reduce((a, b) =>
    a.revenue > b.revenue ? a : b
  );

  return (
    <Card className="shadow-sm border rounded-xl">

      <CardHeader className="pb-2 border-b">

        <CardTitle className="text-xl font-semibold">
          Payment Method Analysis
        </CardTitle>

      </CardHeader>

      <CardContent className="p-6">

        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Side */}

          <div className="h-[280px]">

            <ChartContainer config={chartConfig}>

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>

                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          `${value} Transactions`,
                          "",
                        ]}
                      />
                    }
                  />

                </PieChart>

              </ResponsiveContainer>

            </ChartContainer>

          </div>

          {/* Right Side */}

          <div className="space-y-4">

            {data.map((item, index) => (

              <div
                key={item.name}
                className="flex justify-between items-center border rounded-lg p-4 hover:bg-muted/30 transition"
              >

                <div className="flex items-center gap-3">

                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: COLORS[index],
                    }}
                  />

                  <div>

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {item.value} Transactions
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <h3 className="font-bold text-green-600">
                    ₹{item.revenue.toLocaleString()}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.percentage}%
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Bottom Summary */}

        <div className="grid md:grid-cols-3 gap-4 mt-8">

          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Total Revenue
            </p>

            <h2 className="text-2xl font-bold text-green-600 mt-1">
              ₹{totalRevenue.toLocaleString()}
            </h2>

          </div>

          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Total Transactions
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {totalTransactions}
            </h2>

          </div>

          <div className="rounded-lg border p-4">

            <p className="text-sm text-muted-foreground">
              Most Used Method
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {topMethod.name}
            </h2>

          </div>

        </div>

      </CardContent>

    </Card>
  );
};

export default PaymentMethodChart;