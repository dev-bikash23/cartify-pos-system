import React from "react";
import { useSelector } from "react-redux";
import {
  selectSubtotal,
  selectTax,
  selectDiscountAmount,
  selectTotal,
  selectDiscount,
} from "@/Redux Toolkit/features/Cart/cartSlice";

const CartSummary = () => {
  const subtotal = useSelector(selectSubtotal);
  const tax = useSelector(selectTax);
  const discountAmount = useSelector(selectDiscountAmount);
  const total = useSelector(selectTotal);
  const discount = useSelector(selectDiscount);

  return (
    <div className="p-4 border-t space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Tax (18%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between text-sm text-red-600">
          <span>
            Discount
            {discount.type === "percentage" ? ` (${discount.value}%)` : ""}
          </span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between text-base font-semibold pt-2 border-t">
        <span>Total</span>
        <span className="text-green-600">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;