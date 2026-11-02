import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const ShiftInformation = () => {
  const shift = useSelector((state) => state.shiftReport?.currentShifts)
  const userProfile = useSelector((state) => state.user?.userProfile)

  const shiftStart = shift?.shiftStart
    ? new Date(shift.shiftStart).toLocaleString()
    : 'Not started'
  const shiftEnd = shift?.shiftEnd
    ? new Date(shift.shiftEnd).toLocaleString()
    : 'ongoing'
  const cashierName = shift?.cashier?.fullName || userProfile?.fullName || 'Unknown'

  const dispatch=useDispatch();

  const shiftData=useSelector(state=>state.shiftReport.currentShifts)

  return (
  
    <Card> 
      <CardContent>
        
        <h2 className="text-xl font-semibold mb-4">Shift Information</h2>

        <div className="space-y-2">

           <div className='flex justify-between'>
          <span className='text-muted-foreground'>Cashier: </span>
          <span className="font-medium">{cashierName}</span>
               
         </div>
         <div className='flex justify-between'>
          <span className='text-muted-foreground'>Shift Start: </span>
          <span className="font-medium">{shiftStart}</span>
               
         </div>
          <div className='flex justify-between'>
          <span className='text-muted-foreground'>Shift End: </span>
          <span className="font-medium">{shiftEnd}</span>
               
         </div>
          <div className='flex justify-between'>
          <span className='text-muted-foreground'>Duration: </span>
          <span className="font-medium">{"8 hours"}</span>
               
         </div>

        </div>
      </CardContent>
      
    </Card>
  )
}

export default ShiftInformation