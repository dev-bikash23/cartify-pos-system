import { createSlice } from "@reduxjs/toolkit";
import {
  createStore,
  getAllStores,
  getStoreByAdmin,
  getStoreByEmployee,
  getStoreById,
  moderateStore,
  updateStore,
} from "./storeThunk";

const initialState = {
  store: null,
  stores: [],
  employees: [],
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Store
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Store By Id
      .addCase(getStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Stores
      .addCase(getAllStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Store
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Store By Admin
      .addCase(getStoreByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(getStoreByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Store By Employee
      .addCase(getStoreByEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(getStoreByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Moderate Store — update store in list after moderation
      .addCase(moderateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moderateStore.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.stores = state.stores.map((store) =>
          store.id === updated.id ? updated : store
        );
      })
      .addCase(moderateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeSlice.reducer;