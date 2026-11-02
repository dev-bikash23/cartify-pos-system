import { createSlice } from "@reduxjs/toolkit";
import {
  createInventory,
  deleteInventory,
  getInventoryByBranch,
  getInventoryById,
  getInventoryByProduct,
  updateInventory,
} from "./inventoryThunk";

const initialState = {
  inventories: [],
  inventory: null,
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Inventory
      .addCase(createInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories.push(action.payload);
      })
      .addCase(createInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Inventory
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.inventories.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.inventories[index] = action.payload;
        }
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Inventory
      .addCase(deleteInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = state.inventories.filter(
          (inv) => inv.id !== action.payload
        );
      })
      .addCase(deleteInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Inventory By Id
      .addCase(getInventoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInventoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(getInventoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Inventory By Branch
      .addCase(getInventoryByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInventoryByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload;
      })
      .addCase(getInventoryByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Inventory By Product
      .addCase(getInventoryByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInventoryByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(getInventoryByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;