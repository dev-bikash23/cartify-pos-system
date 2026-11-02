import React from "react";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Edit, Trash2, Mail, Phone } from "lucide-react";

const EmployeeTable = ({ employees = [], branches = [], loading, onEdit, onDelete }) => {
  const getBranchName = (employee) => {
    if (typeof employee.branch === "string") return employee.branch;
    if (employee.branch?.name) return employee.branch.name;
    if (employee.branchName) return employee.branchName;

    const branch = branches.find(
      (item) => String(item.id) === String(employee.branchId)
    );
    return branch?.name || employee.branchId || "-";
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="min-w-[200px] p-6">Name</TableHead>
            <TableHead className="min-w-[220px]">Contact</TableHead>
            <TableHead className="min-w-[140px]">Role</TableHead>
            <TableHead className="min-w-[150px]">Branch</TableHead>
            <TableHead className="text-center min-w-[130px]">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                Loading employees...
              </TableCell>
            </TableRow>
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-muted-foreground"
              >
                No Employees Found
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/40">

                {/* Name */}
                <TableCell>
                  <div className="flex items-center gap-3 p-4">
                  
                    <div>
                      <p className="font-medium">{employee.fullName}</p>
                      
                    </div>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{employee.phone}</span>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>{employee.role}</TableCell>

                {/* Branch */}
                <TableCell>{getBranchName(employee)}</TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex justify-center gap-1">
                    
                    <Button size="icon" variant="ghost" onClick={() => onEdit(employee)}>
                      <Edit className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(employee)}>
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
  );
};

export default EmployeeTable;