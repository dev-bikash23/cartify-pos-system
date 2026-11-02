import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/Redux Toolkit/features/Cart/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch=useDispatch();

  const handleAddProductToCart=()=>{
    dispatch(addToCart(product))
  }
  return (
    <Card onClick={handleAddProductToCart} className="py-4">
      <CardContent>
        <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={product?.image || "https://placehold.co/200x200?text=No+Image"}
            alt={product?.name || "Product"}
            onError={(e) => {
              e.target.src = "https://placehold.co/200x200?text=No+Image";
            }}
          />
        </div>

        <div>
          <h3 className="font-medium text-sm truncate">{product?.name}</h3>
          <p className="text-xs text-muted-foreground">{product?.sku}</p>

          <div className="flex items-center justify-between mt-1">
            <p className="font-semibold text-green-700">
              ${product?.sellingPrice}
            </p>
            <Badge variant="secondary" className="text-xs">
              {product?.category?.name || "No Category"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;