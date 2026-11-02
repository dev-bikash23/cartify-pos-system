import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Matches backend UserRole.java exactly — value sent to API must be one of these
const allRoleOptions = [
  { value: "ROLE_ADMIN", label: "Admin" },
  { value: "ROLE_STORE_ADMIN", label: "Store Admin" },
  { value: "ROLE_STORE_MANAGER", label: "Store Manager" },
  { value: "ROLE_BRANCH_MANAGER", label: "Branch Manager" },
  { value: "ROLE_BRANCH_ADMIN", label: "Branch Admin" },
  { value: "ROLE_BRANCH_CASHIER", label: "Branch Cashier" },
];

// Backend's createBranchEmployee only accepts these roles —
// picking anything else throws "branch role not supported" as an
// unhandled 500. Restrict the dropdown to match when in branch context.
const branchRoleOptions = allRoleOptions.filter((r) =>
  ["ROLE_BRANCH_MANAGER", "ROLE_BRANCH_ADMIN", "ROLE_BRANCH_CASHIER"].includes(r.value)
);

/**
 * fixedBranchId: pass this when the form is used inside a single-branch
 * context (e.g. a Branch Manager's own dashboard) — the branch picker
 * is hidden and this id is used directly instead.
 */
const EmployeeForm = ({ initialData, onSubmit, fixedBranchId, branches = [] }) => {
  const isEditing = Boolean(initialData);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: isEditing
      ? Yup.string().min(6, "Minimum 6 characters")
      : Yup.string().min(6, "Minimum 6 characters").required("Password is required"),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
      .required("Phone number is required"),

    role: Yup.string().required("Role is required"),

    branchId: fixedBranchId
      ? Yup.string().notRequired()
      : Yup.string().required("Branch is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: initialData?.id || undefined,
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      password: "",
      phone: initialData?.phone || "",
      role: initialData?.role || "",
      branchId: fixedBranchId
        ? String(fixedBranchId)
        : initialData?.branchId
        ? String(initialData.branchId)
        : "",
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        ...values,
        branchId: values.branchId ? Number(values.branchId) : undefined,
      };

      if (isEditing && !payload.password) {
        delete payload.password;
      }

      onSubmit(payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">

      {/* Full Name */}
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          name="fullName"
          placeholder="Enter Employee Name"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <p className="text-sm text-red-500">{formik.errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          placeholder="Enter Employee Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-red-500">{formik.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label>
          Password {isEditing && <span className="text-xs text-muted-foreground">(leave blank to keep current password)</span>}
        </Label>
        <Input
          type="password"
          name="password"
          placeholder={isEditing ? "Enter new password (optional)" : "Enter Password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-sm text-red-500">{formik.errors.password}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label>Phone Number</Label>
        <div className="flex">
          <div className="px-3 border rounded-l-md bg-gray-100 flex items-center text-sm shrink-0">
            +91
          </div>
          <Input
            className="rounded-l-none"
            name="phone"
            placeholder="9876543210"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-sm text-red-500">{formik.errors.phone}</p>
        )}
      </div>

      {/* Role + Branch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="space-y-2">
          <Label>Role</Label>
          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="" disabled>
              Select Role
            </option>
            {(fixedBranchId ? branchRoleOptions : allRoleOptions).map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-sm text-red-500">{formik.errors.role}</p>
          )}
        </div>

        {/* Branch picker only shown when NOT already scoped to one branch */}
        {!fixedBranchId && (
          <div className="space-y-2">
            <Label>Branch</Label>
            <select
              name="branchId"
              placeholder="Branch ID"
              value={formik.values.branchId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="" disabled>
                Select Branch
              </option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {formik.touched.branchId && formik.errors.branchId && (
              <p className="text-sm text-red-500">{formik.errors.branchId}</p>
            )}
          </div>
        )}

      </div>

      {/* Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
        >
          {isEditing ? "Save Changes" : "Add Employee"}
        </Button>
      </div>

    </form>
  );
};

export default EmployeeForm;