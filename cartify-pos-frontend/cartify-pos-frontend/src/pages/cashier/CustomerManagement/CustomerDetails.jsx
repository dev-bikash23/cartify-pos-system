import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, ShoppingBag, StarIcon, UserPlus } from 'lucide-react';
import React from 'react'

const CustomerDetails = ({customer}) => {
  if(!customer) {
    return 
  }

  const loyaltyPoints = customer.loyalPoints ?? customer.loyaltyPoints ?? 0;

  return (
    <div className='p-4'>
      <div className='mb-6'>
        <div>
          <h2>{customer.fullName}</h2>
          <p className="text-sm text-muted-foreground">
            {customer.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {customer.phone}
          </p>

        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 mb-6 md:grid-cols-3'>

        <Card >
          <CardHeader>
            <CardTitle>Loyalty Points</CardTitle>
          </CardHeader>
         <CardContent>
           <div className="flex items-center gap-2">
             <StarIcon className="h-5 w-5 text-yellow-500" />
              <span>{loyaltyPoints} Points</span>
          </div>
          </CardContent>
       </Card>

         <Card >
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
         <CardContent>
           <div className="flex items-center gap-2">
             <StarIcon className="h-5 w-5 text-yellow-500" />
              <span>{customer.totalOrders} Orders</span>
          </div>
       </CardContent>
        </Card><Card >
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
         <CardContent>
           <div className="flex items-center gap-2">
             <StarIcon className="h-5 w-5 text-yellow-500" />
              <span>{customer.totalSpent} $</span>
          </div>
       </CardContent>
        </Card>
        

      </div>

      <Card className="border-emerald-100 bg-emerald-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-emerald-600" />
            Earn More Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Points are added automatically after a completed purchase.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg bg-white p-3">
              <ShoppingBag className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm font-medium">Shop regularly</p>
                <p className="text-xs text-muted-foreground">Earn points on every completed order.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-3">
              <StarIcon className="mt-0.5 h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Choose eligible items</p>
                <p className="text-xs text-muted-foreground">Look for products included in promotions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-white p-3">
              <UserPlus className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm font-medium">Keep details updated</p>
                <p className="text-xs text-muted-foreground">Use the same customer profile at checkout.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default CustomerDetails