import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrderItemTable = ({ selectedOrder }) => {
  if (!selectedOrder?.items?.length) return null;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <h2 className="mb-3 text-base font-semibold">Order Items</h2>

        <div className="overflow-hidden rounded-lg border bg-white">
          <Table className="w-full min-w-0">
            <TableHeader className="bg-slate-100/80">
              <TableRow>
                <TableHead className="py-4">Image</TableHead>
                <TableHead className="py-4">Item</TableHead>
                <TableHead className="text-center py-4">Quantity</TableHead>
                <TableHead className="text-right py-4">Price</TableHead>
                <TableHead className="text-right py-4">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selectedOrder.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product?.name}
                        className="h-12 w-12 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md border bg-muted" />
                    )}
                  </TableCell>

                  <TableCell className="py-2">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.product?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        SKU: {item.product?.sku}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-2 text-center font-semibold text-green-600">
                    {item.quantity?.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="py-2 text-right font-semibold text-green-600">
                    ₹{item.product?.sellingPrice}
                  </TableCell>

                  <TableCell className="py-2 text-right font-medium">
                    ₹{(item.product?.sellingPrice * item.quantity)?.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemTable;