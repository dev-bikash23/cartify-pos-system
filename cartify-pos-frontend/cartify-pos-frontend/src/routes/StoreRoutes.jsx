import Branches from '@/pages/store/Branch/Branches'
import Categories from '@/pages/store/Category/Categories'
import StoreDashboard from '@/pages/store/Dashboard/StoreDashboard'
import StoreDashboardLayout from '@/pages/store/Dashboard/StoreDashboardLayout'
import StoreEmployee from '@/pages/store/employee/StoreEmployee'
import Products from '@/pages/store/Product/Products'
import StoreInfo from '@/pages/store/StoreInfo/StoreInfo'
import Upgrade from '@/pages/store/upgrade/Upgrade'
import StoreAlerts from '@/pages/store/Alerts/StoreAlerts'
import StoreSales from '@/pages/store/Sales/StoreSales'
import StoreReports from '@/pages/store/Reports/StoreReports'
import StoreSettings from '@/pages/store/Settings/StoreSettings'
import Profile from '@/pages/superAdmin/Profile'

import React from 'react'

import { Route, Routes } from 'react-router-dom'
const StoreRoutes = () => {
  return (
     <Routes>
     <Route path='/' element={<StoreDashboardLayout/>}>

     <Route index element={<StoreDashboard />}/>
     <Route path="dashboard" element={<StoreDashboard />} />
     <Route path="branches" element={<Branches />} />
    <Route path="stores" element={<StoreInfo />} />
     <Route path="products" element={<Products />} />
     <Route path="categories" element={<Categories />} />
     <Route path="employees" element={<StoreEmployee />} />
    <Route path="alerts" element={<StoreAlerts />} />
    <Route path="sales" element={<StoreSales />} />
    <Route path="reports" element={<StoreReports />} />
     <Route path="upgrade" element={<Upgrade />} />
    <Route path="settings" element={<StoreSettings />} />
    <Route path="profile" element={<Profile />} />
    

     </Route>
   </Routes>
  )
}

export default StoreRoutes