import React from "react";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const DeleteEmployeeDialog = ({
  open,
  onOpenChange,
  employee,
  onDelete,
}) => {

  const isBranchManager = employee?.role === "ROLE_BRANCH_MANAGER";

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle className="text-red-600">
            Delete Employee
          </DialogTitle>

        </DialogHeader>

        <div className="py-4">

          <p className="text-base">
            Are you sure you want to delete
            <span className="font-semibold">
              {" "}
              {employee.fullName}
            </span>
            ?
          </p>

          {isBranchManager ? (
            <p className="text-sm text-red-600 mt-2">
              This employee is assigned as the branch manager. Reassign the
              branch manager first, then delete this employee.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          )}

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isBranchManager}
          >
            Delete
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
};

export default DeleteEmployeeDialog;