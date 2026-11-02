import BranchLayout from '@/pages/branch/BranchLayout/BranchLayout'
import Customers from '@/pages/branch/Customers/Customers'
import Dashboard from '@/pages/branch/Dashboard/Dashboard'
import BranchEmployee from '@/pages/branch/employee/BranchEmployee'
import Inventory from '@/pages/branch/inventory/Inventory'
import Orders from '@/pages/branch/order/Orders'
import Reports from '@/pages/branch/reports/Reports'
import Settings from '@/pages/branch/Settings/Settings'
import Transactions from '@/pages/branch/Transaction/Transactions'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const BranchRoutes = () => {
  return (
   <Routes>
     <Route path='/' element={<BranchLayout/>}>

     <Route index element={<Dashboard />}/>
     <Route path="dashboard" element={<Dashboard />} />
     <Route path="orders" element={<Orders />} />
     <Route path="transaction" element={<Transactions />} />
     <Route path="inventory" element={<Inventory />} />
     <Route path="employees" element={<BranchEmployee />} />
     <Route path="customers" element={<Customers />} />
     <Route path="reports" element={<Reports />} />
     <Route path="settings" element={<Settings />} />

     </Route>
   </Routes>
  )
}

export default BranchRoutes