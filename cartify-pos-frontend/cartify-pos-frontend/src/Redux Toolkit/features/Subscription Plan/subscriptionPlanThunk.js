import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createSubscriptionPlan = createAsyncThunk(
  "/subscriptionPlan/create",
  async (plan, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post(`/api/super-admin/subscription-plan`, plan, {
        headers,
      });

      console.log("create subscription plan success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subscription plan"
      );
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  "/subscriptionPlan/update",
  async ({ id, plan }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.put(
        `/api/super-admin/subscription-plan/${id}`,
        plan,
        { headers }
      );

      console.log("update subscription plan success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subscription plan"
      );
    }
  }
);

export const getAllSubscriptionPlans = createAsyncThunk(
  "/subscriptionPlan/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/super-admin/subscription-plan`, {
        headers,
      });

      console.log("get all subscription plan success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription plans"
      );
    }
  }
);

export const getSubscriptionPlanById = createAsyncThunk(
  "/subscriptionPlan/getById",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/super-admin/subscription-plan/${id}`, {
        headers,
      });

      console.log("get subscription plan by id success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription plan"
      );
    }
  }
);

export const deleteSubscriptionPlan = createAsyncThunk(
  "/subscriptionPlan/delete",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.delete(
        `/api/super-admin/subscription-plan/${id}`,
        { headers }
      );

      console.log("delete subscription plan success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subscription plan"
      );
    }
  }
);

export const getAvailableSubscriptionPlans = createAsyncThunk(
  "subscriptionPlan/getAvailable",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get("/api/subscription-plans", { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not load plans");
    }
  }
);

export const getCurrentStoreSubscription = createAsyncThunk(
  "subscriptionPlan/getCurrentStoreSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get("/api/store-subscriptions/current", { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not load current subscription");
    }
  }
);

export const createStoreSubscriptionCheckout = createAsyncThunk(
  "subscriptionPlan/createStoreSubscriptionCheckout",
  async (planId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post(`/api/store-subscriptions/checkout/${planId}`, {}, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not start plan checkout");
    }
  }
);

export const verifyStoreSubscriptionPayment = createAsyncThunk(
  "subscriptionPlan/verifyStoreSubscriptionPayment",
  async (request, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post("/api/store-subscriptions/verify", request, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not verify subscription payment");
    }
  }
);

export const activateFreeStoreSubscription = createAsyncThunk(
  "subscriptionPlan/activateFreeStoreSubscription",
  async (planId, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post(`/api/store-subscriptions/activate-free/${planId}`, {}, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not activate the free plan");
    }
  }
);