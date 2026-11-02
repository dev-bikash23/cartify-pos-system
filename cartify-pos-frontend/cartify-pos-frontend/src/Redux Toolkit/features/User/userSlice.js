import { createSlice } from "@reduxjs/toolkit"
import {
  getAllCashier,
  getAllCustomer,
  getUserById,
  getUserProfile,
  logout,
  updateUserProfile,
  getAdminUsers,
  updateAdminUserStatus,
  updateAdminUserRole,
} from "./userThunk";


const initialState={
  userProfile:null,
  users:[],
  customers:[],
  cashiers:[],
  adminUsers: [],
  selectedUser:null,
  loading:false,
  profileLoading:false,
  error:null,

}

const userSlice=createSlice({
  name:"user",
  initialState,
  reducers:{
    clearUserState:(state)=>{
      state.userProfile=null;
      state.selectedUser=null;
      state.users=[],
      state.customers=[],
      state.cashiers=[],
      state.loading=false,
      state.error=null

    }
  },

  extraReducers: (builder)=>{
    builder.addCase(getUserProfile.pending, (state)=>{
      state.profileLoading=true,
      state.error=null,
      state.userProfile=null;
    })
    .addCase(getUserProfile.fulfilled, (state, action)=>{
      state.profileLoading=false,
      state.error=null,
      state.userProfile=action.payload;
    })
    .addCase(getUserProfile.rejected, (state, action)=>{
      state.profileLoading=false,
      state.error=action.payload;
    })
    .addCase(getAllCustomer.fulfilled, (state, action)=>{
      state.customers=action.payload;
    })

     .addCase(getAllCashier.fulfilled, (state, action)=>{
      state.cashiers=action.payload;
    })

     .addCase(getUserById.fulfilled, (state, action)=>{
      state.selectedUser=action.payload;
    })
     .addCase(updateUserProfile.pending, (state)=>{
      state.loading=true;
      state.error=null;
    })
     .addCase(updateUserProfile.fulfilled, (state, action)=>{
      state.loading=false;
      state.userProfile=action.payload;
    })
     .addCase(updateUserProfile.rejected, (state, action)=>{
      state.loading=false;
      state.error=action.payload;
    })
     .addCase(getAdminUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
     .addCase(getAdminUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.adminUsers = action.payload;
    })
     .addCase(getAdminUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
     .addCase(updateAdminUserStatus.fulfilled, (state, action) => {
      state.adminUsers = state.adminUsers.map((user) => user.id === action.payload.id ? action.payload : user);
    })
     .addCase(updateAdminUserRole.fulfilled, (state, action) => {
      state.adminUsers = state.adminUsers.map((user) => user.id === action.payload.id ? action.payload : user);
    })
     .addCase(logout.fulfilled, (state, action)=>{
      state.userProfile = null;
      state.selectedUser = null;
      state.error = null;
    })

    
  }
})

export default userSlice.reducer;