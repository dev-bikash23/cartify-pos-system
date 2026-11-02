import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "./customerThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearCustomerState: (state) => {
      state.customers = [];
      state.selectedCustomer = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (
          state.selectedCustomer &&
          state.selectedCustomer.id === action.payload.id
        ) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (customer) => customer.id !== action.payload
        );
        if (
          state.selectedCustomer &&
          state.selectedCustomer.id === action.payload
        ) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Customer By Id
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Customers
      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;