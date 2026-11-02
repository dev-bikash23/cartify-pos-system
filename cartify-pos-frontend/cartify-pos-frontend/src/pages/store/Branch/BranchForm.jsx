import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DEFAULT_ADDRESS } from "@/lib/defaultAddress";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loading = false;

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Branch name is too short")
    .required("Branch name is required"),

  manager: Yup.string()
    .min(3, "Manager name is too short")
    .required("Manager name is required"),

  address: Yup.string()
    .min(5, "Address is too short")
    .required("Address is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
});

const BranchForm = ({
  onSubmit,
  onCancel,
  initialValues,
  isEditing = false,
}) => {
  return (
    <Formik
      enableReinitialize
      initialValues={
        initialValues || {
          name: "",
          manager: "",
          address: DEFAULT_ADDRESS,
          phone: "",
        }
      }
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onSubmit(values);

        if (!isEditing) {
          resetForm();
        }

        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-5">

          {/* Row 1 */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Branch Name
              </label>

              <Field
                as={Input}
                name="name"
                placeholder="Bhubaneswar Branch"
              />

              <ErrorMessage
                name="name"
                component="p"
                className="mt-1 text-xs text-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Manager Name
              </label>

              <Field
                as={Input}
                name="manager"
                placeholder="Rahul Sharma"
              />

              <ErrorMessage
                name="manager"
                component="p"
                className="mt-1 text-xs text-red-500"
              />
            </div>

          </div>

          {/* Address */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <Field
              as={Input}
              name="address"
              placeholder="Street, City, State"
            />

            <ErrorMessage
              name="address"
              component="p"
              className="mt-1 text-xs text-red-500"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <div className="flex">

              <div className="flex items-center rounded-l-md border border-r-0 bg-gray-100 px-3 text-sm font-medium text-gray-600">
                +91
              </div>

              <Field
                as={Input}
                name="phone"
                placeholder="9876543210"
                className="rounded-l-none"
              />

            </div>

            <ErrorMessage
              name="phone"
              component="p"
              className="mt-1 text-xs text-red-500"
            />
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-4">

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting || loading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Branch"
                : "Add Branch"}
            </Button>

          </div>

        </Form>
      )}
    </Formik>
  );
};

export default BranchForm;
