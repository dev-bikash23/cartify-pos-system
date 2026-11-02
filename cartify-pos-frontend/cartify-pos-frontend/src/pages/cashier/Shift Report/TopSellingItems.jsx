import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { useSelector } from 'react-redux'

// const shiftData={
//   topSellingProducts:[
//     {
//       id:"2",
//       name:"Men Geometric Print Polo Neck Pure Cotton Black T-Shirt",
//       sellingPrice:899,
//       quantity:5,
//     },
//     {
//       id: 5,
//       name:"Women Geometric Print Polo Neck Pure Cotton Black T-Shirt",
//       sellingPrice:499,
//       quantity:9,
//     },
//   ],
// };

const TopSellingItems = () => {
  const shiftData=useSelector(state=>state.shiftReport.currentShifts)
  const orders = useSelector((state) => state.order?.orders ?? [])
  const shiftProducts = (
    shiftData?.topSellingProducts ??
    shiftData?.topSellingItems ??
    shiftData?.topProducts ??
    []
  )
  const orderProducts = Object.values(
    orders.flatMap((order) => order.items ?? []).reduce((grouped, item) => {
      const id = item.productId ?? item.product?.id ?? item.productName ?? item.name
      const current = grouped[id] ?? {
        id,
        name: item.productName ?? item.name ?? item.product?.name ?? 'Unknown product',
        price: item.unitPrice ?? item.sellingPrice ?? item.product?.sellingPrice ?? item.price ?? 0,
        quantity: 0,
      }
      current.quantity += Number(item.quantity ?? item.quantitySold ?? 0)
      grouped[id] = current
      return grouped
    }, {})
  )
  const products = (shiftProducts.length ? shiftProducts : orderProducts).map((product) => ({
    id: product.id ?? product.productId ?? product.product?.id,
    name: product.name ?? product.productName ?? product.product?.name ?? 'Unknown product',
    price: product.sellingPrice ?? product.price ?? product.product?.sellingPrice ?? 0,
    quantity: product.quantity ?? product.quantitySold ?? product.totalQuantity ?? 0,
  }))
  return (
    <Card>
      <CardContent>
        <h2 className='text-xl font-semibold mb-4'>Top Selling Items</h2>
        <div className='space-y-3'>
          {products.map((product,index)=>(
           <div key={product.id ?? `${product.name}-${index}`} className="flex items-center">

            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center
             justify-center mr-3 text-sm font-medium">

              {index+1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span>{product.name}</span>
                <span>₹{product.price}</span>

              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{product.quantity} units sold</span>
              </div>


            </div>

           </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No items sold in this shift.
            </p>
          )}

        </div>
      </CardContent>

    </Card>
  )
}

export default TopSellingItems