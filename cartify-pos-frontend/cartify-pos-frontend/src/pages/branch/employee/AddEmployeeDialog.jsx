import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from "@/pages/store/employee/EmployeeForm";

const AddEmployeeDialog = ({ open, onOpenChange, onSubmit, branchId }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        <EmployeeForm
          fixedBranchId={branchId}
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;