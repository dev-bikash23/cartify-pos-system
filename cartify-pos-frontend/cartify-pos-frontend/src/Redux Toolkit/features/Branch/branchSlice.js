import { createSlice } from "@reduxjs/toolkit";
import {
  createBranch,
  deleteBranch,
  getAllBranchesByStore,
  getBranchById,
  updateBranch,
} from "./branchThunk";

const initialState = {
  branch: null,
  branches: [],
  employees: [],
  loading: false,
  error: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Branch
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload);
        if (state.branch?.id === action.payload.id) {
          state.branch = action.payload;
        }
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Branch By Id
      .addCase(getBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.branch = action.payload;
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Branches By Store
      .addCase(getAllBranchesByStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBranchesByStore.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getAllBranchesByStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Branch
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branch = action.payload;
        state.branches = state.branches.map((branch) =>
          branch.id === action.payload.id ? action.payload : branch
        );
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = state.branches.filter((branch) => branch.id !== action.payload);
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default branchSlice.reducer;