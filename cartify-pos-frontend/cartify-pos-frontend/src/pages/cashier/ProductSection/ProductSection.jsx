import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Barcode, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from "react-redux";
import { getProductsByStore } from '@/Redux Toolkit/features/Product/productThunk';
import { addToCart } from '@/Redux Toolkit/features/Cart/cartSlice';
import { toast } from 'sonner';

// const products=[{
//   id:1,
//   image:"https://images.pexels.com/photos/5264910/pexels-photo-5264910.jpeg",
//   name:"Product Name",
//   sku: "SKU12345",
//   sellingPrice:"899",
//   category:"men_shirt"

// },

//  {
//   id:1,
//   image:"https://images.pexels.com/photos/5264910/pexels-photo-5264910.jpeg",
//   name:"Product Name",
//   sku: "SKU12345",
//   sellingPrice:"899",
//   category:"men_shirt"
// },
// {
//   id:1,
//   image:"https://images.pexels.com/photos/5264910/pexels-photo-5264910.jpeg",
//   name:"Product Name",
//   sku: "SKU12345",
//   sellingPrice:"899",
//   category:"men_shirt"

// }]

const ProductSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const scanInputRef = useRef(null);

  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { products, loading, error } = useSelector((state) => state.product);
  const storeId = branch?.storeId ?? branch?.store?.id;

  const loadProducts = useCallback(() => {
    if (storeId) {
      dispatch(getProductsByStore({ storeId }));
    }
  }, [dispatch, storeId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        loadProducts();
      }
    };

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loadProducts]);

  useEffect(() => {
    if (isScanning) scanInputRef.current?.focus();
  }, [isScanning]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const productsToDisplay = products || [];

  const handleScan = (event) => {
    if (event.key !== "Enter") return;
    const code = event.currentTarget.value.trim().toLowerCase();
    if (!code) return;

    const skuMatch = productsToDisplay.find((item) =>
      item.sku?.trim().toLowerCase() === code
    );
    const nameMatches = productsToDisplay.filter((item) =>
      item.name?.trim().toLowerCase() === code
    );
    const product = skuMatch || (nameMatches.length === 1 ? nameMatches[0] : null);

    if (!product && nameMatches.length > 1) {
      toast.error("More than one product has that name. Scan or enter its exact SKU.");
      event.currentTarget.select();
      return;
    }
    if (!product) {
      toast.error(`No product found for barcode or SKU "${event.currentTarget.value.trim()}"`);
      event.currentTarget.select();
      return;
    }

    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
    event.currentTarget.value = "";
    setIsScanning(false);
  };

  const filteredProducts = productsToDisplay.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.sku?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-2/5 flex flex-col bg-card border-r">
      <div className="p-4 border-b bg-muted">
        <Input
          className="py-5"
          placeholder="Search products....."
          value={searchTerm}
          type="text"
          onChange={handleSearchChange}
        />

        <div className="flex items-center justify-between p-2">
          <span>
            {loading ? "Loading products..." : `${filteredProducts.length} products found`}
          </span>
          <Button type="button" variant={isScanning ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setIsScanning((value) => !value)}>
            <Barcode className="mr-1 h-4 w-4" />
            {isScanning ? "Close scanner" : "Scan"}
          </Button>
        </div>
        {isScanning && (
          <div className="border-t bg-background p-3">
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="barcode-scanner" className="text-xs font-medium">Scan barcode or enter SKU</label>
              <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setIsScanning(false)} aria-label="Close scanner">
                <X className="h-4 w-4" />
              </button>
            </div>
            <Input
              ref={scanInputRef}
              id="barcode-scanner"
              autoComplete="off"
              placeholder="Scan, then press Enter"
              onKeyDown={handleScan}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">USB barcode scanners type the code here automatically.</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 p-5 overflow-y-auto">
        {error ? (
          <p className="col-span-full p-4 text-sm text-destructive">
            Unable to load products: {error}
          </p>
        ) : !storeId ? (
          <p className="col-span-full p-4 text-sm text-muted-foreground">
            Branch information is still loading.
          </p>
        ) : !loading && filteredProducts.length === 0 ? (
          <p className="col-span-full p-4 text-sm text-muted-foreground">
            No products are available for this branch.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))
        )}
      </div>

    </div>
  );
};

export default ProductSection;