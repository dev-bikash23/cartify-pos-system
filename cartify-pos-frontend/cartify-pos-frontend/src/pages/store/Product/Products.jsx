import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Plus,
  RotateCcw,
  Search,
  Package,
} from "lucide-react";

import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import { createProduct, deleteProduct, getProductsByStore, updateProduct } from "@/Redux Toolkit/features/Product/productThunk";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";
import { getCategoryByStore } from "@/Redux Toolkit/features/Category/categoryThunk";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const categories = useSelector((state) => state.category.Categories || []);
  const store = useSelector((state) => state.store.store);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (storeId) => {
    if (!storeId) return;
    return Promise.all([
      dispatch(getProductsByStore({ storeId })),
      dispatch(getCategoryByStore({ storeId })),
    ]);
  };

  useEffect(() => {
    dispatch(getStoreByAdmin()).then((result) => {
      if (getStoreByAdmin.fulfilled.match(result)) {
        loadData(result.payload?.id);
      }
    });
  }, [dispatch]);

  // ---------------- Add ----------------
  const handleAddProduct = async (values) => {
    if (!store?.id) return;
    const result = await dispatch(createProduct({
      ...values,
      storeId: store.id,
      categoryId: Number(values.categoryId),
    }));
    if (createProduct.fulfilled.match(result)) {
      setIsAddDialogOpen(false);
      await loadData(store.id);
    }
  };

  // ---------------- Edit ----------------
  const handleEditProduct = (product) => {
    setSelectedProduct({
      ...product,
      categoryId: product.categoryId || product.category?.id || "",
    });
    setIsEditDialogOpen(true);
  };

  // ---------------- Update ----------------
  const handleUpdateProduct = async (values) => {
    const result = await dispatch(updateProduct({
      id: selectedProduct.id,
      dto: { ...values, categoryId: Number(values.categoryId) },
    }));
    if (updateProduct.fulfilled.match(result)) {
      setSelectedProduct(null);
      setIsEditDialogOpen(false);
      await loadData(store.id);
    }
  };

  // ---------------- Delete ----------------
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Delete ${product.name} ?`)) {
      const result = await dispatch(deleteProduct(product.id));
      if (deleteProduct.fulfilled.match(result)) {
        await loadData(store.id);
      }
    }
  };

  // ---------------- Refresh ----------------
  const handleRefresh = async () => {
    setSearch("");
    setIsRefreshing(true);
    try {
      const result = await dispatch(getStoreByAdmin());
      if (getStoreByAdmin.fulfilled.match(result) && result.payload?.id) {
        await loadData(result.payload.id);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // ---------------- Search ----------------
  const filteredProducts = products.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.brand?.toLowerCase().includes(keyword) ||
      (item.category?.name || "").toLowerCase().includes(keyword) ||
      item.sku?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="text-green-600" />
            Product Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all products of your POS System
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Toolbar */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 justify-between">

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {loading || isRefreshing ? "Loading..." : "Refresh"}
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" disabled={!store?.id}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                  </DialogHeader>

                  <ProductForm
                    onSubmit={handleAddProduct}
                    onCancel={() => setIsAddDialogOpen(false)}
                    categories={categories}
                  />
                </DialogContent>
              </Dialog>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-5">
          <ProductTable
            products={filteredProducts}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <ProductForm
              initialValues={selectedProduct}
              isEditing
              onSubmit={handleUpdateProduct}
              onCancel={() => setIsEditDialogOpen(false)}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Products;