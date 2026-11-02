import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getOrdersByBranch,
  getOrderById,
  getOrdersByCashier,
  getTodayOrdersByBranch,
  getOrdersByCustomer,
  getRecentOrdersByBranch,
  deleteOrder,
} from "./orderThunk";

const initialState = {
  orders: [],
  todayOrders: [],
  selectedOrder: null,
  customerOrders: [],
  recentOrders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Order By Id
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Orders By Branch
      .addCase(getOrdersByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Orders By Cashier
      .addCase(getOrdersByCashier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByCashier.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Today Orders By Branch
      .addCase(getTodayOrdersByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodayOrdersByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.todayOrders = action.payload;
      })
      .addCase(getTodayOrdersByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Orders By Customer
      .addCase(getOrdersByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrders = action.payload;
      })
      .addCase(getOrdersByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Recent Orders By Branch
      .addCase(getRecentOrdersByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentOrdersByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(getRecentOrdersByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((order) => order.id !== action.meta.arg);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;