import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createStoreEmployees = createAsyncThunk(
  "/employee/createStoreEmployee",
  async ({ employee, storeId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post(`/api/employees/store/${storeId}`, employee, {
        headers,
      });
      console.log("create store employee success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create store employee"
      );
    }
  }
);

export const createBranchEmployees = createAsyncThunk(
  "/employee/createBranchEmployee",
  async ({ employee, branchId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post(`/api/employees/branch/${branchId}`, employee, {
        headers,
      });
      console.log("create branch employee success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create branch employee"
      );
    }
  }
);

export const updateEmployees = createAsyncThunk(
  "/employee/updateEmployee",
  async ({ employeeId, employeeDetails }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.put(
        `/api/employees/${employeeId}`,
        employeeDetails,
        { headers }
      );
      console.log("update employee success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update employee"
      );
    }
  }
);

export const deleteEmployees = createAsyncThunk(
  "/employee/deleteEmployee",
  async ({ employeeId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.delete(`/api/employees/${employeeId}`, {
        headers,
      });
      console.log("delete employee success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete employee"
      );
    }
  }
);

export const findEmployeeById = createAsyncThunk(
  "/employee/findEmployeesById",
  async ({ employeeId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/employees/${employeeId}`, { headers });
      console.log("find employee by id success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to find employee"
      );
    }
  }
);

export const findStoreEmployees = createAsyncThunk(
  "/employee/findStoreEmployee",
  async ({ storeId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/employees/store/${storeId}`, {
        headers,
      });
      console.log("find store employee success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to find store employees"
      );
    }
  }
);

export const findBranchEmployees = createAsyncThunk(
  "/employee/findBranchEmployee",
  async ({ branchId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/employees/branch/${branchId}`, {
        headers,
      });
      console.log("find branch employee success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to find branch employees"
      );
    }
  }
);