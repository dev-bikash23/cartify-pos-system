import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createInventory=createAsyncThunk("inventory/create",
  async (dto, {rejectWithValue}) => {
    
    try {
       const headers = getAuthHeaders();
       const res = await api.post(`/api/inventories`,dto, {headers});
       console.log("create inventory success", res.data)
       return res.data;
    } catch (error) {
      console.log("error", error)
      return rejectWithValue(error.response?.data?.message || "create inventory failed")
    }
  }
)

export const updateInventory=createAsyncThunk("inventory/update",
  async ({id, dto}, {rejectWithValue}) => {
    
    try {
       const headers = getAuthHeaders();
       const res = await api.put(`/api/inventories/${id}`,dto, {headers});
       console.log("update inventory success", res.data)
       return res.data;
    } catch (error) {
      console.log("error", error)
      return rejectWithValue(error.response?.data?.message || "update inventory failed")
    }
  }
)

export const deleteInventory=createAsyncThunk("inventory/delete",
  async (id, {rejectWithValue}) => {
    
    try {
       const headers = getAuthHeaders();
       const res = await api.delete(`/api/inventories/${id}`, {headers});
       console.log("delete inventory success", res.data)
       return res.data;
    } catch (error) {
      console.log("error", error)
      return rejectWithValue(error.response?.data?.message || "delete inventory failed")
    }
  }
)

export const getInventoryById=createAsyncThunk("inventory/getById",
  async (id, {rejectWithValue}) => {
    
    try {
       const headers = getAuthHeaders();
       const res = await api.get(`/api/inventories/${id}`, {headers});
       console.log("get inventory success", res.data)
       return res.data;
    } catch (error) {
      console.log("error", error)
      return rejectWithValue(error.response?.data?.message || "get inventory failed")
    }
  }
)

export const getInventoryByBranch=createAsyncThunk("inventory/getByBranch",
  async (id, {rejectWithValue}) => {
    
    try {
       const headers = getAuthHeaders();
       const res = await api.get(`/api/inventories/branch/${id}`, {headers});
       console.log("get branch inventory success", res.data)
       return res.data;
    } catch (error) {
      console.log("error", error)
      return rejectWithValue(error.response?.data?.message || "get branch inventory failed")
    }
  }
)

export const getInventoryByProduct=createAsyncThunk("inventory/getByProduct",
  async (id, {rejectWithValue}) => {
    
    try {
       const headers = getAuthHeaders();
       const res = await api.get(`/api/inventories/product/${id}`, {headers});
       console.log("get product inventory success", res.data)
       return res.data;
    } catch (error) {
      console.log("error", error)
        return rejectWithValue(error.response?.data?.message || "get product inventory failed")
    }
  }
)