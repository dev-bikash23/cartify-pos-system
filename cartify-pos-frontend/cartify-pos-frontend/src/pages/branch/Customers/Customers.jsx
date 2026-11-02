import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAllCustomers } from "@/Redux Toolkit/features/Customer/customerThunk";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customer);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  const filteredCustomers = (customers || []).filter((customer) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    return [
      customer?.fullName,
      customer?.name,
      customer?.phone,
      customer?.email,
    ].some((value) => String(value ?? "").toLowerCase().includes(term));
  });

  const refreshCustomers = () => {
    dispatch(getAllCustomers());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">Live customer list</p>
        </div>

        <Button variant="outline" onClick={refreshCustomers} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
          className="pl-10"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading && !error && filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            )}

            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id ?? `${customer.fullName}-${customer.phone}`} className="hover:bg-muted/40">
                <TableCell className="font-medium">
                  {customer.fullName ?? customer.name ?? "Walk-in Customer"}
                </TableCell>
                <TableCell>{customer.phone ?? "-"}</TableCell>
                <TableCell>{customer.email ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;