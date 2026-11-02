import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';

const ReturnReceiptDialog = ({
  showReturnReceiptDialog,
  setShowReturnReceiptDialog,
  selectedOrder,
}) => {

    const handlePrint=()=>{
      window.print();
      setShowReturnReceiptDialog(false)
    }
  if (!selectedOrder) return null;

  return (
    <Dialog
      open={showReturnReceiptDialog}
      onOpenChange={setShowReturnReceiptDialog}
    >
      <DialogContent
        className="
          sm:max-w-xl
          w-[80vw]
          max-h-[80vh]
          overflow-y-auto

          [&>button]:rounded-full
          [&>button]:border
          [&>button]:border-green-700
          [&>button]:text-green-700
          [&>button:hover]:bg-green-100
          [&>button:hover]:text-green-800
        "
      >
        <DialogHeader>
          <DialogTitle>Return Receipt</DialogTitle>
        </DialogHeader>

        <div className="bg-background">
          <div>
            <h3 className="font-bold text-lg">Bhubaneswar D-MART</h3>
            <p>123 main Street, city</p>
            <p>Tel : 123-456-7890</p>
          </div>

          <div className="text-center my-4">
            <h4 className="font-bold">Return Receipt</h4>
          </div>

          <div className="mb-4">
            <p>Return #: RTN - {Date.now().toString().substring(8)}</p>
            <p>Original Order : {selectedOrder.id}</p>
            <p>Date : {new Date().toLocaleDateString()}</p>
            <p>Customer : {selectedOrder?.customer?.fullName}</p>
          </div>

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
          <DialogFooter>
            <Button onClick={handlePrint}>
              <PrinterIcon className="h-4 w-4"/>
              Print & Complete
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnReceiptDialog;