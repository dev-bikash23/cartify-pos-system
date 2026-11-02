import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import EmployeeTable from "./EmployeeTable";
import AddEmployeeDialog from "./AddEmployeeDialog";
import EditEmployeeDialog from "./EditEmployeeDialog";
import EmployeeViewDialog from "./EmployeeViewDialog";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

import {
  createBranchEmployees,
  updateEmployees,
  deleteEmployees,
  findBranchEmployees,
} from "@/Redux Toolkit/features/Employee/employeeThunk.js";

const EmployeeState = () => {
  const dispatch = useDispatch();

  // Correct source: the branch slice, populated by getBranchById
  const branchId = useSelector((state) => state.branch?.branch?.id);

  const { employees, loading, error } = useSelector((state) => state.employee);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (branchId) {
      dispatch(findBranchEmployees({ branchId }));
    }
  }, [dispatch, branchId]);

  const handleAddEmployee = (employee) => {
    dispatch(createBranchEmployees({ employee, branchId }));
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
    dispatch(
      updateEmployees({
        employeeId: updatedEmployee.id,
        employeeDetails: updatedEmployee,
      })
    );
    setOpenEdit(false);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (selectedEmployee) {
      dispatch(deleteEmployees({ employeeId: selectedEmployee.id }));
    }
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

      {loading && (
        <p className="text-sm text-muted-foreground">Loading employees...</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

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
        branchId={branchId}
      />

      <EditEmployeeDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        employee={selectedEmployee}
        onSubmit={handleUpdateEmployee}
        branchId={branchId}
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