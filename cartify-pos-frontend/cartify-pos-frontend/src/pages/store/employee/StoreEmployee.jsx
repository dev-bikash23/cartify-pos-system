import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";
import { getAllBranchesByStore } from "@/Redux Toolkit/features/Branch/branchThunk";
import {
  createStoreEmployees,
  deleteEmployees,
  findStoreEmployees,
  updateEmployees,
} from "@/Redux Toolkit/features/Employee/employeeThunk";

import EmployeeTable from "./EmployeeTable";
import AddEmployeeDialog from "./AddEmployeeDialog";
import EditEmployeeDialog from "./EditEmployeeDialog";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

const StoreEmployee = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store?.store);
  const branches = useSelector((state) => state.branch?.branches || []);
  const { employees, loading, error } = useSelector((state) => state.employee);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (!store) {
      dispatch(getStoreByAdmin());
    }
  }, [dispatch, store]);

  useEffect(() => {
    if (store?.id) {
      dispatch(findStoreEmployees({ storeId: store.id }));
      dispatch(getAllBranchesByStore({ id: store.id }));
    }
  }, [dispatch, store?.id]);

  const refreshEmployees = () => {
    if (store?.id) {
      dispatch(findStoreEmployees({ storeId: store.id }));
    }
  };

  const handleRefresh = async () => {
    if (!store?.id) {
      const result = await dispatch(getStoreByAdmin());
      if (result.payload?.id) dispatch(findStoreEmployees({ storeId: result.payload.id }));
      return;
    }
    refreshEmployees();
  };

  const handleAddEmployee = async (employee) => {
    await dispatch(createStoreEmployees({ employee, storeId: store.id })).unwrap();
    refreshEmployees();
    setOpenAdd(false);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenEdit(true);
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    await dispatch(
      updateEmployees({
        employeeId: selectedEmployee.id,
        employeeDetails: updatedEmployee,
      })
    ).unwrap();
    refreshEmployees();
    setOpenEdit(false);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployees({ employeeId: selectedEmployee.id })).unwrap();
    refreshEmployees();
    setOpenDelete(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Employee Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff, roles and login access
          </p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        <div className="flex gap-2">
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button
          onClick={() => setOpenAdd(true)}
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
        </div>
      </div>

      <EmployeeTable
        employees={employees}
        branches={branches}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddEmployeeDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        branches={branches}
        onSubmit={handleAddEmployee}
      />

      <EditEmployeeDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        employee={selectedEmployee}
        onSubmit={handleUpdateEmployee}
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

export default StoreEmployee;