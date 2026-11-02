import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Category name is required"),
  description: Yup.string().trim().required("Description is required"),
});

const CategoryForm = ({
  onSubmit,
  onCancel,
  initialValues,
  isEditing = false,
}) => {
  const defaultValues = {
    name: "",
    description: "",
    ...initialValues,
  };

  return (
    <Formik
      enableReinitialize
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onSubmit(values);
        if (!isEditing) resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <Field as={Input} name="name" placeholder="e.g. Electronics" />
            <ErrorMessage
              name="name"
              component="p"
              className="mt-1 text-xs text-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <Field
              as={Textarea}
              name="description"
              rows={4}
              placeholder="Briefly describe this category"
              className="resize-none"
            />
            <ErrorMessage
              name="description"
              component="p"
              className="mt-1 text-xs text-red-500"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Category"
                : "Add Category"}
            </Button>
          </div>

        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;