import React, { useEffect } from 'react'
import TodayOverview from './TodayOverview'
import PaymentBreakdown from './PaymentBreakdown'
import SalesChart from './SalesChart'
import TopProducts from './TopProducts'
import CashierPerformance from './CashierPerformance'
import RecentOrder from './RecentOrder'
import { useDispatch, useSelector } from 'react-redux'
import { getPaymentBreakdown, getTodayOverview } from '@/Redux Toolkit/features/Branch Analytics/branchAnalyticsThunk'

const Dashboard = () => {
  const { branch: fetchedBranch } = useSelector((state) => state.branch);
  const branch = fetchedBranch;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!branch?.id) return;

    const today = new Date().toISOString().slice(0, 10);
    dispatch(getTodayOverview({ branchId: branch.id }));
    dispatch(getPaymentBreakdown({ branchId: branch.id, date: today }));
  }, [branch?.id, dispatch]);

  return (
    <div className="space-y-6">

      <div className='flex justify-between items-center'>
       <h1 className='text-3xl font-bold tracking-tight'>Branch DashBoard</h1>
         
         {branch&& <p className='text-gray-600 text-lg'>{branch.name}</p>}

      </div>
      <TodayOverview />
      <PaymentBreakdown />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesChart />
        <TopProducts />

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CashierPerformance />
        <RecentOrder />

      </div>
    </div>
  )
}

export default Dashboard