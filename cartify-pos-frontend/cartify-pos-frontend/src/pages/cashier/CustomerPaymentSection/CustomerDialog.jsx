import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import CustomerForm from "./CustomerForm";
import { useSelector, useDispatch } from "react-redux";
import { getAllCustomers, deleteCustomer } from "@/Redux Toolkit/features/Customer/customerThunk";
import { setSelectedCustomer } from "@/Redux Toolkit/features/Cart/cartSlice";

export default function CustomerDialog({
  showCustomerDialog,
  setShowCustomerDialog,
}) {
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { customers } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showCustomerDialog) {
      dispatch(getAllCustomers());
    }
  }, [showCustomerDialog, dispatch]);

  const handleSelectCustomer = (customer) => {
    console.log(customer);
    dispatch(setSelectedCustomer(customer));
    setShowCustomerDialog(false);
  };

  const handleDeleteClick = (e, customer) => {
    e.stopPropagation();
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCustomer(customerToDelete.id));
    setShowDeleteConfirm(false);
    setCustomerToDelete(null);
  };

  const filteredCustomers = (customers || []).filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(term) ||
      c.phone?.includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search customers..."
            className="mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="border rounded-md max-h-[350px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.fullName}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectCustomer(c)}
                          >
                            Select
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => handleDeleteClick(e, c)}
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

          <CustomerForm
            showCustomerForm={showCustomerForm}
            setShowCustomerForm={setShowCustomerForm}
          />

          <DialogFooter>
            <Button
              onClick={() => setShowCustomerForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Add New Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Customer</DialogTitle>
          </DialogHeader>

          <p>
            Would you want to delete{" "}
            <span className="font-semibold">{customerToDelete?.fullName}</span>?
          </p>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}