import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Printer, RotateCcw, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const OrderTable = ({ orders, loading, handleViewOrderDetails, handleDeleteOrder, handlePrintOrder }) => {
  
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date / Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Payment Mode</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                Loading orders...
              </TableCell>
            </TableRow>
          ) : !orders || orders.filter(Boolean).length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders
              .filter(Boolean) // guard: drop any null/undefined entries before rendering
              .map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">ORD-{order.id}</TableCell>

                  <TableCell>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {order.customer?.fullName || "Walk-in Customer"}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-green-600">
                    ₹{(order.totalAmount ?? 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="outline">{order.paymentType}</Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge className="bg-green-600 text-white">
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View order ${order.id}`}
                        title="View order"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Print order ${order.id}`}
                        title="Print invoice"
                        onClick={() => handlePrintOrder(order)}
                      >
                        <Printer className="h-4 w-4 text-gray-700" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Return order ${order.id}`}
                        title="Return order"
                      >
                        <RotateCcw className="h-4 w-4 text-red-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete order ${order.id}`}
                        title="Delete order"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;