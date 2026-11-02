import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { selectDiscount, setDiscount } from '@/Redux Toolkit/features/Cart/cartSlice';
import { Tag } from 'lucide-react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const DiscountSection = () => {
  const dispatch = useDispatch();
  const discount = useSelector(selectDiscount);

  const handleDiscountChange = (e) => {
    const value = Number(e.target.value);
    dispatch(setDiscount({ ...discount, value }));
  };

  const handleTypeChange = (type) => {
    dispatch(setDiscount({ ...discount, type }));
  };

  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Tag className="w-5 h-5 mr-2" /> Discount
      </h2>
      <div className="space-y-3">
        <Input
          placeholder="Enter discount amount"
          type="number"
          min={0}
          value={discount.value}
          onChange={handleDiscountChange}
        />

        <div className="flex gap-5">
          <Button
            type="button"
            className="flex-1"
            onClick={() => handleTypeChange("percentage")}
            variant={discount.type === "percentage" ? "default" : "outline"}
          >
            %
          </Button>

          <Button
            type="button"
            className="flex-1"
            onClick={() => handleTypeChange("fixed")}
            variant={discount.type === "fixed" ? "default" : "outline"}
          >
            $
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;