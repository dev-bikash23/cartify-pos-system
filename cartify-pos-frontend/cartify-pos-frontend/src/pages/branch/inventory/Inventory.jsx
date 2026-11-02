import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createInventory,
  updateInventory,
  getInventoryByBranch,
} from "@/Redux Toolkit/features/Inventory/inventoryThunk";
import { getCategoryByStore } from "@/Redux Toolkit/features/Category/categoryThunk";
import { updateProduct } from "@/Redux Toolkit/features/Product/productThunk";
import ProductForm from "@/pages/store/Product/ProductForm";

import InventoryTable from "./InventoryTable";
import InventoryFormDialog from "./InventoryFormDialog";

const Inventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { branch } = useSelector((state) => state.branch || {});

  const [selectedInventory, setSelectedInventory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (branch?.id) {
      dispatch(getInventoryByBranch(branch.id));
    }
    const storeId = branch?.storeId ?? branch?.store?.id;
    if (storeId) {
      dispatch(getCategoryByStore({ storeId }));
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

  const handleOpenProductEdit = (product) => {
    setSelectedProduct({
      ...product,
      categoryId: product?.categoryId || product?.category?.id || "",
    });
  };

  const handleUpdateProduct = async (values) => {
    const result = await dispatch(updateProduct({
      id: selectedProduct.id,
      dto: {
        ...values,
        categoryId: Number(values.categoryId),
      },
    }));

    if (updateProduct.fulfilled.match(result)) {
      setSelectedProduct(null);
      if (branch?.id) {
        dispatch(getInventoryByBranch(branch.id));
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-2 gap-2 px-0"
            onClick={() => navigate("/cashier")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to POS
          </Button>
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

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <InventoryTable
          inventories={[]}
          onEdit={handleOpenEditDialog}
          onEditProduct={handleOpenProductEdit}
        />
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

      <ProductEditDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

const ProductEditDialog = ({ product, onClose, onSubmit }) => {
  const categories = useSelector((state) => state.category.Categories || []);

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        {product && (
          <ProductForm
            initialValues={product}
            isEditing
            onSubmit={onSubmit}
            onCancel={onClose}
            categories={categories}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Inventory;