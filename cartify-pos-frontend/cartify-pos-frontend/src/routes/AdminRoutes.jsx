import AdminDashboard from '@/pages/superAdmin/Dashboard/AdminDashboard'
import AdminLayout from '@/pages/superAdmin/AdminLayout'
import AdminSetting from '@/pages/superAdmin/AdminSetting'
import PendingRequest from '@/pages/superAdmin/PendingRequest'
import StoreList from '@/pages/superAdmin/StoreList'
import Subscriptions from '@/pages/superAdmin/Subscription/Subscriptions'
import { Route, Routes } from 'react-router-dom'
import React from 'react'
import Exports from '@/pages/superAdmin/Exports'

const AdminRoutes = () => {
  return (
     <Routes>
     <Route path='/' element={<AdminLayout/>}>

     <Route index element={<AdminDashboard />}/>
     <Route path="dashboard" element={<AdminDashboard />} />
     <Route path="stores" element={<StoreList />} />
     <Route path="requests" element={<PendingRequest />} />

     <Route path="subscriptions" element={<Subscriptions />} />
     <Route path="exports" element={<Exports />} />
     <Route path="settings" element={<AdminSetting />} />


     </Route>
   </Routes>
  )
}

export default AdminRoutes