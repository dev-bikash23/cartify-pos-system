import React from "react";
import {
  CalendarDays,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getRecentOrdersByBranch } from "@/Redux Toolkit/features/Order/orderThunk";

const RecentOrders = ({ handleViewOrderDetails }) => {
  const {
    recentOrders = [],
    loading,
    error,
  } = useSelector((state) => state.order);
  const { branch } = useSelector((state) => state.branch);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!branch?.id) return;
    dispatch(getRecentOrdersByBranch(branch.id));
  }, [branch?.id, dispatch]);

  const orders = Array.isArray(recentOrders)
    ? recentOrders
    : recentOrders?.data ?? recentOrders?.content ?? [];

  const displayOrders = orders.map((order) => ({
    ...order,
    customer: order.customer?.fullName ?? order.customer?.name ?? order.customer ?? "Walk-in customer",
    date: order.date ?? order.createdAt ?? "-",
    payment: order.payment ?? order.paymentType ?? "-",
    items: Array.isArray(order.items) ? order.items.length : Number(order.items ?? 0),
    amount: Number(order.amount ?? order.totalAmount ?? 0),
    statusText: String(order.status ?? "PENDING").toLowerCase(),
  }));

  return (
    <Card className="shadow-sm border rounded-xl">

      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          Recent Orders
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {loading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
        {!loading && error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent orders found.</p>
        )}

        {displayOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => handleViewOrderDetails?.(order)}
            className="cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:border-green-500 hover:bg-green-50"
          >
            <div className="flex items-start justify-between">

              {/* Left */}

              <div className="space-y-3">

                <div className="flex items-center gap-3">

                  <h3 className="font-semibold text-base">
                    ORD-{order.id}
                  </h3>

                  <Badge
                    className={
                      order.statusText === "completed" || order.statusText === "success"
                        ? "bg-green-600 hover:bg-green-600 text-white"
                        : order.statusText === "pending"
                          ? "bg-yellow-500 hover:bg-yellow-500 text-white"
                          : "bg-slate-600 hover:bg-slate-600 text-white"
                    }
                  >
                    {order.status ?? "PENDING"}
                  </Badge>

                </div>

                <p className="font-medium text-gray-900">
                  {order.customer}
                </p>

                <div className="flex flex-wrap gap-5 text-sm text-gray-500">

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {order.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    {order.payment}
                  </div>

                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} />
                    {order.items} Items
                  </div>

                </div>

              </div>

              {/* Right */}

              <div className="text-right">

                <p className="text-xs text-gray-500">
                  Total Amount
                </p>

                <h2 className="mt-1 text-2xl font-bold text-green-600">
                  ₹{order.amount.toLocaleString("en-IN")}
                </h2>

              </div>

            </div>
          </div>
        ))}

      </CardContent>

    </Card>
  );
};

export default RecentOrders;