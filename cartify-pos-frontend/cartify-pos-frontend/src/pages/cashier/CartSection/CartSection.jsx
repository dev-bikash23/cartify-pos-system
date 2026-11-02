import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Pause } from 'lucide-react'
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import HeldOrderDialog from './HeldOrderDialog'
import { useSelector } from 'react-redux'
import { clearCart, selectCartItems, selectHeldOrders } from '@/Redux Toolkit/features/Cart/cartSlice'
import { useDispatch } from 'react-redux'

//   const cartItems=[
//   {
//     name:"Men Slim Fit Checkered Spread Collar Casual Shirt (Pack or 2)",
//     sku: "SKU-COTTON-BLACK-2026",
//     quantity: 2,
//     sellingPrice: 799
//   },
//   {
//     name:"Men Slim Fit Checkered Spread Collar Casual Shirt (Pack or 2)",
//     sku: "SKU-COTTON-BLACK-2026",
//     quantity: 2,
//     sellingPrice: 799
//   },
//   {
//     name:"Men Slim Fit Checkered Spread Collar Casual Shirt (Pack or 2)",
//     sku: "SKU-COTTON-BLACK-2026",
//     quantity: 2,
//     sellingPrice: 799
//   },
//  ];
const CartSection = () => {
  const[showHeldOrdersDialog, setShowHeldOrdersDialog] = React.useState(false);
  const cartItems=useSelector(selectCartItems);
 
  const dispatch=useDispatch();

  const handleClearCart=()=>{
    dispatch(clearCart())
  }
  return (
    <>
     <div className='border-r w-2/5 flex flex-col bg-card'>

      <div className='p-4 border-b bg-muted'>

        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center'>
            <ShoppingCart/>Cart ( {cartItems.length} )  item</h2>

          <div className="flex space-x-2">
            <Button onClick={() => setShowHeldOrdersDialog(true)} variant={"outline"} className="" size={"sm"} >
               <Pause className="w-4 h-4 mr-1" />
                   Held
            </Button>

            <Button onClick={handleClearCart}
            variant={"outline"} className="" size={"sm"} >
               <Trash2 className="w-4 h-4 mr-1" />
                   Clear
            </Button>

          </div>
        </div>

      </div>

      <div className="p-4 space-y-3" >
        {
          cartItems.map((item, index) => (
            <CartItem item={item} key={index}/>
          ))
        }
      </div>
      {
        cartItems.length > 0 && (
          <CartSummary />
        )
      }
    </div>
    <HeldOrderDialog showHeldOrdersDialog={showHeldOrdersDialog}
    setShowHeldOrdersDialog={setShowHeldOrdersDialog} />
    </>
  );
}

export default CartSection