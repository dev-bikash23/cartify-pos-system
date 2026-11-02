import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTopProductsByQuantity } from "@/Redux Toolkit/features/Branch Analytics/branchAnalyticsThunk";
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
} from "recharts";

const COLORS = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#86efac",
];

const TopProducts = () => {
  const dispatch = useDispatch();
  const branch = useSelector((state) => state.branch.branch);
  const { topProducts = [], loading, error } = useSelector((state) => state.branchAnalytics);

  useEffect(() => {
    if (branch?.id) dispatch(getTopProductsByQuantity({ branchId: branch.id }));
  }, [branch?.id, dispatch]);

  const products = (Array.isArray(topProducts)
    ? topProducts
    : topProducts?.data ?? topProducts?.content ?? []
  ).map((item) => ({
    name: item.productName ?? item.name ?? item.product?.name ?? "Unknown product",
    value: Number(
      item.quantity ?? item.quantitySold ?? item.totalQuantity ?? item.count ?? 0
    ),
    revenue: Number(item.revenue ?? item.totalRevenue ?? item.sales ?? 0),
  }));
  const totalQuantity = products.reduce((sum, item) => sum + item.value, 0);
  const data = products.map((item) => ({
    ...item,
    percentage: totalQuantity ? Math.round((item.value / totalQuantity) * 100) : 0,
  }));
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {});
  const totalRevenue = data.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const bestSeller = data.reduce(
    (best, item) => (item.value > (best?.value ?? 0) ? item : best),
    null
  );

 return (
  <Card className="shadow-sm border">
    <CardHeader className="pb-3">
      <CardTitle className="text-xl font-semibold">
        Product Performance
      </CardTitle>
    </CardHeader>

    <CardContent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

        {/* Pie Chart */}

        {data.length > 0 && (
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={45}
                paddingAngle={3}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `${value} Sold`,
                      "Products",
                    ]}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        )}

        {loading && <p className="text-sm text-muted-foreground">Loading products...</p>}
        {!loading && error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && data.length === 0 && (
          <p className="text-sm text-muted-foreground">No product sales found.</p>
        )}

        {/* Product Details */}

        <div className="space-y-4">

          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">

                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />

                <div>
                  <h4 className="font-semibold">
                    {item.name}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {item.value} Sold
                  </p>
                </div>

              </div>

              <div className="text-right">

                <p className="font-semibold text-green-600">
                  ₹{item.revenue.toLocaleString()}
                </p>

                <p className="text-sm text-muted-foreground">
                  {item.percentage}%
                </p>

              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">

            <div>
              <p className="text-sm text-muted-foreground">
                Total Revenue
              </p>

              <h2 className="text-2xl font-bold text-green-600">
                ₹{totalRevenue.toLocaleString()}
              </h2>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Best Seller
              </p>

              <h2 className="text-2xl font-bold">
                {bestSeller?.name ?? "-"}
              </h2>
            </div>

          </div>

        </div>

      </div>

    </CardContent>
  </Card>
);
};

export default TopProducts;