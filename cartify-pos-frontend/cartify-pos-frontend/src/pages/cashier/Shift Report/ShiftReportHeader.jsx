import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '@/context/hook/useSidebar'
import { endShift } from '@/Redux Toolkit/features/ShiftReport/shiftReportThunk'
import { logout as logoutUser } from '@/Redux Toolkit/features/User/userThunk'
import { logout as logoutAuth } from '@/Redux Toolkit/features/Auth/AuthSlice'

const ShiftReportHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { setSidebarOpen } = useSidebar()

  const handleEndShift = async () => {
    if (!window.confirm('Are you sure you want to end this shift and logout?')) {
      return
    }

    try {
      await dispatch(endShift()).unwrap()
      await dispatch(logoutUser()).unwrap()
      dispatch(logoutAuth())
      navigate('/', { replace: true })
    } catch (error) {
      console.error('End shift failed', error)
    }
  }

  return (
    <div className='p-4 bg-card border-b'>
      
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Button
            type="button"
            variant="outline"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className='text-2xl font-bold'>Shift Summary</h1>
        </div>
        <div className='flex gap-2'>

           <Button onClick={handleEndShift} className="bg-red-500 hover:bg-orange-500 text-white px-2 py-2 rounded-md" variant={"destructive"}>
             <ArrowRight />
              End Shift & Logout
           </Button>


        </div>

      </div>

    </div>
  )
}

export default ShiftReportHeader
