import React from "react";
import { CheckCircle, Store, Users, Package, Sparkles, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  activateFreeStoreSubscription,
  createStoreSubscriptionCheckout,
  getAvailableSubscriptionPlans,
  getCurrentStoreSubscription,
  verifyStoreSubscriptionPayment,
} from "@/Redux Toolkit/features/Subscription Plan/subscriptionPlanThunk";

const featureFlags = [
  ["enableAdvancedReport", "Advanced Reports"],
  ["enableInventory", "Inventory System"],
  ["enableIntegrations", "Integrations"],
  ["enableEcommerce", "eCommerce"],
  ["enableInvoiceBranding", "Invoice Branding"],
  ["prioritySupport", "Priority Support"],
  ["enableMultiLocation", "Multi-Location"],
];

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

const planFeatures = (plan) => [...new Set([
  `Up to ${plan.maxBranches} branches`,
  `Up to ${plan.maxUsers} users`,
  `Up to ${Number(plan.maxProducts).toLocaleString("en-IN")} products`,
  ...featureFlags.filter(([key]) => plan[key]).map(([, label]) => label),
  ...(plan.extraFeatures || []).filter(Boolean),
])];

const Upgrade = () => {
  const dispatch = useDispatch();
  const { plans, currentSubscription, loading } = useSelector((state) => state.subscriptionPlan);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    dispatch(getAvailableSubscriptionPlans());
    dispatch(getCurrentStoreSubscription());
  }, [dispatch]);

  const currentPlan = currentSubscription?.plan;

  const handlePurchase = async () => {
    if (!selectedPlan || isProcessing) return;
    setIsProcessing(true);
    let checkoutOpened = false;
    try {
      if (Number(selectedPlan.price) === 0) {
        const activeSubscription = await dispatch(activateFreeStoreSubscription(selectedPlan.id)).unwrap();
        toast.success(`${activeSubscription.plan.name} free plan activated`);
        setIsConfirmOpen(false);
        setSelectedPlan(null);
        return;
      }

      const checkout = await dispatch(createStoreSubscriptionCheckout(selectedPlan.id)).unwrap();
      await loadRazorpayCheckout();
      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "Cartify Shopping Mall",
        description: `${selectedPlan.name} subscription`,
        order_id: checkout.razorpayOrderId,
        handler: async (response) => {
          try {
            const activeSubscription = await dispatch(verifyStoreSubscriptionPayment({
              subscriptionId: checkout.subscriptionId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })).unwrap();
            toast.success(`${activeSubscription.plan.name} plan activated`);
            setIsConfirmOpen(false);
            setSelectedPlan(null);
          } catch (error) {
            toast.error(error || "Payment completed but plan activation could not be verified");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });
      razorpay.on("payment.failed", (event) => {
        toast.error(event?.error?.description || "Subscription payment failed");
        setIsProcessing(false);
      });
      checkoutOpened = true;
      razorpay.open();
    } catch (error) {
      toast.error(error || "Could not start subscription checkout");
    } finally {
      if (!checkoutOpened) setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Upgrade Your Subscription</h1>
        <p className="mt-2 text-muted-foreground">Choose a plan for your store</p>
      </header>

      <section className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-green-200 bg-green-50 px-5 py-4 text-sm">
        <CheckCircle className="h-6 w-6 shrink-0 text-green-700" />
        <strong className="text-base text-green-900">
          Current Plan: {currentPlan?.name || "No active plan"}
        </strong>
        <span className="text-green-800">Status: {currentSubscription?.status || "Not subscribed"}</span>
        {currentSubscription?.expiresAt && (
          <span className="text-green-800">
            Renews/expires: {new Date(currentSubscription.expiresAt).toLocaleDateString("en-IN")}
          </span>
        )}
      </section>

      {loading && plans.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">Loading subscription plans...</p>
      ) : plans.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No active subscription plans are available.</p>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan?.id === plan.id;
            const isPopular = plan.name?.toLowerCase() === "pro";
            return (
              <article
                key={plan.id}
                className={`relative flex flex-col border bg-card p-6 shadow-sm ${
                  isCurrent ? "border-green-600 ring-2 ring-green-600" : "border-border"
                }`}
              >
                {(isCurrent || isPopular) && (
                  <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${isCurrent ? "bg-green-700" : ""}`}>
                    {isCurrent ? "Your Plan" : <><Sparkles className="mr-1 h-3.5 w-3.5" />Popular</>}
                  </Badge>
                )}
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold">{plan.name}</h2>
                  <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.description}</p>
                  <p className="mt-4 text-3xl font-bold">
                    ₹{Number(plan.price).toLocaleString("en-IN")}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      /{plan.billingCycle?.toLowerCase()}
                    </span>
                  </p>
                </div>
                <div className="mb-6 grid grid-cols-1 gap-3 border-y py-5 text-sm">
                  <p className="flex items-center gap-2"><Store className="h-4 w-4 text-blue-600" />{plan.maxBranches} branches</p>
                  <p className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" />{plan.maxUsers} users</p>
                  <p className="flex items-center gap-2"><Package className="h-4 w-4 text-orange-600" />{Number(plan.maxProducts).toLocaleString("en-IN")} products</p>
                </div>
                <div className="mb-7 flex-1">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Star className="h-4 w-4 text-yellow-600" />Included features</h3>
                  <ul className="space-y-2">
                    {planFeatures(plan).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || loading}
                  onClick={() => { setSelectedPlan(plan); setIsConfirmOpen(true); }}
                >
                  {isCurrent
                    ? "Current Plan"
                    : Number(plan.price) === 0
                      ? `Activate Free ${plan.name}`
                      : `Choose ${plan.name}`}
                </Button>
              </article>
            );
          })}
        </section>
      )}

      <Dialog open={isConfirmOpen} onOpenChange={(open) => !isProcessing && setIsConfirmOpen(open)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review plan and payment</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {Number(selectedPlan.price) === 0
                  ? `Activate the ${selectedPlan.name} plan now at no cost.`
                  : `You’ll be charged ₹${Number(selectedPlan.price).toLocaleString("en-IN")} now for the ${selectedPlan.billingCycle?.toLowerCase()} ${selectedPlan.name} plan.`}
              </p>
              <div className="border-y py-4">
                <h3 className="mb-3 text-sm font-semibold">Included with this plan</h3>
                <ul className="space-y-2">
                  {planFeatures(selectedPlan).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" disabled={isProcessing} onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button disabled={isProcessing || !selectedPlan} onClick={handlePurchase}>
              {isProcessing
                ? Number(selectedPlan?.price) === 0 ? "Activating plan..." : "Opening secure checkout..."
                : Number(selectedPlan?.price) === 0
                  ? "Activate Free Plan"
                  : `Pay ₹${Number(selectedPlan?.price || 0).toLocaleString("en-IN")}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upgrade;