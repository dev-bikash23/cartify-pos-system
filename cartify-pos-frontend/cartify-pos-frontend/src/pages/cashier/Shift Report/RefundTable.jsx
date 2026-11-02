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
import { useSelector } from "react-redux";

const RefundTable = () => {
  const shiftResponse = useSelector((state) => state.refund?.refundsByShift ?? []);
  const cashierResponse = useSelector((state) => state.refund?.refundsByCashier ?? []);
  const ordersResponse = useSelector((state) => state.order?.orders ?? []);
  const response = Array.isArray(shiftResponse) && shiftResponse.length
    ? shiftResponse
    : shiftResponse?.data?.length || shiftResponse?.content?.length
      ? shiftResponse
      : cashierResponse;
  const refunds = Array.isArray(response)
    ? response
    : response?.data ?? response?.content ?? [];
  const orders = Array.isArray(ordersResponse)
    ? ordersResponse
    : ordersResponse?.data ?? ordersResponse?.content ?? [];
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Refund History</h2>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Refund ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {refunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell>RFD-{refund.id}</TableCell>
                  <TableCell>ORD-{refund.orderId ?? refund.order?.id ?? "-"}</TableCell>
                  <TableCell>{refund.reason ?? refund.refundReason ?? "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{Number(
                      refund.amount ??
                      refund.refundAmount ??
                      refund.totalAmount ??
                      refund.refundTotal ??
                      refund.order?.totalAmount ??
                      orders.find((order) => order.id === refund.orderId)?.totalAmount ??
                      0
                    ).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
              {refunds.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No refunds found.
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

export default RefundTable;