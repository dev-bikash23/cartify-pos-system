import React, { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import OrderDetails from "./Order Details/OrderDetails";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Calendar, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "@/context/hook/useSidebar";
import { deleteOrder, getOrdersByCashier } from "@/Redux Toolkit/features/Order/orderThunk";
import { toast } from "sonner";

const OrderHistory = () => {
  const [showOrderInvoiceDialog, setShowOrderInvoiceDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const { userProfile } = useSelector((state) => state.user);
  const { orders, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const { setSidebarOpen } = useSidebar();

  const fetchOrders = () => {
    if (userProfile?.id) {
      dispatch(getOrdersByCashier(userProfile.id));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch, userProfile?.id]);

  const toLocalDateKey = (value) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const matchesDateFilter = (order) => {
    const orderDateKey = toLocalDateKey(order?.createdAt);
    if (!orderDateKey) return false;

    const today = new Date();
    const todayKey = toLocalDateKey(today);

    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "today") {
      return orderDateKey === todayKey;
    }

    if (activeFilter === "week") {
      const startOfWeek = new Date(today);
      const dayIndex = (today.getDay() + 6) % 7;
      startOfWeek.setDate(today.getDate() - dayIndex);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfWeek && orderDate <= endOfWeek;
    }

    if (activeFilter === "month") {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    }

    if (activeFilter === "custom") {
      if (!customStartDate && !customEndDate) return true;

      let start = customStartDate ? new Date(`${customStartDate}T00:00:00`) : null;
      let end = customEndDate ? new Date(`${customEndDate}T23:59:59`) : null;

      if (start && end && start > end) {
        [start, end] = [end, start];
      }

      const orderDate = new Date(order.createdAt);
      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;
      return true;
    }

    return true;
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderInvoiceDialog(true);
  };

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Delete order ORD-${order.id}? This action cannot be undone.`)) return;

    try {
      await dispatch(deleteOrder(order.id)).unwrap();
      toast.success(`Order ORD-${order.id} deleted`);
    } catch (error) {
      toast.error(error || "Failed to delete order");
    }
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      toast.error("Allow pop-ups to print the invoice");
      return;
    }

    const items = (order.items || []).map((item) => {
      const quantity = item.quantity || 0;
      const price = item.product?.sellingPrice || 0;
      return `<tr><td>${item.product?.name || "Item"}</td><td>${quantity}</td><td>₹${price}</td><td>₹${(price * quantity).toFixed(2)}</td></tr>`;
    }).join("");

    printWindow.document.write(`<!doctype html><html><head><title>Invoice ORD-${order.id}</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#111}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border-bottom:1px solid #ddd;padding:10px;text-align:left}th:nth-child(n+2),td:nth-child(n+2){text-align:right}.total{text-align:right;margin-top:24px;font-size:18px;font-weight:bold}</style></head><body><h1>Order Invoice</h1><p>Order: ORD-${order.id}</p><p>Date: ${order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "-"}</p><p>Customer: ${order.customer?.fullName || "Walk-in Customer"}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${items}</tbody></table><div class="total">Total: ₹${(order.totalAmount || 0).toLocaleString("en-IN")}</div></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const filteredOrders = (orders || []).filter((order) => {
    if (!order) return false;

    if (!matchesDateFilter(order)) {
      return false;
    }

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      String(order.id).includes(term) ||
      order.customer?.fullName?.toLowerCase().includes(term);
    return matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Order History</h1>
          </div>
          <Button variant="outline" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-60 flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID or Customer..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            className={activeFilter === "today" ? "bg-green-700 hover:bg-green-800" : ""}
            variant={activeFilter === "today" ? "default" : "outline"}
            onClick={() => setActiveFilter("today")}
          >
            Today
          </Button>
          <Button
            variant={activeFilter === "week" ? "default" : "outline"}
            onClick={() => setActiveFilter("week")}
          >
            This Week
          </Button>
          <Button
            variant={activeFilter === "month" ? "default" : "outline"}
            onClick={() => setActiveFilter("month")}
          >
            This Month
          </Button>
          <Button
            variant={activeFilter === "custom" ? "default" : "outline"}
            onClick={() => setActiveFilter("custom")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Custom
          </Button>
        </div>

        {activeFilter === "custom" && (
          <div className="space-y-3 rounded-lg border bg-card p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">From</label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Show orders between the selected dates. Leave both blank to see all orders.
            </p>
          </div>
        )}

        {activeFilter === "custom" && (customStartDate || customEndDate) && (
          <div className="text-sm text-muted-foreground">
            Showing orders from <span className="font-medium text-foreground">{customStartDate || "beginning"}</span> to <span className="font-medium text-foreground">{customEndDate || "now"}</span>
          </div>
        )}

        {/* Table */}
        <OrderTable
          orders={filteredOrders}
          loading={loading}
          handleViewOrderDetails={handleViewOrderDetails}
          handleDeleteOrder={handleDeleteOrder}
          handlePrintOrder={handlePrintOrder}
        />
      </div>

      <Dialog open={showOrderInvoiceDialog} onOpenChange={setShowOrderInvoiceDialog}>
        <DialogContent className="w-full gap-0 overflow-hidden p-0 sm:max-w-3xl! sm:rounded-2xl">
          <DialogHeader className="border-b bg-white px-5 py-4 sm:px-6">
            <DialogTitle className="text-xl font-bold sm:text-2xl">
              Order Invoice
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Review the order summary and purchased items
            </p>
          </DialogHeader>

          <div className="bg-slate-50/70">
            <OrderDetails selectedOrder={selectedOrder} />
          </div>

        </DialogContent>
</Dialog>
    </div>
  );
};

export default OrderHistory;