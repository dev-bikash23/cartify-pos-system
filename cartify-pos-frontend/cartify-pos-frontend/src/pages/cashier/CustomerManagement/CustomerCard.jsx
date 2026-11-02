import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";

const CustomerCard = ({ customer, setSelectedCustomer }) => {
  const loyaltyPoints = customer.loyalPoints ?? customer.loyaltyPoints ?? 0;

  return (
    <div className="p-4 cursor-pointer hover:bg-accent" onClick={() => setSelectedCustomer(customer)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{customer.fullName}</h3>
          <p className="text-sm text-muted-foreground">
            {customer.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {customer.phone}
          </p>
        </div>

        <Badge>
          <StarIcon className="h-4 w-4 mr-1" />
          {loyaltyPoints} pts
        </Badge>
      </div>
    </div>
  );
};

export default CustomerCard;