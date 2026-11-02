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

import {
  Building2,
  MapPin,
  User,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";

const BranchTable = ({
  branches = [],
  handleEditBranch,
  handleDeleteBranch,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <Table>

        <TableHeader className="bg-gray-50">

          <TableRow>

            <TableHead className="w-65">
              Branch
            </TableHead>

            <TableHead>
              Address
            </TableHead>

            <TableHead>
              Manager
            </TableHead>

            <TableHead>
              Phone
            </TableHead>

            <TableHead className="text-center w-32.5">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {branches.length > 0 ? (
            branches.map((branch) => (
              <TableRow
                key={branch.id}
                className="hover:bg-green-50 transition-colors"
              >
                {/* Branch */}

                <TableCell>

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">

                      <Building2 className="h-5 w-5 text-green-600" />

                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-900">
                        {branch.name}
                      </h3>

                      <p className="text-xs text-gray-500">
                        BR-{String(branch.id).padStart(3, "0")}
                      </p>

                    </div>

                  </div>

                </TableCell>

                {/* Address */}

                <TableCell>

                  <div className="flex items-start gap-2">

                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

                    <span className="text-sm text-gray-600 leading-5">
                      {branch.address}
                    </span>

                  </div>

                </TableCell>

                {/* Manager */}

                <TableCell>

                  <div className="flex items-center gap-2">

                    <User className="h-4 w-4 text-blue-500" />

                    <span className="font-medium">
                      {branch.manager?.fullName || branch.manager || "Unassigned"}
                    </span>

                  </div>

                </TableCell>

                {/* Phone */}

                <TableCell>

                  <div className="flex items-center gap-2">

                    <Phone className="h-4 w-4 text-green-600" />

                    <span>
                      {branch.phone || branch.manager?.phone || "—"}
                    </span>

                  </div>

                </TableCell>

                {/* Actions */}

                <TableCell>

                  <div className="flex justify-center gap-2">

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 hover:bg-blue-50"
                      onClick={() => handleEditBranch(branch)}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 hover:bg-red-50"
                      onClick={() => handleDeleteBranch(branch)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>

                  </div>

                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>

              <TableCell
                colSpan={5}
                className="h-52 text-center"
              >

                <div className="flex flex-col items-center justify-center gap-3">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

                    <Building2 className="h-8 w-8 text-gray-400" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-700">
                      No Branches Found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Click the "Add Branch" button to create your first branch.
                    </p>

                  </div>

                </div>

              </TableCell>

            </TableRow>
          )}

        </TableBody>

      </Table>

    </div>
  );
};

export default BranchTable;