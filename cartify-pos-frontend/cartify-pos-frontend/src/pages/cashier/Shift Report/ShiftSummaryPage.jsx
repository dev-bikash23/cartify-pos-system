import React from 'react'
import ShiftReportHeader from './ShiftReportHeader'
import ShiftInformation from './ShiftInformation'
import SalesSummaryCard from './SalesSummaryCard'
import PaymentSummaryCard from './PaymentSummaryCard'
import RecentOrdersTable from './RecentOrdersTable'
 import TopSellingItems from "./TopSellingItems";
import RefundTable from './RefundTable'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getCurrentShiftProgress } from '@/Redux Toolkit/features/ShiftReport/shiftReportThunk'
import { getOrdersByCashier } from '@/Redux Toolkit/features/Order/orderThunk'
import { getRefundsByCashier, getRefundsByShift } from '@/Redux Toolkit/features/Refund/refundThunk'

const ShiftSummaryPage = () => {
  const dispatch=useDispatch();
  const userProfile = useSelector((state) => state.user?.userProfile);
  const loginUser = useSelector((state) => state.auth?.user?.userDto);
  const branchId = userProfile?.branchId ?? loginUser?.branchId;
  const cashierId = userProfile?.id ?? loginUser?.id;
  const shiftId = useSelector((state) => state.shiftReport?.currentShifts?.id);

  useEffect(()=>{
    dispatch(getCurrentShiftProgress());
  }, [dispatch])

  useEffect(() => {
    if (!cashierId) return;

    dispatch(getOrdersByCashier(cashierId));
    dispatch(getRefundsByCashier(cashierId));
    if (shiftId) dispatch(getRefundsByShift(shiftId));
  }, [cashierId, dispatch, shiftId])
  return (
    <div className='h-full flex flex-col'>

      <ShiftReportHeader />
      <div className='flex-1 overflow-auto p-4'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ShiftInformation />
          <SalesSummaryCard />

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <PaymentSummaryCard />
          <TopSellingItems />

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <RecentOrdersTable />
          <RefundTable />

        </div>

      </div>

    </div>
  )
}

export default ShiftSummaryPage