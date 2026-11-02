import { Button } from '@/components/ui/button';
import { Pause, CreditCard } from 'lucide-react';
import React from 'react';
import PaymentDialog from './PaymentDialog';
import { useDispatch, useSelector } from 'react-redux';
import {
  holdOrder,
  selectCartItems,
  selectTotal,
  selectSelectedCustomer,
} from '@/Redux Toolkit/features/Cart/cartSlice';
import { toast } from 'sonner';

const PaymentSection = () => {
  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectTotal);
  const selectedCustomer = useSelector(selectSelectedCustomer);

  const handleHoldOrder = () => {
    dispatch(holdOrder());
  };

  const handleProcessPayment = () => {
    if (!selectedCustomer) {
      toast.error('Select a customer before starting payment');
      return;
    }
    setShowPaymentDialog(true);
  };

  return (
    <div className="flex flex-1 flex-col p-4 justify-end">
      <div className="space-y-4">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-300">
            ${total.toFixed(2)}
          </h1>
          <p className="text-sm text-muted-foreground">Total Amount</p>
        </div>

        <div>
          <div className="mb-3">
            <Button
              onClick={handleProcessPayment}
              disabled={cartItems.length === 0}
              className="w-full py-3 text-lg font-semibold"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Process payment
            </Button>
          </div>

          <div>
            <Button
              onClick={handleHoldOrder}
              variant="outline"
              disabled={cartItems.length === 0}
              className="w-full py-3 text-lg font-semibold"
            >
              <Pause className="w-5 h-5 mr-2" />
              Hold Order
            </Button>
          </div>
        </div>

      </div>

      <PaymentDialog
        showPaymentDialog={showPaymentDialog}
        setShowPaymentDialog={setShowPaymentDialog}
      />
    </div>
  );
};

export default PaymentSection;