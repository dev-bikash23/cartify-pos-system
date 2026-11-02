import React from "react";
import { Formik, Form, Field } from "formik";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ProductForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
  categories = [],
}) => {
  const defaultValues = {
    name: "",
    sku: "",
    brand: "",
    categoryId: "",
    mrp: "",
    sellingPrice: "",
    stock: "",
    color: "",
    image: "",
    description: "",
    ...initialValues,
  };

  return (
    <Formik
      enableReinitialize
      initialValues={defaultValues}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        onSubmit(values);
        if (!isEditing) resetForm();
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form className="flex flex-col">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">

            {/* Left Side */}
            <div className="lg:col-span-2 space-y-5">

              {/* Product Information */}
              <div className="border rounded-xl p-5">
                <h3 className="text-base font-semibold mb-4 text-gray-800">
                  Product Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <Field as={Input} name="name" placeholder="Enter product name" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      SKU
                    </label>
                    <Field as={Input} name="sku" placeholder="PRD001" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Brand
                    </label>
                    <Field as={Input} name="brand" placeholder="Nike" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <Field
                      as="select"
                      name="categoryId"
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      MRP (₹)
                    </label>
                    <Field as={Input} type="number" name="mrp" placeholder="0" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Selling Price (₹)
                    </label>
                    <Field as={Input} type="number" name="sellingPrice" placeholder="0" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Stock Quantity
                    </label>
                    <Field as={Input} type="number" name="stock" placeholder="0" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Colour
                    </label>
                    <Field as={Input} name="color" placeholder="Black" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <Field as={Input} name="image" placeholder="https://example.com/image.jpg" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border rounded-xl p-5">
                <h3 className="text-base font-semibold mb-4 text-gray-800">
                  Product Description
                </h3>
                <Field
                  as={Textarea}
                  name="description"
                  rows={5}
                  placeholder="Enter product description..."
                  className="resize-none"
                />
              </div>
            </div>

            {/* Right Side — Preview */}
            <div>
              <div className="border rounded-xl p-5">
                <h3 className="text-base font-semibold mb-4 text-gray-800">
                  Product Preview
                </h3>

                <div className="flex justify-center">
                  {values.image ? (
                    <img
                      src={values.image}
                      alt="Preview"
                      className="h-48 w-48 rounded-xl border object-cover shadow-sm"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/300x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-500">No image selected</p>
                        <p className="mt-1 text-xs text-gray-400">
                          Paste an image URL to preview it here
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-2.5 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Brand</span>
                    <span className="font-medium">{values.brand || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">
                      {categories.find((item) => String(item.id) === String(values.categoryId))?.name || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Stock</span>
                    <span className="font-medium">{values.stock || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selling Price</span>
                    <span className="font-semibold text-green-600">
                      ₹{values.sellingPrice || 0}
                    </span>
                  </div>
                </div>
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
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;