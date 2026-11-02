import { Card, CardContent } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

// const shiftData={
//   paymentSummaries:[
//     {
//       type:"CASH",
//       totalAmount:2999,
//       transactionCount:6
//     },
//     {
//       type:"CARD",
//       totalAmount:3499,
//       transactionCount:8
//     },
//     {
//       type:"UPI",
//       totalAmount:48499,
//       transactionCount:39
//     }
//   ],
//   totalSales: 69999,
// }

const PaymentSummaryCard = () => {
  const shiftData = useSelector(state => state.shiftReport.currentShifts)
  const totalSales = Number(shiftData?.totalSales ?? 0)

  return (
   <Card>
     <CardContent className={"p-6"}>
       
       <h2 className='text-xl font-semibold mb-4'>Payment Summary</h2>
       <div className='space-y-4'>
        
        {
          shiftData?.paymentSummaries?.map((payment) => {
            const amount = Number(payment?.totalAmount ?? 0)
            const percentage = totalSales > 0 ? ((amount / totalSales) * 100) : 0

            return (
              <div className='flex items-center' key={payment.type}>
                <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4'>
                  <CreditCard />
                </div>

                <div className='flex-1'>
                  <div className='flex justify-between'>
                    <span className='font-medium'>{payment.type}</span>
                    <span className='font-bold'>₹ {amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{payment.transactionCount} transactions</span>
                    <span>{percentage.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )
          })
        }

       </div>

     </CardContent>
   </Card>
  )
}

export default PaymentSummaryCard