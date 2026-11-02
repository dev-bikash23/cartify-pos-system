import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getOrdersByCashier } from "@/Redux Toolkit/features/Order/orderThunk";
import { useEffect } from "react";

const OrderTable = ({ handleSelectOrder }) => {
  const { orders } = useSelector((state) => state.order);
  const dispatch=useDispatch();
  const { userProfile }=useSelector(state=>state.user);

  useEffect(() => {
    if(userProfile?.id){
      dispatch(getOrdersByCashier(userProfile.id))
    }
    }, [dispatch, userProfile?.id]);
  return (
    <div className="space-y-6">
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
            {(orders || []).filter(Boolean).map((order) => (
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
                    {order.status || "Pending"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => handleSelectOrder(order)}>
                      select for return
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;