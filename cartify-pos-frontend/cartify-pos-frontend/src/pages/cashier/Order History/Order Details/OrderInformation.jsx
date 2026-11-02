import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const OrderInformation = ({ selectedOrder }) => {
  const createdDate = new Date(selectedOrder.createdAt);

  const formattedDate = isNaN(createdDate)
    ? ""
    : createdDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const formattedTime = isNaN(createdDate)
    ? ""
    : createdDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

  const dateValue = `${formattedDate}${formattedTime ? `, ${formattedTime}` : ""}`;

  const rows = [
    { label: "Date", value: dateValue },
    {
      label: "Status",
      value: (
        <Badge className="min-w-20 justify-center bg-green-800 px-3 py-1 text-white capitalize hover:bg-green-800">
          {selectedOrder.status || "Pending"}
        </Badge>
      ),
    },
    { label: "Payment Method", value: selectedOrder.paymentType },
    { label: "Total Amount", value: `₹${selectedOrder.totalAmount}` },
  ];

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <h3 className="mb-5 text-base font-semibold">
          Order Information
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

export default OrderInformation;