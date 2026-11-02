import api from "@/routes/util/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";

export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("get user profile success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const getAllCustomer = createAsyncThunk(
  "user/getCustomer",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("get all customer success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch all customers"
      );
    }
  }
);

export const getAllCashier = createAsyncThunk(
  "user/getCashiers",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users/cashier", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("get all cashier success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch all cashiers"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("get user by id success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(
        error?.response?.data?.message || "User not found"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/auth/update/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const getAdminUsers = createAsyncThunk(
  "user/getAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/super-admin/users", { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        try {
          const fallback = await api.get("/users/list", { headers: getAuthHeaders() });
          return fallback.data;
        } catch (fallbackError) {
          return rejectWithValue(fallbackError?.response?.data?.message || "Failed to load users");
        }
      }
      return rejectWithValue(error?.response?.data?.message || "Failed to load users");
    }
  }
);

export const updateAdminUserStatus = createAsyncThunk(
  "user/updateAdminUserStatus",
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/super-admin/users/${id}/status`, null, {
        headers: getAuthHeaders(), params: { active },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update user status");
    }
  }
);

export const updateAdminUserRole = createAsyncThunk(
  "user/updateAdminUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/super-admin/users/${id}/role`, null, {
        headers: getAuthHeaders(), params: { role },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update user role");
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("jwt");
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue("Logout failed");
    }
  }
);