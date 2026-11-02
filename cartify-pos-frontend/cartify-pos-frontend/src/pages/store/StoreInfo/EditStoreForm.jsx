import React from "react";
import { Formik, Form, Field } from "formik";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const STORE_TYPE_OPTIONS = [
  { value: "Retail Store", label: "Retail Store" },
  { value: "Supermarket", label: "Supermarket" },
  { value: "Mall", label: "Mall" },
  { value: "Department Store", label: "Department Store" },
  { value: "Convenience Store", label: "Convenience Store" },
  { value: "Specialty Store", label: "Specialty Store" },
];

const EditStoreForm = ({ initialValues, onSubmit, onCancel, isEditing = true }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          await onSubmit(values);
          if (!isEditing) resetForm();
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-5">

          {/* Store Information */}
          <div className="border rounded-xl p-5">
            <h3 className="text-base font-semibold mb-4 text-gray-800">
              Store Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Store Name *
                </Label>
                <Field as={Input} id="brand" name="brand" placeholder="Enter store name" />
              </div>

              <div>
                <Label htmlFor="storeType" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Store Type
                </Label>
                <Field
                  as="select"
                  id="storeType"
                  name="storeType"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                >
                  <option value="">Select store type</option>
                  {STORE_TYPE_OPTIONS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Enter description"
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border rounded-xl p-5">
            <h3 className="text-base font-semibold mb-4 text-gray-800">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Field as={Input} id="phone" name="contact.phone" placeholder="Enter phone number" />
              </div>

              <div>
                <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Field
                  as={Input}
                  id="email"
                  type="email"
                  name="contact.email"
                  placeholder="Enter email address"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Field
                  as={Textarea}
                  id="address"
                  name="contact.address"
                  rows={2}
                  placeholder="Enter full store address"
                  className="resize-none"
                />
              </div>

              <div>
                <Label htmlFor="latitude" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Latitude
                </Label>
                <Field as={Input} id="latitude" name="contact.latitude" type="number" step="any" placeholder="e.g. 19.0760" />
              </div>

              <div>
                <Label htmlFor="longitude" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Longitude
                </Label>
                <Field as={Input} id="longitude" name="contact.longitude" type="number" step="any" placeholder="e.g. 72.8777" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Saving..." : "Update Store Details"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditStoreForm;