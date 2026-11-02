import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  createInventory,
  updateInventory,
  getInventoryByBranch,
} from "@/Redux Toolkit/features/Inventory/inventoryThunk";

import InventoryTable from "./InventoryTable";
import InventoryFormDialog from "./InventoryFormDialog";

const Inventory = () => {
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch || {});

  const [selectedInventory, setSelectedInventory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (branch?.id) {
      dispatch(getInventoryByBranch(branch.id));
    }
  }, [branch?.id, dispatch]);

  const handleOpenAddDialog = () => {
    setSelectedInventory(null);
    setSelectedProductId("");
    setQuantity(1);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (item) => {
    setSelectedInventory({
      ...item,
      id: item.inventoryId ?? item.id,
      productId: item.productId ?? item.product?.id ?? item.id,
    });
    setSelectedProductId((item.productId ?? item.product?.id ?? item.id ?? "").toString());
    setQuantity(item.quantity ?? 1);
    setIsEditDialogOpen(true);
  };

  const handleAddInventory = () => {
    if (!selectedProductId || !branch?.id) return;

    dispatch(
      createInventory({
        productId: Number(selectedProductId),
        quantity,
        branchId: branch.id,
      })
    ).then(() => {
      dispatch(getInventoryByBranch(branch.id));
    });

    setIsAddDialogOpen(false);
  };

  const handleUpdateInventory = () => {
    if (!selectedInventory?.id || !branch?.id) return;

    dispatch(
      updateInventory({
        id: selectedInventory.id,
        dto: {
          quantity,
          productId: Number(selectedProductId || selectedInventory.productId || selectedInventory.id),
          branchId: branch.id,
        },
      })
    ).then(() => {
      dispatch(getInventoryByBranch(branch.id));
    });

    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage inventory stock and quantities.
          </p>
        </div>

        <Button className="gap-2" onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4" />
          Add Inventory
        </Button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <InventoryTable inventories={[]} onEdit={handleOpenEditDialog} />
      </div>

      <InventoryFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
        selectedInventory={selectedInventory}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        quantity={quantity}
        setQuantity={setQuantity}
        onSubmit={handleAddInventory}
      />

      <InventoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        selectedInventory={selectedInventory}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        quantity={quantity}
        setQuantity={setQuantity}
        onSubmit={handleUpdateInventory}
      />
    </div>
  );
};

export default Inventory;