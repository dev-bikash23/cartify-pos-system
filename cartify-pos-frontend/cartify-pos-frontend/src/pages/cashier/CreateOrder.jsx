import React from 'react'
import CartSection from './CartSection/CartSection'
import CustomerPaymentSection from './CustomerPaymentSection/CustomerPaymentSection'
import ProductSection from './ProductSection/ProductSection'
import POSHeader from './Header/POSHeader'

const CreateOrder = () => {
  return (
    <div className='h-full flex flex-col bg-background'>
      <POSHeader />
      <div className='flex-1 flex overflow-hidden'>
        <ProductSection />
        <CartSection />
        <CustomerPaymentSection />
      </div>
    </div>
  )
}

export default CreateOrder