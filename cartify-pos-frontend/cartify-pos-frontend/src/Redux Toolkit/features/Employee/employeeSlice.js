import { createSlice } from "@reduxjs/toolkit";
import {
  createBranchEmployees,
  createStoreEmployees,
  deleteEmployees,
  findBranchEmployees,
  findEmployeeById,
  findStoreEmployees,
  updateEmployees,
} from "./employeeThunk.js";

const initialState = {
  employees: [],
  employee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Store Employee
      .addCase(createStoreEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStoreEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createStoreEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Branch Employee
      .addCase(createBranchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createBranchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Employee
      .addCase(updateEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployees.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Employee
      .addCase(deleteEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployees.fulfilled, (state, action) => {
        state.loading = false;
        const deletedEmployeeId = action.payload?.id ?? action.meta.arg.employeeId;
        state.employees = state.employees.filter(
          (e) => e.id !== deletedEmployeeId
        );
      })
      .addCase(deleteEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Find Employee By Id
      .addCase(findEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(findEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Find Store Employees
      .addCase(findStoreEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findStoreEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(findStoreEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Find Branch Employees
      .addCase(findBranchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findBranchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(findBranchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;