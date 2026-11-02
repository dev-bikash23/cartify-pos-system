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

import { Pencil, Trash2, Package } from "lucide-react";

const ProductTable = ({ products, handleEditProduct, handleDeleteProduct }) => {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow>
            <TableHead className="w-22.5">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">MRP</TableHead>
            <TableHead className="text-right">Selling Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center w-37.5">Operation</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-green-50 transition-colors"
              >
                {/* Image */}
                <TableCell>
                  <img
                    src={product.image || "/icons.svg"}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg border object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/icons.svg";
                    }}
                  />
                </TableCell>

                {/* Product */}
                <TableCell>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {product.description}
                    </p>
                  </div>
                </TableCell>

                {/* SKU */}
                <TableCell>
                  <span className="font-medium">{product.sku}</span>
                </TableCell>

                {/* Brand */}
                <TableCell>{product.brand}</TableCell>

                {/* Category */}
                <TableCell>
                  <span className="rounded-full font-medium">
                    {product.category?.name || product.category || "—"}
                  </span>
                </TableCell>

                {/* MRP */}
                <TableCell className="text-right">₹ {product.mrp}</TableCell>

                {/* Selling Price */}
                <TableCell className="text-right font-semibold text-green-600">
                  ₹ {product.sellingPrice}
                </TableCell>

                {/* Stock */}
                <TableCell className="text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.stock > 20
                        ? "bg-green-100 text-green-700"
                        : product.stock > 10
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>

                {/* Operation */}
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-blue-200 hover:bg-blue-50"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-64">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Package className="h-12 w-12 text-gray-400" />
                  <h3 className="text-lg font-semibold">No Products Found</h3>
                  <p className="text-sm text-gray-500">
                    Click the <b>Add Product</b> button to create your first product.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;