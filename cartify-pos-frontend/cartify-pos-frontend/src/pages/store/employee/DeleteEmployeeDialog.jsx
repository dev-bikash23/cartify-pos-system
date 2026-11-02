import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const DeleteEmployeeDialog = ({ open, onOpenChange, employee, onDelete }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Employee</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{employee.fullName}</span>?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This action cannot be undone.
          </p>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEmployeeDialog;