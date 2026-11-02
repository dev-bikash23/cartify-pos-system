import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/context/hook/useSidebar'
import { AlignJustify } from 'lucide-react'
import React from 'react'

const POSHeader = () => {
 const {setSidebarOpen} = useSidebar()
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
<div className='flex items-center space-x-2'>
  <Avatar>
  <AvatarImage src="https://cdn.pixabay.com/photo/2015/02/01/18/05/squirrel-619968_1280.jpg" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

</div>
      </div>
    </div>
  )
}

export default POSHeader