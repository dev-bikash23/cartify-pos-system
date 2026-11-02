import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PlanForm from "./PlanForm";
import { FEATURES_FIELDS } from "./FeaturesSwitchGrid";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Plan name is required"),
  description: Yup.string().trim().required("Description is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  billingCycle: Yup.string().required("Billing cycle is required"),
  maxBranches: Yup.number()
    .typeError("Must be a number")
    .min(1, "Must be at least 1")
    .required("Required"),
  maxUsers: Yup.number()
    .typeError("Must be a number")
    .min(1, "Must be at least 1")
    .required("Required"),
  maxProducts: Yup.number()
    .typeError("Must be a number")
    .min(1, "Must be at least 1")
    .required("Required"),
});

const getInitialValues = (plan) => {
  const base = {
    name: "",
    description: "",
    price: "",
    billingCycle: "MONTHLY",
    maxBranches: "",
    maxUsers: "",
    maxProducts: "",
    extraFeatures: [""],
  };

  FEATURES_FIELDS.forEach((f) => {
    base[f.key] = false;
  });

  if (!plan) return base;

  return {
    ...base,
    ...plan,
    extraFeatures: plan.extraFeatures?.length ? plan.extraFeatures : [""],
  };
};

const EditPlanDialog = ({ open, onOpenChange, plan, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Plan</DialogTitle>
        </DialogHeader>

        {plan && (
          <Formik
            enableReinitialize
            initialValues={getInitialValues(plan)}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              onSubmit({ ...plan, ...values });
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
              <>
                <PlanForm values={values} setFieldValue={setFieldValue} />

                <DialogFooter className="mt-4 flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Updating..." : "Update Plan"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPlanDialog;