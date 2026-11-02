import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/context/hook/useSidebar'
import { AlignJustify } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NotificationPopover from '@/components/NotificationPopover'

const POSHeader = () => {
 const {setSidebarOpen} = useSidebar()
 const { userProfile } = useSelector((state) => state.user)
  return (
    <div className='bg-card border-b px-6 py-4'>
      <div className='flex items-center justify-between'>
<div>
  <Button 
   onClick={() => setSidebarOpen(true)}
   >
    <AlignJustify />
  </Button>
</div>
<div>
  <h1 className='text-2xl font-bold text-foreground'>POS Terminal</h1>
  <p className='text-sm text-muted-foreground'>Create new Order</p>
</div>
<div className='flex items-center space-x-3'>
  <NotificationPopover items={userProfile?.fullName ? [`Welcome back, ${userProfile.fullName}.`] : []} label="Cashier notifications" />
  <Link to="/cashier/profile" className="flex h-10 items-center gap-2 rounded-lg px-1 hover:bg-muted">
    <Avatar className="h-9 w-9">
      <AvatarImage src={userProfile?.profilePicture} />
      <AvatarFallback>{userProfile?.fullName?.charAt(0) || "C"}</AvatarFallback>
    </Avatar>
    <span className="hidden text-sm font-medium sm:inline">{userProfile?.fullName || "Cashier"}</span>
  </Link>

</div>
      </div>
    </div>
  )
}

export default POSHeader