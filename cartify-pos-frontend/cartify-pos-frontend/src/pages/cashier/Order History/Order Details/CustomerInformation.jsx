import { Card, CardContent } from "@/components/ui/card";

const CustomerInformation = ({ selectedOrder }) => {
  if (!selectedOrder) return null;

  const customer =
    selectedOrder.customer && typeof selectedOrder.customer === "object"
      ? selectedOrder.customer
      : {
          fullName:
            selectedOrder.customer?.fullName ??
            selectedOrder.customerName ??
            selectedOrder.customer ??
            "Walk-in Customer",
          phone:
            selectedOrder.customer?.phone ??
            selectedOrder.customer?.mobile ??
            selectedOrder.customerPhone ??
            selectedOrder.phone ??
            "-",
        };

  const rows = [
    { label: "Name", value: customer.fullName || customer.name || "Walk-in Customer" },
    { label: "Phone", value: customer.phone || customer.mobile || "-" },
  ];

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <h3 className="mb-5 text-base font-semibold">
          Customer Information
        </h3>

        <div className="grid grid-cols-2 gap-x-5 gap-y-5 text-sm">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                {row.label}
              </span>
              <span className="font-medium text-base">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInformation;