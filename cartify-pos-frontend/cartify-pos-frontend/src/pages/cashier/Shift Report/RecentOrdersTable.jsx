import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

const RecentOrdersTable = () => {
  const response = useSelector((state) => state.order?.orders ?? []);
  const orders = (Array.isArray(response)
    ? response
    : response?.data ?? response?.content ?? []
  ).slice(-5).reverse();
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Orders
        </h2>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    ORD-{order.id}
                  </TableCell>

                  <TableCell>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                  </TableCell>

                  <TableCell>
                    {order.customer?.fullName ?? order.customer?.name ?? order.customerName ?? "Walk-in Customer"}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-green-600">
                    ₹{Number(order.totalAmount ?? 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {order.paymentType ?? "-"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className="bg-green-600 text-white hover:bg-green-600">
                      {order.status ?? "-"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;