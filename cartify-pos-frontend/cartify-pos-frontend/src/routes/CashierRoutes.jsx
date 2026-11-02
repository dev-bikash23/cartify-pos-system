import CashierDashboardLayout from "@/pages/cashier/CashierDashboardLayout";
import CreateOrder from "@/pages/cashier/CreateOrder";
import OrderHistory from "@/pages/cashier/Order History/OrderHistory";
import CustomerLookup from "@/pages/cashier/CustomerManagement/CustomerLookup";
import RefundPage from "@/pages/cashier/Refund/RefundPage";
import ShiftSummaryPage from "@/pages/cashier/Shift Report/ShiftSummaryPage";

import { Routes, Route } from "react-router-dom";

const CashierRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CashierDashboardLayout />}>
        <Route index element={<CreateOrder />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="customers" element={<CustomerLookup />} />
        <Route path="returns" element={<RefundPage />} />
        <Route path="shift-summary" element={<ShiftSummaryPage />} />
      </Route>
    </Routes>
  );
};

export default CashierRoutes;