import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDailySalesChart = createAsyncThunk(
  "branchAnalytics/getDailySalesChart",
  async ({ branchId, days = 7 }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/branch-analytics/daily-sales?branchId=${branchId}&days=${days}`,
        { headers }
      );

      console.log("get daily sales success ", res.data);
      return res.data;
    } catch (error) {
      console.error("get top products failed", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch daily sales"
      );
    }
  }
);

export const getTopProductsByQuantity = createAsyncThunk(
  "branchAnalytics/getTopProductsByQuantity",
  async ({ branchId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/branch-analytics/top-products?branchId=${branchId}`,
        { headers }
      );

      console.log("get top products by quantity success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top products"
      );
    }
  }
);

export const getTopCashierByRevenue = createAsyncThunk(
  "branchAnalytics/getTopCashierByRevenue",
  async ({ branchId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/branch-analytics/top-cashier?branchId=${branchId}`,
        { headers }
      );

      console.log("get top cashier by revenue success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top cashier"
      );
    }
  }
);

export const getCategoryWiseSalesBreakdown = createAsyncThunk(
  "branchAnalytics/getCategoryWiseSalesBreakdown",
  async ({ branchId, date }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/branch-analytics/category-sales?branchId=${branchId}&date=${date}`,
        { headers }
      );

      console.log("get category sales breakdown success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category sales"
      );
    }
  }
);

export const getTodayOverview = createAsyncThunk(
  "branchAnalytics/getTodayOverview",
  async ({ branchId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/branch-analytics/today-overview?branchId=${branchId}`,
        { headers }
      );

      console.log("get today overview success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch today overview"
      );
    }
  }
);

export const getPaymentBreakdown = createAsyncThunk(

  "branchAnalytics/getPaymentBreakdown",
  async ({ branchId, date }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/branch-analytics/payment-breakdown?branchId=${branchId}&date=${date}`,
        { headers }
      );

      console.log("payment breakdown success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment breakdown"
      );
    }
  }
);