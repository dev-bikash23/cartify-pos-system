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

import { Tag, Package, Pencil, Trash2 } from "lucide-react";

const CategoryTable = ({
  categories = [],
  loading = false,
  handleEditCategory,
  handleDeleteCategory,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="min-w-[220px]">Category Name</TableHead>
            <TableHead className="min-w-[240px]">Description</TableHead>
            <TableHead className="min-w-[120px]">Products</TableHead>
            <TableHead className="text-center w-[130px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                Loading categories...
              </TableCell>
            </TableRow>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <TableRow
                key={category.id}
                className="hover:bg-green-50 transition-colors"
              >
                {/* Category */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 shrink-0">
                      <Tag className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        CAT-{String(category.id).padStart(3, "0")}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Description */}
                <TableCell>
                  <span className="text-sm text-gray-600 leading-5">
                    {category.description}
                  </span>
                </TableCell>

                {/* Products count */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{category.products}</span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 hover:bg-blue-50"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 hover:bg-red-50"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-52 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      No Categories Found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Click the "Add Category" button to create your first category.
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

export default CategoryTable;