import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";

export const createStore = createAsyncThunk(
  "/store/create",
  async (storeData, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post(`/api/stores`, storeData, { headers });
      console.log("create store success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create store"
      );
    }
  }
);

export const getStoreById = createAsyncThunk(
  "/store/getById",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/stores/${id}`, { headers });
      console.log("get store by id success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store"
      );
    }
  }
);

export const getAllStores = createAsyncThunk(
  "/store/getAll",
  async (status, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/stores`, {
        headers,
        params: status ? { status } : undefined,
      });
      console.log("get all stores success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stores"
      );
    }
  }
);

export const updateStore = createAsyncThunk(
  "/store/update",
  async ({ id, storeData }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.put(`/api/stores/${id}`, storeData, { headers });
      console.log("update store success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update store"
      );
    }
  }
);

export const getStoreByAdmin = createAsyncThunk(
  "/store/getByAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/stores/admin`, { headers });
      console.log("get store by admin success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store by admin"
      );
    }
  }
);

export const getStoreByEmployee = createAsyncThunk(
  "/store/getByEmployee",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/stores/employee`, { headers });
      console.log("get store by employee success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store by employee"
      );
    }
  }
);

export const moderateStore = createAsyncThunk(
  "/store/moderateStore",
  async ({ storeId, status }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.put(`/api/stores/${storeId}/moderate`, null, {
        headers,
        params: { status },
      });
      console.log("moderate store success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to moderate store"
      );
    }
  }
);