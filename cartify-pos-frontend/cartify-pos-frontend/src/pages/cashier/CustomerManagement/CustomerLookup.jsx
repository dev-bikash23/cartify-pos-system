import React, { useEffect, useState } from "react";
import { ArrowLeft, UserIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "@/context/hook/useSidebar";
import { getAllCustomers } from "@/Redux Toolkit/features/Customer/customerThunk";
import { getOrdersByCustomer } from "@/Redux Toolkit/features/Order/orderThunk";

import CustomerSearch from "./CustomerSearch";
import CustomerList from "./CustomerList";
import CustomerDetails from "./CustomerDetails";
import PurchaseHistory from "./PurchaseHistory";

const CustomerLookup = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { setSidebarOpen } = useSidebar();
  const { customers, loading: customersLoading, error: customersError } = useSelector(
    (state) => state.customer
  );
  const { customerOrders, loading: ordersLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCustomer?.id) {
      dispatch(getOrdersByCustomer(selectedCustomer.id));
    }
  }, [dispatch, selectedCustomer]);

  const filteredCustomers = (customers || []).filter((customer) => {
    const term = searchTerm.toLowerCase().trim();
    return [customer.fullName, customer.phone, customer.email]
      .some((value) => String(value ?? "").toLowerCase().includes(term));
  });

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold">
            Customer Management
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Panel */}
        <div className="w-1/3 border-r flex flex-col">
          <CustomerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CustomerList
            customers={filteredCustomers}
            loading={customersLoading}
            error={customersError}
            setSelectedCustomer={setSelectedCustomer}
          />
        </div>

        {/* Right Panel */}
        <div className="w-2/3 overflow-y-auto">

          {selectedCustomer ? (
            <>
              <CustomerDetails customer={selectedCustomer} />
              <PurchaseHistory orders={customerOrders} loading={ordersLoading} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <UserIcon className="h-14 w-14" />

              <p className="mt-4 text-lg font-medium">
                No Customer Selected
              </p>

              <p className="text-sm">
                Select a customer from the list to view details.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CustomerLookup;