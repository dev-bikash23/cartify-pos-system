import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createRefunds } from "@/Redux Toolkit/features/Refund/refundThunk";

const returnReasons = [
  "Damaged Product",
  "Wrong Product Received",
  "Defective Item",
  "Product Not As Described",
  "Changed My Mind",
  "Other",
];

const refundMethods = ["UPI", "Card", "Cash"];

const ReturnItemSection = ({ selectedOrder, setShowReturnReceiptDialog }) => {
  const [returnReason, setReturnReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("UPI");

  const isFormValid =
    returnReason &&
    (returnReason !== "Other" || otherReason.trim().length > 0);

    const branch = useSelector((state) => state.branch?.branch)
    const userProfile = useSelector((state) => state.user?.userProfile)
    const activeShift = useSelector((state) => state.shiftReport?.currentShifts)
    const dispatch=useDispatch();

    const processRefund =()=>{
       setShowReturnReceiptDialog(true)
       const refundDTO={
        orderId:selectedOrder.id,
        branchId:branch?.id ?? userProfile?.branchId,
        cashierId:userProfile?.id,
        shiftReportId:activeShift?.id,
        amount:selectedOrder?.totalAmount ?? 0,
        refundAmount:selectedOrder?.totalAmount ?? 0,
        reason:returnReason,
        paymentType:refundMethod.toUpperCase()
      }
      console.log("processed refund ",refundDTO)
      dispatch(createRefunds(refundDTO))
    }

    

  return (

    <div className="w-1/2 p-4">
      <Card className="mt-2 shadow-sm rounded-lg">
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Return Details</h2>
            <p className="text-xs text-muted-foreground">
              Select the return reason and refund method.
            </p>
          </div>

          {/* Return Reason */}
          <div className="space-y-2">
            <Label htmlFor="return-reason">Return Reason</Label>

            <Select
              value={returnReason}
              onValueChange={setReturnReason}
            >
              <SelectTrigger
                id="return-reason"
                className="w-full"
              >
                <SelectValue placeholder="Select a return reason" />
              </SelectTrigger>

              <SelectContent>
                {returnReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Other Reason */}
          {returnReason === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="other-reason">
                Specify Reason
              </Label>

              <Textarea
                id="other-reason"
                className="min-h-16"
                placeholder="Please describe the return reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            </div>
          )}

          {/* Refund Method */}
          <div className="space-y-2">
            <Label htmlFor="refund-method">
              Refund Method
            </Label>

            <Select
              value={refundMethod}
              onValueChange={setRefundMethod}
            >
              <SelectTrigger
                id="refund-method"
                className="w-full"
              >
                <SelectValue placeholder="Select refund method" />
              </SelectTrigger>

              <SelectContent>
                {refundMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Refund Summary */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-base">
                Total Refund Amount
              </span>

              <span className="text-xl font-bold text-green-600">
                ₹{selectedOrder?.totalAmount ?? 0}
              </span>
            </div>

            <Button onClick={processRefund}
              className="w-full h-10"
              
            >
              Process Refund
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnItemSection;