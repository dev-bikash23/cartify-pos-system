import api from "@/routes/util/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

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