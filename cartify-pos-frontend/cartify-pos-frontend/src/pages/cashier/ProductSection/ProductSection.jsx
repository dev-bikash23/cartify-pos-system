import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Barcode } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from "react-redux";
import { getProductsByStore } from '@/Redux Toolkit/features/Product/productThunk';

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

const fallbackProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400",
    name: "Men's Cotton Casual Over Size T-Shirt",
    sku: "SHIRT-M-COTTON-BLU-2025",
    category: { name: "Shirt" },
    sellingPrice: 899,
  },
  {
    id: 53,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    name: "shoes",
    sku: "SHOES-BLU-2025",
    category: { name: "Shoes" },
    sellingPrice: 1499,
  },
  {
    id: 102,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    name: "shirts",
    sku: "SHIRTS-BLU-2025",
    category: { name: "Shirts" },
    sellingPrice: 999,
  },
];

const ProductSection = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    if (branch?.storeId) {
      dispatch(getProductsByStore({ storeId: branch.storeId }));
    }
  }, [branch, dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const productsToDisplay = products?.length ? products : fallbackProducts;

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
          <span>{filteredProducts.length} products found</span>
          <Button variant="outline" size="sm" className="text-xs">
            <Barcode className="mr-1 h-4 w-4" />
            Scan
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 p-5 overflow-y-auto">
        {filteredProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;