import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "@/pages/store/Product/ProductForm";
import { createProduct } from "@/Redux Toolkit/features/Product/productThunk";
import { getCategoryByStore } from "@/Redux Toolkit/features/Category/categoryThunk";

const AddProductDialog = ({ branch }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const categories = useSelector((state) => state.category.Categories || []);
  const storeId = branch?.storeId ?? branch?.store?.id;

  const handleOpen = () => {
    if (!storeId) {
      toast.error("Branch store information is not available");
      return;
    }
    dispatch(getCategoryByStore({ storeId }));
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    const result = await dispatch(createProduct({
      ...values,
      storeId,
      categoryId: Number(values.categoryId),
    }));

    if (createProduct.fulfilled.match(result)) {
      setOpen(false);
      toast.success(`${result.payload.name} added successfully`);
    } else {
      toast.error(result.payload || "Product creation failed");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition-all hover:bg-gray-100"
      >
        <Plus size={20} />
        <span className="font-medium">Add Product</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            categories={categories}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
