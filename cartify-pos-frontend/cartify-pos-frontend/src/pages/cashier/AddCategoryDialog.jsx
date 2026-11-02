import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "@/pages/store/Category/CategoryForm";
import { createCategory, getCategoryByStore } from "@/Redux Toolkit/features/Category/categoryThunk";

const AddCategoryDialog = ({ branch }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const storeId = branch?.storeId ?? branch?.store?.id;

  const handleOpen = () => {
    if (!storeId) {
      toast.error("Branch store information is not available");
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    const result = await dispatch(createCategory({
      dto: {
        name: values.name.trim(),
        description: values.description.trim(),
        storeId,
      },
    }));

    if (createCategory.fulfilled.match(result)) {
      await dispatch(getCategoryByStore({ storeId }));
      setOpen(false);
      toast.success(`${result.payload.name} added successfully`);
    } else {
      toast.error(result.payload || "Category creation failed");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition-all hover:bg-gray-100"
      >
        <FolderPlus size={20} />
        <span className="font-medium">Add Category</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCategoryDialog;
