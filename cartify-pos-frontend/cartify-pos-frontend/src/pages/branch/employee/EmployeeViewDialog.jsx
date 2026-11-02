import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const EmployeeViewDialog = ({
  open,
  onOpenChange,
  employee,
}) => {

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle>
            Employee Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">

          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">

            <User className="h-12 w-12 text-green-700" />

          </div>

          <h2 className="mt-4 text-xl font-bold">
            {employee.fullName}
          </h2>

          <Badge className="mt-2 bg-green-600 text-white">
            {employee.role}
          </Badge>

        </div>

        <div className="space-y-4">

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">
              Employee ID
            </span>

            <span className="font-medium">
              EMP-{employee.id}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">
              Email
            </span>

            <span>{employee.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">
              Phone
            </span>

            <span>{employee.phone || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">
              Role
            </span>

            <span>{employee.role}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">
              Last Login
            </span>

            <span>{formatDate(employee.lastLogin) === "—" ? "Never" : formatDate(employee.lastLogin)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Assigned Since
            </span>

            <span>{formatDate(employee.createdAt)}</span>
          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
};

export default EmployeeViewDialog;