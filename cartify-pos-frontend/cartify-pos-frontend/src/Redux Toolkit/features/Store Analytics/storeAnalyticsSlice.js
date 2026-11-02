import { createSlice } from "@reduxjs/toolkit";
import {
  getBranchPerformance,
  getDailySales,
  getMonthlySales,
  getPaymentBreakDown,
  getRecentSales,
  getSalesByBranch,
  getSalesByCategory,
  getSalesByPaymentMethod,
  getSalesTrends,
  getStoreAlerts,
  getStoreOverview,
} from "./storeAnalyticsThunk";

const initialState = {
  storeOverview: null,
  recentSales: null,

  salesTrends: null,
  monthlySales: [],
  dailySales: [],

  salesByCategory: [],
  salesByPaymentMethod: [],
  paymentBreakdown: [],

  salesByBranch: [],
  branchPerformance: null,

  storeAlerts: null,

  loading: false,
  error: null,
};

const storeAnalyticsSlice = createSlice({
  name: "storeAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Store Overview
      .addCase(getStoreOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.storeOverview = action.payload;
      })
      .addCase(getStoreOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recent Sales
      .addCase(getRecentSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentSales.fulfilled, (state, action) => {
        state.loading = false;
        state.recentSales = action.payload;
      })
      .addCase(getRecentSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sales Trends
      .addCase(getSalesTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrends = action.payload;
      })
      .addCase(getSalesTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Monthly Sales
      .addCase(getMonthlySales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMonthlySales.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySales = action.payload;
      })
      .addCase(getMonthlySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Daily Sales
      .addCase(getDailySales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDailySales.fulfilled, (state, action) => {
        state.loading = false;
        state.dailySales = action.payload;
      })
      .addCase(getDailySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sales By Category
      .addCase(getSalesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.salesByCategory = action.payload;
      })
      .addCase(getSalesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sales By Payment Method
      .addCase(getSalesByPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesByPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.salesByPaymentMethod = action.payload;
      })
      .addCase(getSalesByPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sales By Branch
      .addCase(getSalesByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.salesByBranch = action.payload;
      })
      .addCase(getSalesByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Payment Breakdown
      .addCase(getPaymentBreakDown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentBreakDown.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentBreakdown = action.payload;
      })
      .addCase(getPaymentBreakDown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Branch Performance
      .addCase(getBranchPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.branchPerformance = action.payload;
      })
      .addCase(getBranchPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Store Alerts
      .addCase(getStoreAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.storeAlerts = action.payload;
      })
      .addCase(getStoreAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeAnalyticsSlice.reducer;