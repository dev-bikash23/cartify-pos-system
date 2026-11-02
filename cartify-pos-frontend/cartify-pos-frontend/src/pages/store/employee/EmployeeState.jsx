import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import EmployeeTable from "./EmployeeTable";
import AddEmployeeDialog from "./AddEmployeeDialog";
import EditEmployeeDialog from "./EditEmployeeDialog";
import EmployeeViewDialog from "./EmployeeViewDialog";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

const initialEmployees = [
  {
    id: 1,
    fullName: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    role: "Branch Manager",
    loginAccess: "Enabled",
    status: "Active",
    assignedSince: "12 Jan 2026",
  },
  {
    id: 2,
    fullName: "Pablo Panday",
    email: "pablo@gmail.com",
    phone: "+91 9123456789",
    role: "Cashier",
    loginAccess: "Enabled",
    status: "Active",
    assignedSince: "25 Jan 2026",
  },
  {
    id: 3,
    fullName: "Bikash Pradhan",
    email: "bikash@gmail.com",
    phone: "+91 9988776655",
    role: "Cashier",
    loginAccess: "Enabled",
    status: "Active",
    assignedSince: "02 Feb 2026",
  },
  {
    id: 4,
    fullName: "Aman Kumar",
    email: "aman@gmail.com",
    phone: "+91 9871234567",
    role: "Inventory Staff",
    loginAccess: "Disabled",
    status: "Inactive",
    assignedSince: "15 Feb 2026",
  },
  {
    id: 5,
    fullName: "Riya Das",
    email: "riya@gmail.com",
    phone: "+91 9000011111",
    role: "Cashier",
    loginAccess: "Enabled",
    status: "Active",
    assignedSince: "28 Feb 2026",
  },
];

const EmployeeState = () => {
  const [employees, setEmployees] = useState(initialEmployees);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleAddEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: employees.length + 1,
      loginAccess: "Enabled",
      status: "Active",
      assignedSince: new Date().toLocaleDateString(),
    };

    setEmployees([...employees, newEmployee]);
    setOpenAdd(false);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setOpenView(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenEdit(true);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );

    setOpenEdit(false);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    setEmployees(
      employees.filter((emp) => emp.id !== selectedEmployee.id)
    );

    setOpenDelete(false);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Employee Management
        </h1>

        <Button
          onClick={() => setOpenAdd(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>

      </div>

      <EmployeeTable
        employees={employees}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddEmployeeDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSubmit={handleAddEmployee}
      />

      <EditEmployeeDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        employee={selectedEmployee}
        onSubmit={handleUpdateEmployee}
      />

      <EmployeeViewDialog
        open={openView}
        onOpenChange={setOpenView}
        employee={selectedEmployee}
      />

      <DeleteEmployeeDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        employee={selectedEmployee}
        onDelete={confirmDelete}
      />

    </div>
  );
};

export default EmployeeState;