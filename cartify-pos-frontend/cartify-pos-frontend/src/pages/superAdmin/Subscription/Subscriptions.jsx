import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import AddPlanDialog from "./AddPlanDialog";
import EditPlanDialog from "./EditPlanDialog";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getAllSubscriptionPlans,
  updateSubscriptionPlan,
} from "@/Redux Toolkit/features/Subscription Plan/subscriptionPlanThunk";

const initialPlans = [
  {
    id: 1,
    name: "Basic",
    description: "Best for small stores",
    price: 599,
    billingCycle: "MONTHLY",
    maxBranches: 1,
    maxUsers: 3,
    maxProducts: 200,
    status: "Active",
    extraFeatures: ["API Integration"],
  },
  {
    id: 2,
    name: "Pro",
    description: "For growing businesses",
    price: 2999,
    billingCycle: "MONTHLY",
    maxBranches: 5,
    maxUsers: 15,
    maxProducts: 2000,
    status: "Active",
    extraFeatures: ["API Integration", "Priority Support"],
  },
  {
    id: 3,
    name: "Advance",
    description: "For established chains",
    price: 5999,
    billingCycle: "YEARLY",
    maxBranches: 20,
    maxUsers: 50,
    maxProducts: 10000,
    status: "Inactive",
    extraFeatures: ["API Integration", "Priority Support", "Dedicated Manager"],
  },
];

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state) => state.subscriptionPlan);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllSubscriptionPlans());
  }, [dispatch]);

  const handleAddSubmit = async (values) => {
    try {
      await dispatch(createSubscriptionPlan({ ...values, status: "Active" })).unwrap();
      toast.success("Subscription plan created");
      setIsAddOpen(false);
    } catch (error) {
      toast.error(error || "Could not create the plan");
    }
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (updatedPlan) => {
    try {
      await dispatch(updateSubscriptionPlan({ id: updatedPlan.id, plan: updatedPlan })).unwrap();
      toast.success("Subscription plan updated");
      setIsEditOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      toast.error(error || "Could not update the plan");
    }
  };

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteSubscriptionPlan(selectedPlan.id)).unwrap();
      toast.success("Plan deactivated; existing subscribers remain unchanged");
      setIsDeleteOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      toast.error(error || "Could not deactivate the plan");
    }
  };

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Manage pricing plans available to stores
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Plans</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="min-w-[160px]">Name</TableHead>
                  <TableHead className="min-w-[140px]">Price</TableHead>
                  <TableHead className="min-w-[150px]">Billing Cycle</TableHead>
                  <TableHead className="text-center min-w-[110px]">Branches</TableHead>
                  <TableHead className="text-center min-w-[100px]">Users</TableHead>
                  <TableHead className="text-center min-w-[110px]">Products</TableHead>
                  <TableHead className="text-center min-w-[110px]">Status</TableHead>
                  <TableHead className="text-center min-w-[130px]">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-muted-foreground"
                    >
                      {loading ? "Loading subscription plans..." : "No Subscription Plans Found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-muted/30">
                      <TableCell>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {plan.description}
                        </p>
                      </TableCell>

                      <TableCell className="font-semibold text-green-600">
                        ₹{Number(plan.price).toLocaleString("en-IN")}
                      </TableCell>

                      <TableCell className="capitalize">
                        {plan.billingCycle?.toLowerCase()}
                      </TableCell>

                      <TableCell className="text-center">{plan.maxBranches}</TableCell>
                      <TableCell className="text-center">{plan.maxUsers}</TableCell>
                      <TableCell className="text-center">
                        {plan.maxProducts.toLocaleString("en-IN")}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={
                            plan.status === "Active"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-gray-100 text-gray-600 border-gray-300"
                          }
                        >
                          {plan.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-center items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditClick(plan)}
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteClick(plan)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add */}
      <AddPlanDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddSubmit}
      />

      {/* Edit */}
      <EditPlanDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        plan={selectedPlan}
        onSubmit={handleEditSubmit}
      />

      {/* Delete confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Plan</DialogTitle>
          </DialogHeader>

          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedPlan?.name}</span>?
          </p>
          <p className="text-sm text-muted-foreground">
            Existing subscribers won't be affected, but this plan will no
            longer be available for new signups.
          </p>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Subscriptions;