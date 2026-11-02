import { Field, Form } from "formik";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import FeaturesSwitchGrid from "./FeaturesSwitchGrid";
import ExtraFeaturesList from "./ExtraFeaturesList";

const BILLING_CYCLE = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
];

const PlanForm = ({ values, setFieldValue }) => {
  const handleFeatureSwitch = (key, value) => {
    setFieldValue(key, value);
  };

  const handleExtraFeatureChange = (idx, value) => {
    const arr = [...values.extraFeatures];
    arr[idx] = value;
    setFieldValue("extraFeatures", arr);
  };

  const handleRemoveExtraFeature = (idx) => {
    const arr = values.extraFeatures.filter((_, i) => i !== idx);
    setFieldValue("extraFeatures", arr.length ? arr : [""]);
  };

  const handleAddExtraFeatures = () => {
    setFieldValue("extraFeatures", [...values.extraFeatures, ""]);
  };

  return (
    <Form className="space-y-5">

      {/* Basic Info */}
      <div className="border rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Plan Details</h3>

        <div>
          <label htmlFor="plan-name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <Field as={Input} id="plan-name" name="name" placeholder="Plan name..." />
        </div>

        <div>
          <label htmlFor="plan-description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Field
            as={Input}
            id="plan-description"
            name="description"
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="plan-price" className="block text-sm font-medium mb-1">
              Price
            </label>
            <Field
              as={Input}
              id="plan-price"
              name="price"
              type="number"
              min="0"
              placeholder="Price"
            />
          </div>

          <div>
            <label htmlFor="plan-billing-cycle" className="block text-sm font-medium mb-1">
              Billing Cycle
            </label>
            <Select
              value={values.billingCycle}
              onValueChange={(val) => setFieldValue("billingCycle", val)}
            >
              <SelectTrigger className="w-full" id="plan-billing-cycle">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                {BILLING_CYCLE.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Limits */}
      <div className="border rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Plan Limits</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="plan-branches">
              Branches
            </label>
            <Field
              as={Input}
              id="plan-branches"
              name="maxBranches"
              type="number"
              min="1"
              placeholder="Branches"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="plan-users">
              Users
            </label>
            <Field
              as={Input}
              id="plan-users"
              name="maxUsers"
              type="number"
              min="1"
              placeholder="Users"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="plan-products">
              Products
            </label>
            <Field
              as={Input}
              id="plan-products"
              name="maxProducts"
              type="number"
              min="1"
              placeholder="Products"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Features</h3>
        <FeaturesSwitchGrid
          values={values}
          handleFeatureSwitch={handleFeatureSwitch}
        />
      </div>

      {/* Extra Features */}
      <div className="border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Extra Features</h3>
        <ExtraFeaturesList
          extra={values.extraFeatures}
          handleExtraFeatureChange={handleExtraFeatureChange}
          handleRemoveExtraFeature={handleRemoveExtraFeature}
          handleAddExtraFeatures={handleAddExtraFeatures}
        />
      </div>

    </Form>
  );
};

export default PlanForm;