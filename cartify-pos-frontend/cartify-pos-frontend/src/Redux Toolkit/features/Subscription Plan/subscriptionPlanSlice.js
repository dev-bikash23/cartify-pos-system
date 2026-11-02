import { createSlice } from "@reduxjs/toolkit";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  getAvailableSubscriptionPlans,
  getCurrentStoreSubscription,
  createStoreSubscriptionCheckout,
  activateFreeStoreSubscription,
  verifyStoreSubscriptionPayment,
} from "./subscriptionPlanThunk";

const initialState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
  currentSubscription: null,
  checkout: null,
};

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(action.payload);
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.map((plan) =>
          plan.id === action.payload.id ? action.payload : plan
        );
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getAllSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get By Id
      .addCase(getSubscriptionPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(getSubscriptionPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter(
          (plan) => plan.id !== action.meta.arg
        );
      })
      .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAvailableSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getAvailableSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentStoreSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      })
      .addCase(getCurrentStoreSubscription.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createStoreSubscriptionCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStoreSubscriptionCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createStoreSubscriptionCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(activateFreeStoreSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      })
      .addCase(verifyStoreSubscriptionPayment.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
        state.checkout = null;
      });
  },
});

export default subscriptionPlanSlice.reducer;