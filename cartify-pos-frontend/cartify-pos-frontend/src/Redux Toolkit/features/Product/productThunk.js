import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createProduct = createAsyncThunk("/product/create",
  async (dto, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post(`/api/product`, dto, { headers });
      console.log("product create success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || "product create failed");
    }
  }
);

export const getProductById = createAsyncThunk("/product/getById",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/product/${id}`, { headers });
      console.log("get product success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || "get product failed");
    }
  }
);

export const updateProduct = createAsyncThunk("/product/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.patch(`/api/product/${id}`, dto, { headers });
      console.log("product update success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || "product update failed");
    }
  }
);

export const deleteProduct = createAsyncThunk("/product/delete",
  async (id, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      await api.delete(`/api/product/${id}`, { headers });
      console.log("product delete success ", id);
      return id;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || "product delete failed");
    }
  }
);

export const getProductsByStore = createAsyncThunk("/product/getByStore",
  async ({ storeId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(`/api/product/store/${storeId}`, { headers });
      console.log("get store product success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || "get store product failed");
    }
  }
);

export const searchProducts = createAsyncThunk("/product/search",
  async ({ storeId, keyword }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.get(
        `/api/product/store/${storeId}/search?keyword=${encodeURIComponent(keyword)}`,
        { headers }
      );
      console.log("product search success ", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || "product search failed");
    }
  }
);

