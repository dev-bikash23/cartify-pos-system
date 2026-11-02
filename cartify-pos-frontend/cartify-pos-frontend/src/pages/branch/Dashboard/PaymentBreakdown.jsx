import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
const PaymentBreakdown = () => {
  const paymentBreakdowns = useSelector((state) => state.branchAnalytics.paymentBreakdown)
  const loading = useSelector((state) => state.branchAnalytics.loading)

  return (
   <Card>
    <CardHeader>
      <CardTitle className={"text-xl font-semibold"}>
        Payment Breakdown
      </CardTitle>
    </CardHeader>

     <CardContent>
      <div className='space-y-4'>

        {loading && !paymentBreakdowns.length ? (
          <p className="text-sm text-gray-500">Loading payment breakdown...</p>
        ) : paymentBreakdowns.map((payment) => (
  <div
    key={payment.type}
    className="flex items-center justify-between"
  >
    <div className="flex items-center gap-2">
      <CreditCard />
      <span>{payment.type}</span>
    </div>

    <div className="flex items-center gap-4">

      <div className="w-32 h-2 bg-red-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary"
          style={{ width: `${payment.percentage ?? 0}%` }}
        />
      </div>

      <span className="text-sm font-medium">
        ₹{payment.totalAmount}
      </span>

      <span className="text-xs text-gray-500">
        {payment.percentage}%
      </span>

      <span className="text-xs text-gray-500">
        {payment.transactionCount} txns
      </span>

    </div>
  </div>
))}

      </div>

     </CardContent>
   </Card>
  )
}

export default PaymentBreakdown