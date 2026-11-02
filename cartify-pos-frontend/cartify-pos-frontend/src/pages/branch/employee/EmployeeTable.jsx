import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, Edit, Trash2 } from "lucide-react";

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

const EmployeeTable = ({
  employees = [],
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">

      <Table>

        <TableHeader className="bg-muted/50">

          <TableRow>

            <TableHead>Name</TableHead>

            <TableHead>Role</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Last Login</TableHead>

            <TableHead>Assigned Since</TableHead>

            <TableHead className="text-center">
              Action
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {employees.length === 0 ? (

            <TableRow>

              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No Employees Found
              </TableCell>

            </TableRow>

          ) : (

            employees.map((employee) => (

              <TableRow
                key={employee.id}
                className="hover:bg-muted/40"
              >

                {/* Name */}

                <TableCell>

                  <div className="flex items-center gap-3">

                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">

                      {employee.fullName?.charAt(0).toUpperCase()}

                    </div>

                    <div>

                      <p className="font-medium">
                        {employee.fullName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        EMP-{employee.id}
                      </p>

                    </div>

                  </div>

                </TableCell>

                {/* Role */}

                <TableCell>
                  {employee.role}
                </TableCell>

                {/* Email */}

                <TableCell>
                  {employee.email}
                </TableCell>

                {/* Last Login */}

                <TableCell>

                  {employee.lastLogin ? (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      {formatDate(employee.lastLogin)}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                      Never
                    </Badge>
                  )}

                </TableCell>

                {/* Assigned Since */}

                <TableCell>
                  {formatDate(employee.createdAt)}
                </TableCell>

                {/* Actions */}

                <TableCell>

                  <div className="flex justify-center gap-1">

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onView(employee)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(employee)}
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(employee)}
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
  );
};

export default EmployeeTable;