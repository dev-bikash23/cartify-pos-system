import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { selectHeldOrders, resumeOrder } from '@/Redux Toolkit/features/Cart/cartSlice';
import { Play } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const HeldOrderDialog = ({ showHeldOrdersDialog, setShowHeldOrdersDialog }) => {
  const dispatch = useDispatch();
  const heldOrders = useSelector(selectHeldOrders);

  const handleResumeOrder = (order) => {
    dispatch(resumeOrder(order));
    setShowHeldOrdersDialog(false);
  };

  return (
    <Dialog open={showHeldOrdersDialog} onOpenChange={setShowHeldOrdersDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Held Orders</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {heldOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No held orders
            </p>
          ) : (
            heldOrders.map((order) => (
              <Card key={order.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-semibold text-base">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} Items
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <Button size="sm" onClick={() => handleResumeOrder(order)}>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeldOrderDialog;