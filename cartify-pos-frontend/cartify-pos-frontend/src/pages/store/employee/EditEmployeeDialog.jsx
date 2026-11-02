import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from "@/pages/store/employee/EmployeeForm";

const EditEmployeeDialog = ({ open, onOpenChange, employee, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Employee
          </DialogTitle>
        </DialogHeader>

        <EmployeeForm
          initialData={employee}
          onSubmit={(values) => {
            onSubmit({ ...employee, ...values });
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeDialog;