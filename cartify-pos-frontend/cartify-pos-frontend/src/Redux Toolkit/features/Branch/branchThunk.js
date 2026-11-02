import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/routes/util/api';

export const createBranch = createAsyncThunk(
  "/branch/create",
  async ({ dto }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post(`/api/branches`, dto, { headers });
      console.log("branch created successfully", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create branch"
      );
    }
  }
);

export const getBranchById = createAsyncThunk(
  "/branch/getById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/branches/${id}`, { headers });
      console.log("get branch successfully", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to find branch"
      );
    }
  }
);

export const getAllBranchesByStore = createAsyncThunk(
  "/branch/getAllByStore",
  async ({ id }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/branches/store/${id}`, { headers });
      console.log("get branches by store successfully", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to find branches by store"
      );
    }
  }
);

export const updateBranch = createAsyncThunk(
  "/branch/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.put(`/api/branches/${id}`, dto, { headers });
      console.log("branch updated successfully", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update branch"
      );
    }
  }
);

export const deleteBranch = createAsyncThunk(
  "/branch/delete",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      await api.delete(`/api/branches/${id}`, { headers });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete branch"
      );
    }
  }
);