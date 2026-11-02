import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import React from 'react'
import CustomerForm from "../CustomerPaymentSection/CustomerForm";

const CustomerSearch = ({ searchTerm, setSearchTerm }) => {

  const[showCustomerForm, setShowCustomerForm] = React.useState(false);
  return (
    <div className="p-4 border-b bg-background">
  <div className="flex items-center gap-3">

    <div className="relative flex-1">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      <Input
        type="text"
        placeholder="Search by name, phone or email..."
        className="pl-10 h-10 rounded-lg"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </div>

    <Button
      type="button"
      onClick={() => setShowCustomerForm(true)}
      className="h-10 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200"
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      Add Customer
    </Button>
  </div>

  <CustomerForm
    showCustomerForm={showCustomerForm}
    setShowCustomerForm={setShowCustomerForm}
  />
</div>
  );
};

export default CustomerSearch;