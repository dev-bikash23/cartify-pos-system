import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import api from "@/routes/util/api";

export const getStoreOverview = createAsyncThunk(
  "storeAnalytics/getStoreOverview",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/overview`, {
        headers,
      });
      console.log("get store overview", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get store overview"
      );
    }
  }
);

export const getRecentSales = createAsyncThunk(
  "storeAnalytics/getRecentSales",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/recent-sales`, {
        headers,
      });
      console.log("get recent sales", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get recent sales"
      );
    }
  }
);

export const getSalesTrends = createAsyncThunk(
  "storeAnalytics/getSalesTrends",
  async ({ storeAdminId, period }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/store/analytics/${storeAdminId}/sales-trends?period=${period}`,
        { headers }
      );
      console.log("get store sales trends", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get store sales trends"
      );
    }
  }
);

export const getMonthlySales = createAsyncThunk(
  "storeAnalytics/getMonthlySales",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/sales/monthly`, {
        headers,
      });
      console.log("get store monthly sales", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get store monthly sales"
      );
    }
  }
);

export const getDailySales = createAsyncThunk(
  "storeAnalytics/getDailySales",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/sales/daily`, {
        headers,
      });
      console.log("get store daily sales", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get store daily sales"
      );
    }
  }
);

export const getSalesByCategory = createAsyncThunk(
  "storeAnalytics/getSalesByCategory",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/sales/category`, {
        headers,
      });
      console.log("get store sales by category", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get store sales by category"
      );
    }
  }
);

export const getSalesByPaymentMethod = createAsyncThunk(
  "storeAnalytics/getSalesByPaymentMethod",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/store/analytics/${id}/sales/payment-methods`,
        { headers }
      );
      console.log("get store sales by payment method", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error in get store sales by payment method"
      );
    }
  }
);

export const getSalesByBranch = createAsyncThunk(
  "storeAnalytics/getSalesByBranch",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/sales/branch`, {
        headers,
      });
      console.log("sales by branch", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get store sales by branch"
      );
    }
  }
);

export const getPaymentBreakDown = createAsyncThunk(
  "storeAnalytics/getPaymentBreakDown",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/payment`, {
        headers,
      });
      console.log("get payment break down", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get payment break down"
      );
    }
  }
);

export const getBranchPerformance = createAsyncThunk(
  "storeAnalytics/getBranchPerformance",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/store/analytics/${id}/branch-performance`,
        { headers }
      );
      console.log("get branch performance", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get branch performance"
      );
    }
  }
);

export const getStoreAlerts = createAsyncThunk(
  "storeAnalytics/getStoreAlerts",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/alerts`, {
        headers,
      });
      console.log("store alerts success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in get store alerts"
      );
    }
  }
);

export const getStoreAlertSales = createAsyncThunk(
  "storeAnalytics/getStoreAlertSales",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/store/analytics/${id}/alerts/sales`, { headers });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error in get alert sales");
    }
  }
);