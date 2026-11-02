import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useSelector } from 'react-redux'
// const shiftData={
//   cashier:{
//     fullName:"Pablo Panday",
   
//   },
//   shiftStart: "Aug 8, 2025, 09:34 AM",
//   shiftEnd: "",
//   totalOrders: 59,
//   totalSales: 69999,
//   totalRefund: 21999,
//   netSales: 4800,

// }

const SalesSummaryCard = () => {
   const shiftData = useSelector(state => state.shiftReport.currentShifts)
   const totalSales = Number(shiftData?.totalSales ?? 0)
   const totalRefunds = Number(shiftData?.totalRefunds ?? 0)
   const netSales = totalSales - totalRefunds

  return (
    <Card> 
      <CardContent>
        
        <h2 className="text-xl font-semibold mb-4">Sales Summary</h2>

        <div className="space-y-2">

           <div className='flex justify-between'>
          <span className='text-muted-foreground'>Total Orders: </span>
          <span className="font-medium">{shiftData?.totalOrders ?? 0}</span>
               
         </div>
         <div className='flex justify-between'>
          <span className='text-muted-foreground'>Total Sales: </span>
          <span className="font-medium">₹{totalSales.toLocaleString('en-IN')}</span>
               
         </div>
          <div className='flex justify-between'>
          <span className='text-muted-foreground'>Total Refund: </span>
          <span className="font-medium text-red-500">-₹{totalRefunds.toLocaleString('en-IN')}</span>
               
         </div>
          <div className='flex justify-between border-t'>
          <span className='text-muted-foreground'>Net Sales: </span>
          <span className="font-medium text-green-500">₹{netSales.toLocaleString('en-IN')}</span>
               
         </div>

        </div>
      </CardContent>
      
    </Card>
  )
}

export default SalesSummaryCard