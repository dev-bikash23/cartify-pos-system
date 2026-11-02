import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTotal,
  selectCartItems,
  clearCart,
  selectSelectedCustomer,
  selectNote,
  selectDiscount,
} from "@/Redux Toolkit/features/Cart/cartSlice";
import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/Redux Toolkit/features/Order/orderThunk";
import { toast } from "sonner";

const loadRazorpayCheckout = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = resolve;
  script.onerror = () => reject(new Error("Could not load Razorpay Checkout"));
  document.body.appendChild(script);
});

const paymentMethods = [
  { id: 1, name: "Card", key: "CARD", icon: CreditCard },
  { id: 2, name: "UPI", key: "UPI", icon: Smartphone },
  { id: 3, name: "Cash", key: "CASH", icon: Wallet },
];

const PaymentDialog = ({ showPaymentDialog, setShowPaymentDialog }) => {
  const [paymentMethod, setPaymentMethod] = React.useState("CARD");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const dispatch = useDispatch();
  const totalAmount = useSelector(selectTotal);
  const cartItems = useSelector(selectCartItems);
  const { branch } = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const note = useSelector(selectNote);
  const discount = useSelector(selectDiscount);

  const handlePay = async () => {
    if (cartItems.length === 0) {
      toast.error("Please add an item to the cart before processing payment");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Please select a customer before processing payment");
      return;
    }

    setIsProcessing(true);
    let checkoutOpened = false;
    try {
      const orderData = {
        totalAmount,
        branchId: branch?.id,
        cashierId: userProfile?.id,
        customerId: selectedCustomer.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.sellingPrice * item.quantity,
        })),
        paymentType: paymentMethod,
        discountType: discount.type,
        discountValue: Number(discount.value),
        note,
      };

      if (paymentMethod === "CASH") {
        await dispatch(createOrder(orderData)).unwrap();
        toast.success("Cash payment recorded and order completed");
        dispatch(clearCart());
        setShowPaymentDialog(false);
        return;
      }

      const checkout = await dispatch(createRazorpayOrder(orderData)).unwrap();
      await loadRazorpayCheckout();
      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "Cartify Shopping Mall",
        description: "POS order payment",
        order_id: checkout.razorpayOrderId,
        method: {
          card: paymentMethod === "CARD",
          upi: paymentMethod === "UPI",
        },
        handler: async (response) => {
          try {
            await dispatch(verifyRazorpayPayment({
              orderId: checkout.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })).unwrap();
            toast.success("Payment verified and order completed");
            dispatch(clearCart());
            setShowPaymentDialog(false);
          } catch (error) {
            toast.error(error || "Payment could not be verified. Contact support before retrying.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });

      razorpay.on("payment.failed", (event) => {
        toast.error(event?.error?.description || "Payment failed. No order was completed.");
        setIsProcessing(false);
      });
      checkoutOpened = true;
      razorpay.open();
    } catch (error) {
      const message = typeof error === "string" ? error : error?.message;
      if (message?.toLowerCase().includes("razorpay") || message?.toLowerCase().includes("configure")) {
        toast.error("Card and UPI payments are not configured. Ask an administrator to add Razorpay test credentials, or select Cash.");
      } else {
        toast.error(message || "Could not start payment");
      }
    } finally {
      if (!checkoutOpened) setIsProcessing(false);
    }
  };

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600">
              ₹{totalAmount.toFixed(2)}
            </h2>
            <p className="text-muted-foreground">Amount to be paid</p>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Button
                  key={method.id}
                  variant="outline"
                  className={`w-full justify-start h-12 ${
                    paymentMethod === method.key
                      ? "bg-green-600 text-white hover:bg-green-700 border-green-600"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod(method.key)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {method.name}
                </Button>
              );
            })}
          </div>

          <Button
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handlePay}
            disabled={cartItems.length === 0 || isProcessing}
          >
            {isProcessing
              ? "Waiting for payment..."
              : paymentMethod === "CASH"
                ? `Record cash payment ₹${totalAmount.toFixed(2)}`
                : `Pay ₹${totalAmount.toFixed(2)} securely`}
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowPaymentDialog(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;