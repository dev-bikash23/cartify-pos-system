import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { createCustomer } from "@/Redux Toolkit/features/Customer/customerThunk";

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string(),
});

const CustomerForm = ({ showCustomerForm, setShowCustomerForm }) => {
  const dispatch = useDispatch();

  const initialValues = {
    fullName: "",
    phone: "",
    email: "",
    address: "",
  };

  const handleCreateCustomer = async (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus(null);
    const resultAction = await dispatch(createCustomer(values));

    if (createCustomer.fulfilled.match(resultAction)) {
      resetForm();
      setShowCustomerForm(false);
    } else {
      setStatus(resultAction.payload || "Failed to create customer. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Customer
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleCreateCustomer}
        >
          {({ values, handleChange, handleBlur, isSubmitting, status }) => (
            <Form className="space-y-4">

              {status && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {status}
                </div>
              )}

              <div>
                <Input
                  className="h-11"
                  name="fullName"
                  placeholder="Enter Full Name"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="fullName"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div>
                <Input
                  className="h-11"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div>
                <Input
                  className="h-11"
                  name="email"
                  placeholder="Enter Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomerForm(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  {isSubmitting ? "Adding..." : "Add Customer"}
                </Button>
              </div>

            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;