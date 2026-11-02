import {
  createRefunds,
  getAllRefunds,
  getRefundById,
  getRefundsByBranch,
  getRefundsByCashier,
  getRefundsByCashierAndDateRange,
  getRefundsByShift,
} from "./refundThunk";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refunds: [],
  refundsByCashier: [],
  refundsByBranch: [],
  refundsByShift: [],
  refundsByCashierAndDateRange: [],
  selectedRefunds: null,
  loading: false,
  error: null,
};

const refundSlice = createSlice({
  name: "refund",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Refund
      .addCase(createRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds.push(action.payload);
      })
      .addCase(createRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Refunds
      .addCase(getAllRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds = action.payload;
      })
      .addCase(getAllRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Refunds by Cashier
      .addCase(getRefundsByCashier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundsByCashier.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByCashier = action.payload;
      })
      .addCase(getRefundsByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Refunds by Branch
      .addCase(getRefundsByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByBranch = action.payload;
      })
      .addCase(getRefundsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Refunds by Shift
      .addCase(getRefundsByShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundsByShift.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByShift = action.payload;
      })
      .addCase(getRefundsByShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Refunds by Cashier and Date Range
      .addCase(getRefundsByCashierAndDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundsByCashierAndDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByCashierAndDateRange = action.payload;
      })
      .addCase(getRefundsByCashierAndDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Refund by Id
      .addCase(getRefundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRefunds = action.payload;
      })
      .addCase(getRefundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default refundSlice.reducer;