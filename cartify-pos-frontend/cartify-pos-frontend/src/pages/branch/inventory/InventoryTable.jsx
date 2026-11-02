import React, { useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

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
import { useSelector, useDispatch } from "react-redux";
import {
  getInventoryByBranch,
  deleteInventory,
} from "@/Redux Toolkit/features/Inventory/inventoryThunk";
import { getProductsByStore } from "@/Redux Toolkit/features/Product/productThunk";

const InventoryTable = ({ inventories: propInventories, onEdit, onEditProduct }) => {
  const getStatus = (quantity) => {
    if (quantity > 20) {
      return (
        <Badge className="bg-green-600 hover:bg-green-600 text-white">
          In Stock
        </Badge>
      );
    }

    if (quantity > 0) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">
          Low Stock
        </Badge>
      );
    }

    return <Badge variant="destructive">Out of Stock</Badge>;
  };

  const { inventories: reduxInventories = [] } = useSelector((state) => state.inventory || {});
  const { branch: fetchedBranch } = useSelector((state) => state.branch || {});
  const dispatch = useDispatch();

  const rawInventoryList = propInventories?.length ? propInventories : reduxInventories;

  const inventoryList = (reduxInventories.length ? reduxInventories : rawInventoryList).map((item) => {
    const product = item?.product || item;
    const inventoryId = item?.id ?? item?.inventoryId ?? product?.inventoryId ?? null;

    return {
      inventoryId,
      id: inventoryId,
      productId: product?.id ?? item?.productId ?? null,
      sku: product?.sku ?? "",
      name: product?.name ?? "",
      image: product?.image ?? "",
      brand: product?.brand ?? "",
      description: product?.description ?? "",
      mrp: product?.mrp ?? 0,
      sellingPrice: product?.sellingPrice ?? 0,
      quantity: item?.quantity ?? product?.quantity ?? 0,
      category: product?.category?.name ?? product?.category ?? "",
      product: product,
    };
  });

  const handleDelete = (item) => {
    const inventoryId = item?.inventoryId ?? item?.id;
    if (!inventoryId) return;

    if (window.confirm(`Remove ${item.name} from inventory?`)) {
      dispatch(deleteInventory(inventoryId)).then(() => {
        if (fetchedBranch?.id) {
          dispatch(getInventoryByBranch(fetchedBranch.id));
        }
      });
    }
  };

  useEffect(() => {
    if (fetchedBranch?.id) {
      dispatch(getInventoryByBranch(fetchedBranch.id));
    }

    if (fetchedBranch?.storeId) {
      dispatch(getProductsByStore({ storeId: fetchedBranch.storeId }));
    }
  }, [fetchedBranch, dispatch]);

  return (
    <Table>
      <TableHeader className="bg-muted/40">
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Category</TableHead>
          <TableHead className="text-right">MRP</TableHead>
          <TableHead className="text-right">Selling Price</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {inventoryList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
              No Inventory Found
            </TableCell>
          </TableRow>
        ) : (
          inventoryList.map((item) => (
            <TableRow key={item?.id} className="hover:bg-muted/30">
              <TableCell>
                <img
                  src={item?.image || "https://placehold.co/48x48?text=No+Image"}
                  alt={item?.name || "Product"}
                  className="h-12 w-12 rounded-md border object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "https://placehold.co/48x48?text=No+Image";
                  }}
                />
              </TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell className="font-medium">{item?.sku}</TableCell>
              <TableCell>{item?.brand || "-"}</TableCell>
              <TableCell className="text-center font-semibold">{item?.quantity}</TableCell>
              <TableCell className="text-center">{item?.category}</TableCell>
              <TableCell className="text-right">₹{item?.mrp}</TableCell>
              <TableCell className="text-right">₹{item?.sellingPrice}</TableCell>
              <TableCell className="max-w-xs truncate" title={item?.description || ""}>
                {item?.description || "-"}
              </TableCell>
              <TableCell className="text-center">{getStatus(item?.quantity)}</TableCell>

              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                    <Edit className="mr-1 h-4 w-4 text-primary" />
                    Stock
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEditProduct(item.product)}>
                    <Edit className="mr-1 h-4 w-4 text-primary" />
                    Product
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(item)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${item.name} inventory`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;