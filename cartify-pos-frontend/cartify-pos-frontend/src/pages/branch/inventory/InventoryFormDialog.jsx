import React, { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { useSelector } from "react-redux";

const InventoryFormDialog = ({
  open,
  onOpenChange,
  mode,
  selectedInventory,
  selectedProductId,
  setSelectedProductId,
  quantity,
  setQuantity,
  onSubmit,
}) => {
  const isEdit = mode === "edit";
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const { products = [] } = useSelector((state) => state.product || {});
  const selectedProduct = products.find(
    (product) => String(product.id) === String(selectedProductId)
  );

  const filteredProducts = useMemo(() => {
    const keyword = productSearch.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter((product) => {
      const itemText = `${product.sku || ""} ${product.name || ""}`.toLowerCase();
      return itemText.includes(keyword);
    });
  }, [productSearch, products]);

  const handleSubmit = () => {
    if (!selectedProductId && !isEdit) return;
    onSubmit?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Edit Inventory" : "Add Inventory"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the stock quantity for this product."
              : "Select a product and enter the quantity."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product</label>

            {isEdit ? (
              <Input
                value={selectedInventory?.name || selectedInventory?.product?.name || ""}
                disabled
                className="bg-muted"
              />
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProductOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-sm shadow-sm transition-colors hover:border-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <span className="truncate text-foreground">
                    {selectedProduct
                      ? `${selectedProduct.sku} - ${selectedProduct.name}`
                      : "Select Product"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </button>

                {isProductOpen && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product"
                        className="w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto p-1">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedProductId(String(product.id));
                              setProductSearch("");
                              setIsProductOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                              String(product.id) === String(selectedProductId)
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/60"
                            }`}
                          >
                            <span className="truncate">{product.sku} - {product.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-sm text-muted-foreground">
                          No product found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>

            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <DialogFooter className="border-t bg-muted/30 px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
          >
            {isEdit ? "Update Inventory" : "Add Inventory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;