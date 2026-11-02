import { createSlice } from "@reduxjs/toolkit";
import {
  getStoreRegistrations,
  getStoreStatusDistribution,
  getSuperAdminDashboardOverview,
} from "./adminDashboardThunk";

const initialState = {
  overview: null,
  registrations: [],
  statusDistribution: [],
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSuperAdminDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSuperAdminDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(getSuperAdminDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStoreRegistrations.fulfilled, (state, action) => {
        state.registrations = action.payload;
      })
      .addCase(getStoreRegistrations.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getStoreStatusDistribution.fulfilled, (state, action) => {
        state.statusDistribution = action.payload;
      })
      .addCase(getStoreStatusDistribution.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;