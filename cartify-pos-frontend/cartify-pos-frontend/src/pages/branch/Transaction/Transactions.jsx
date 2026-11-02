import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";

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

import { getOrdersByBranch } from "@/Redux Toolkit/features/Order/orderThunk";

const Transactions = () => {
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!branch?.id) return;
    dispatch(getOrdersByBranch({ branchId: branch.id }));
  }, [branch?.id, dispatch]);

  const transactionList = Array.isArray(orders)
    ? orders
    : orders?.data ?? orders?.content ?? [];

  const transactions = transactionList.map((order) => ({
    id: order.id,
    date: order.date ?? order.createdAt ?? "-",
    customer: order.customer?.fullName ?? order.customer?.name ?? order.customerName ?? "Walk-in customer",
    cashier: order.cashier?.fullName ?? order.cashier?.name ?? order.cashier?.email ?? order.cashierName ?? order.cashierId ?? "-",
    payment: order.payment ?? order.paymentType ?? "-",
    amount: Number(order.amount ?? order.totalAmount ?? 0),
    status: order.status ?? "PENDING",
  }));

  const refreshTransactions = () => {
    if (!branch?.id) return;
    dispatch(getOrdersByBranch({ branchId: branch.id }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            {branch?.name ? `${branch.name} branch sales` : "Branch transactions"}
          </p>
        </div>

        <Button variant="outline" onClick={refreshTransactions} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading && !error && transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No transactions found for this branch.
                </TableCell>
              </TableRow>
            )}

            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-muted/40">
                <TableCell className="font-semibold">TRX-{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>{transaction.cashier}</TableCell>
                <TableCell>{transaction.payment}</TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  ₹{transaction.amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      String(transaction.status).toLowerCase() === "completed" || String(transaction.status).toLowerCase() === "success"
                        ? "bg-green-600 hover:bg-green-600 text-white"
                        : String(transaction.status).toLowerCase() === "pending"
                          ? "bg-yellow-500 hover:bg-yellow-500 text-white"
                          : "bg-slate-600 hover:bg-slate-600 text-white"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Transactions;