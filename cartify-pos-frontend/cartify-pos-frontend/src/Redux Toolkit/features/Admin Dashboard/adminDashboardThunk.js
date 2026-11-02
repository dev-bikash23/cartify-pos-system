import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";

export const getSuperAdminDashboardOverview = createAsyncThunk(
  "adminDashboard/getOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/super-admin/dashboard/overview", {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not load dashboard overview");
    }
  }
);

export const getStoreRegistrations = createAsyncThunk(
  "adminDashboard/getRegistrations",
  async (days = 7, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/super-admin/dashboard/registrations", {
        headers: getAuthHeaders(),
        params: { days },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not load store registrations");
    }
  }
);

export const getStoreStatusDistribution = createAsyncThunk(
  "adminDashboard/getStoreStatusDistribution",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/super-admin/dashboard/store-status", {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not load store status");
    }
  }
);