import api from "@/routes/util/api";
import { getAuthHeaders } from "@/routes/util/getAuthHeader";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createOrder = createAsyncThunk("order/create", 
  async(dto, { rejectWithValue}) => {
    try { 
        const headers = getAuthHeaders();
        const res=await api.post(`/api/orders`,dto,{
        headers,
        
      });
      console.log("create order success", res.data)
      return res.data;

    } catch (error) {
      console.log("error ", error?.response?.data)
      return rejectWithValue(error?.response?.data?.message || "Failed to create order"); 
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  "order/createRazorpayOrder",
  async (dto, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post("/api/payments/razorpay/orders", dto, { headers });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Could not start Razorpay checkout"
      );
    }
  }
);

export const verifyRazorpayPayment = createAsyncThunk(
  "order/verifyRazorpayPayment",
  async (payment, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await api.post("/api/payments/razorpay/verify", payment, { headers });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Could not verify payment"
      );
    }
  }
);

export const getOrderById = createAsyncThunk("order/getById", 
  async(id, { rejectWithValue }) => {
    try { 
        const headers = getAuthHeaders();
        const res=await api.get(`/api/orders/${id}`,{
        headers,
        
      });
      console.log("fetch success", res.data)
      return res.data;

    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Failed to get order by id"); 
    }
    
  }
);

export const getOrdersByBranch = createAsyncThunk(
  "order/getByBranch",
  async ({ branchId, customerId, cashierId, paymentType, status }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const params = [];
      if (customerId) params.push(`customerId=${customerId}`);
      if (cashierId) params.push(`cashierId=${cashierId}`);
      if (paymentType) params.push(`paymentType=${paymentType}`);
      if (status) params.push(`status=${status}`);

      const query = params.length ? `?${params.join("&")}` : "";

      const res = await api.get(`/api/orders/branch/${branchId}${query}`, {
        headers,
      });
      console.log("fetch branch order success", res.data);
      return res.data;
    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch branch order"
      );
    }
  }
);

export const getOrdersByCashier = createAsyncThunk("order/getByCashier", 
  async(id, { rejectWithValue }) => {
    try { 
        const headers = getAuthHeaders();
            const res=await api.get(`/api/orders/cashier/${id}`,{
        headers,
        
      });
      console.log("fetch cashier order success", res.data)
      return res.data;

    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch cashier order"); 
    }
    
  }
);
export const getTodayOrdersByBranch = createAsyncThunk("order/getTodayByBranch", 
  async(branchId, { rejectWithValue }) => {
    try { 
        const headers = getAuthHeaders();
        const res=await api.get(`/api/orders/today/branch/${branchId}`,{
        headers,
        
      });
      console.log("fetch today branch order success", res.data)
      return res.data;

    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch today branch order"); 
    }
    
  }
);

export const deleteOrder = createAsyncThunk("order/delete", 
  async(id, { rejectWithValue }) => {
    try { 
        const headers = getAuthHeaders();
        const res=await api.delete(`/api/orders/${id}`,{
        headers,
        
      });
      console.log("delete order success", res.data)
      return res.data;

    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Failed to delete order"); 
    }
    
  }
);

export const getOrdersByCustomer = createAsyncThunk("order/getByCustomer", 
  async(customerId, { rejectWithValue }) => {
    try { 
        const headers = getAuthHeaders();
        const res=await api.get(`/api/orders/customer/${customerId}`,{
        headers,
        
      });
      console.log("fetch customer order success", res.data)
      return res.data;

    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch customer order"); 
    }
    
  }
);

export const getRecentOrdersByBranch = createAsyncThunk("order/getRecentByBranch", 
  async(branchId, { rejectWithValue }) => {
    try { 
        const headers = getAuthHeaders();
        const res=await api.get(`/api/orders/recent/${branchId}`,{
        headers,
        
      });
      console.log("fetch recent branch order success", res.data)
      return res.data;

    } catch (error) {
      console.log("error ", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch recent branch order"); 
    }
    
  }
);