import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, User } from "lucide-react";
import CustomerDialog from "./CustomerDialog";
import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedCustomer } from "@/Redux Toolkit/features/Cart/cartSlice";

const CustomerSection = () => {
  const [showCustomerDialog, setShowCustomerDialog] = React.useState(false);
  const selectedCustomer = useSelector(selectSelectedCustomer);

  
  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <User className="w-5 h-5 mr-2" />
        Customer
      </h2>

      {selectedCustomer ? (
        <Card className="border-green-600 bg-green-50 dark:bg-green-700 dark:border-green-700">
          <CardContent className="p-3 flex items-center justify-between gap-5">
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200">
                {selectedCustomer.fullName}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                {selectedCustomer.phone}
              </p>
            </div>

            <Button
              onClick={() => setShowCustomerDialog(true)}
              variant="outline"
              size="icon"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setShowCustomerDialog(true)}
          variant="outline"
          className="w-full py-5"
        >
          Select Customer
        </Button>
      )}

      <CustomerDialog
        showCustomerDialog={showCustomerDialog}
        setShowCustomerDialog={setShowCustomerDialog}
      />
    </div>
  );
};

export default CustomerSection;