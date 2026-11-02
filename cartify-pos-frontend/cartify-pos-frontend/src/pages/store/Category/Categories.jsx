import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RotateCcw } from "lucide-react";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";
import {
  createCategory,
  deleteCategory,
  getCategoryByStore,
  updateCategory,
} from "@/Redux Toolkit/features/Category/categoryThunk";

const Categories = () => {
  const dispatch = useDispatch();
  const { Categories: categories, loading, error } = useSelector((state) => state.category);
  const store = useSelector((state) => state.store.store);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getStoreByAdmin()).then((result) => {
      if (getStoreByAdmin.fulfilled.match(result) && result.payload?.id) {
        dispatch(getCategoryByStore({ storeId: result.payload.id }));
      }
    });
  }, [dispatch]);

  // Add Category
  const handleAddCategory = async (values) => {
    if (!store?.id) return;
    const result = await dispatch(createCategory({
      dto: { name: values.name, description: values.description, storeId: store.id },
    }));
    if (createCategory.fulfilled.match(result)) setIsAddDialogOpen(false);
  };

  // Edit Button
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  // Update Category
  const handleUpdateCategory = async (values) => {
    const result = await dispatch(updateCategory({
      id: selectedCategory.id,
      dto: { name: values.name, description: values.description, storeId: store.id },
    }));
    if (updateCategory.fulfilled.match(result)) {
      setSelectedCategory(null);
      setIsEditDialogOpen(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = (category) => {
    if (window.confirm(`Delete "${category.name}"?`)) {
      dispatch(deleteCategory({ id: category.id }));
    }
  };

  const handleRefresh = async () => {
    const result = await dispatch(getStoreByAdmin());
    const storeId = result.payload?.id || store?.id;
    if (storeId) await dispatch(getCategoryByStore({ storeId }));
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize your products into categories
          </p>
        </div>

        <div className="flex gap-2">
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" disabled={!store?.id}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[560px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>

            <CategoryForm
              onSubmit={handleAddCategory}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <CategoryTable
            categories={categories}
            loading={loading}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[560px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          {selectedCategory && (
            <CategoryForm
              initialValues={selectedCategory}
              isEditing
              onSubmit={handleUpdateCategory}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Categories;