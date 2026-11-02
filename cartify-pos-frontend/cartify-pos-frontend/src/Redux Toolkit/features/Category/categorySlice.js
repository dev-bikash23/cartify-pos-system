import Categories from "@/pages/store/Category/Categories";
import { createSlice } from "@reduxjs/toolkit";
import { createCategory, deleteCategory, getCategoryByStore, updateCategory } from "./categoryThunk";


const initialState = {
  Categories: [],
  loading: false,
  error: null,

};

const categorySlice=createSlice({
  name: "category",
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder 
        .addCase(createCategory.pending, (state) => {
          state.loading=true
        })
        .addCase(createCategory.fulfilled, (state, action)=>{
          state.loading=false;
          state.Categories.push(action.payload)
        })
        .addCase(createCategory.rejected, (state,action)=>{
          state.loading=false;
          state.error=action.payload;
        })

        .addCase(getCategoryByStore.pending, (state) => {
          state.loading = true;
        })
        .addCase(getCategoryByStore.fulfilled, (state, action)=>{
          state.loading=false;
          state.Categories=action.payload;
        })
        .addCase(getCategoryByStore.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(updateCategory.fulfilled, (state, action)=>{
          const index = state.Categories.findIndex((c) => c.id === action.payload.id);
          if (index !== -1) {
            state.Categories[index] = action.payload;
          }
        })

        .addCase(deleteCategory.fulfilled, (state, action)=>{
          state.Categories = state.Categories.filter((c) => c.id !== action.payload);
        });
  },

});

export default categorySlice.reducer;
