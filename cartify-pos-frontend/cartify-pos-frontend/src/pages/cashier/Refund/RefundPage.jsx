import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useSidebar } from "@/context/hook/useSidebar";
import OrderTable from './OrderTable'
import OrderDetailSection from './OrderDetailSection'
import ReturnItemSection from './ReturnItemSection'
import ReturnReceiptDialog from './ReturnReceiptDialog'

const RefundPage = () => {

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReturnReceiptDialog, setShowReturnReceiptDialog] = useState(false);
  const { setSidebarOpen } = useSidebar();
  const handleSelectOrder=(order)=>setSelectedOrder(order)

  return (
    <div className='h-full flex flex-col'>
      <div className='p-4 bg-card border-b'>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className='text-2xl font-bold'>
            Return/Refund
          </h1>
        </div>
      </div>

      <div className='overflow-hidden'>
       {!selectedOrder ? (
        <OrderTable handleSelectOrder={handleSelectOrder}/>
       ):(
        <div className="flex">
        <OrderDetailSection selectedOrder={selectedOrder}
        handleSelectOrder={handleSelectOrder}/>
        <ReturnItemSection selectedOrder={selectedOrder}
                           setShowReturnReceiptDialog={setShowReturnReceiptDialog}
        />
        </div>
       )}
      </div>
        
      {selectedOrder&& <ReturnReceiptDialog showReturnReceiptDialog={showReturnReceiptDialog}
                                            selectedOrder={selectedOrder}
                                            setShowReturnReceiptDialog={setShowReturnReceiptDialog}
        />}

    </div>
  )
}

export default RefundPage