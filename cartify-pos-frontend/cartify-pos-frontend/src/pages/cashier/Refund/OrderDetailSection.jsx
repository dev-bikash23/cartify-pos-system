import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";''

const OrderDetailSection = ({handleSelectOrder, selectedOrder}) => {
  return (
    <div className='w-1/2 border-r p-4'>
      <div className='mb-4'>
        <Button onClick={()=>handleSelectOrder(null)}> 
         <ChevronLeft />
          back to order table
        </Button>

      </div>
      <Card>
        <CardContent>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h2 className='font-semibold text-lg'>Order {selectedOrder.id}</h2>
              <p>{selectedOrder.createdAt}</p>
            </div>
            <Badge variant={"outline"}>
              {selectedOrder.paymentType}
            </Badge>
          </div>
          <div className='mb-4'>
            <h3 className='font-medium text-sm text-muted-foreground mb-2'>
              {selectedOrder?.customer?.fullName}</h3>
            <h3 className="text-sm">{selectedOrder?.customer?.phone}</h3>
          </div>
          <div>
            <h2 className='font-medium text-sm text-muted-foreground mb-2'>
              Order Summary {selectedOrder.totalAmount}</h2>
              <div className='flex justify-between'>
                <span>Total Items : {selectedOrder.items.length}</span>

              </div>
              <div>
                <span>Order Total: ${selectedOrder.totalAmount}</span>
              </div>
          </div>
        </CardContent>
      </Card>

     <div className='flex-1 overflow-auto mt-10'>
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selectedOrder.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product?.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted" />
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="truncate max-w-[220px]">
                        {item.product?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        SKU: {item.product?.sku}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center font-semibold text-green-600">
                    {item.quantity?.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-green-600">
                    ₹{item.product?.sellingPrice}
                  </TableCell>

                  <TableCell className="text-right">
                    ₹{(item.product?.sellingPrice * item.quantity)?.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>    
     </div>

    </div>
  )
}

export default OrderDetailSection
