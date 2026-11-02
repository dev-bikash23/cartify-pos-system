import React, { useEffect, useState } from "react";
import { RefreshCw, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import OrderDetails from "@/pages/cashier/Order History/Order Details/OrderDetails";
import { getOrdersByBranch } from "@/Redux Toolkit/features/Order/orderThunk";

const Orders = () => {
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { orders, loading, error } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderInvoiceDialog, setShowOrderInvoiceDialog] = useState(false);

  useEffect(() => {
    if (!branch?.id) return;
    dispatch(getOrdersByBranch({ branchId: branch.id }));
  }, [branch?.id, dispatch]);

  const orderList = Array.isArray(orders)
    ? orders
    : orders?.data ?? orders?.content ?? [];

  const normalizedOrders = orderList.map((order) => {
    const customerName = order.customer?.fullName ?? order.customer?.name ?? order.customer ?? order.customerName ?? "Walk-in customer";
    const customerPhone = order.customer?.phone ?? order.customer?.mobile ?? order.customerPhone ?? order.phone ?? "-";

    return {
      ...order,
      customerName,
      customerPhone,
      customer:
        order.customer && typeof order.customer === "object"
          ? order.customer
          : { fullName: customerName, phone: customerPhone },
      date: order.date ?? order.createdAt ?? "-",
      payment: order.payment ?? order.paymentType ?? "-",
      amount: Number(order.amount ?? order.totalAmount ?? 0),
      statusText: String(order.status ?? "PENDING").toLowerCase(),
    };
  });

  const handleViewOrderDetails = (order) => {
    setSelectedOrder({
      ...order,
      customer:
        order.customer && typeof order.customer === "object"
          ? order.customer
          : {
              fullName: order.customerName ?? order.customer ?? "Walk-in customer",
              phone: order.customerPhone ?? order.phone ?? "-",
            },
    });
    setShowOrderInvoiceDialog(true);
  };

  const refreshOrders = () => {
    if (!branch?.id) return;
    dispatch(getOrdersByBranch({ branchId: branch.id }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>

        <Button variant="outline" className="gap-2" onClick={refreshOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Orders Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date / Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">View</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading && !error && normalizedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  No orders found for this branch.
                </TableCell>
              </TableRow>
            )}

            {normalizedOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/40">
                <TableCell className="font-semibold">
                  ORD-{order.id}
                </TableCell>

                <TableCell>{order.date}</TableCell>

                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.cashierId ?? order.cashier?.id ?? "-"}</TableCell>

                <TableCell className="text-right font-semibold text-green-600">
                  ₹{order.amount.toLocaleString("en-IN")}
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline">{order.payment}</Badge>
                </TableCell>

                <TableCell className="text-center">
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
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleViewOrderDetails(order)}
                  >
                    <Eye className="h-5 w-5 text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderInvoiceDialog} onOpenChange={setShowOrderInvoiceDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold justify-between">
              Order-Invoice
            </DialogTitle>
          </DialogHeader>

          <OrderDetails selectedOrder={selectedOrder} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;

