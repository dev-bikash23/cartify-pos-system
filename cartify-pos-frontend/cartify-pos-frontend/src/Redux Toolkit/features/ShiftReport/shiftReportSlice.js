import { createSlice } from "@reduxjs/toolkit";
import {
  getShiftsByBranch,
  getShiftsByCashier,
  startShift,
  endShift,
  getCurrentShiftProgress,
  getShiftsReportByDate,
  getShiftsById,
} from "./shiftReportThunk";

const initialState = {
  shifts: [],
  currentShifts: null,
  selectedShift: null,
  shiftsByCashier: [],
  shiftsByBranch: [],
  loading: false,
  error: null,
};

const shiftReportSlice = createSlice({
  name: "shiftReport",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Start Shift
      .addCase(startShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShifts = action.payload;
        state.selectedShift = action.payload;
        state.shifts.push(action.payload);
      })
      .addCase(startShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // End Shift
      .addCase(endShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endShift.fulfilled, (state, action) => {
        state.loading = false;

        if (state.currentShifts && state.currentShifts.id === action.payload.id) {
          state.currentShifts = action.payload;
        }

        const index = state.shifts.findIndex(
          (shift) => shift.id === action.payload.id
        );
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
      })
      .addCase(endShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Current Shift Progress
      .addCase(getCurrentShiftProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentShiftProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShifts = action.payload;
      })
      .addCase(getCurrentShiftProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Shift Report by Date
      .addCase(getShiftsReportByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftsReportByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShift = action.payload;
      })
      .addCase(getShiftsReportByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Shifts by Cashier
      .addCase(getShiftsByCashier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftsByCashier.fulfilled, (state, action) => {
        state.loading = false;
        state.shiftsByCashier = action.payload;
      })
      .addCase(getShiftsByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Shifts by Branch
      .addCase(getShiftsByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.shiftsByBranch = action.payload;
      })
      .addCase(getShiftsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Shift by Id
      .addCase(getShiftsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShift = action.payload;
      })
      .addCase(getShiftsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shiftReportSlice.reducer;