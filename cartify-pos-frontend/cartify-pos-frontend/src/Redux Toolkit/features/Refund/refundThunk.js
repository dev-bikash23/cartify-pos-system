import api from '@/routes/util/api';
import { getAuthHeaders } from '@/routes/util/getAuthHeader';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createRefunds = createAsyncThunk(
  "refund/create",
  async (refundDTO, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post("/api/refunds", refundDTO, { headers });
      console.log("create refund success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create refund"
      );
    }
  }
);

export const getAllRefunds = createAsyncThunk(
  "refund/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get("/api/refunds", { headers });
      console.log("get All refund success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get all refund"
      );
    }
  }
);

export const getRefundsByCashier = createAsyncThunk(
  "refund/getByCashier",
  async (cashierId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/cashier/${cashierId}`, {
        headers,
      });
      console.log("get refund by cashier success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get refund by cashier"
      );
    }
  }
);

export const getRefundsByBranch = createAsyncThunk(
  "refund/getByBranch",
  async (branchId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/branch/${branchId}`, {
        headers,
      });
      console.log("get refund by branch success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get refund by branch"
      );
    }
  }
);

export const getRefundsByShift = createAsyncThunk(
  "refund/getByShift",
  async (shiftReportId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/shift/${shiftReportId}`, {
        headers,
      });
      console.log("get refund by shift success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get refund by shift"
      );
    }
  }
);

export const getRefundsByCashierAndDateRange = createAsyncThunk(
  "refund/getByCashierAndDateRange",
  async ({ cashierId, from, to }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const formattedFrom = encodeURIComponent(from);
      const formattedTo = encodeURIComponent(to);

      const res = await api.get(
        `/api/refunds/cashier/${cashierId}?rangeFrom=${formattedFrom}&rangeTo=${formattedTo}`,
        { headers }
      );

      console.log("get refund by cashier and date range success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to get refund by cashier and date range"
      );
    }
  }
);

export const getRefundById = createAsyncThunk(
  "refund/getById",
  async (refundId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/refunds/${refundId}`, { headers });
      console.log("get refund by id success", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get refund by id"
      );
    }
  }
);