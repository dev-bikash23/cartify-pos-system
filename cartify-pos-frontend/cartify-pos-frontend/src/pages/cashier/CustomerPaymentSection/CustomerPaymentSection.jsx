import React from 'react'
import CustomerSection from './CustomerSection'
import DiscountSection from './DiscountSection'
import PaymentSection from './PaymentSection'
import NoteSection from './NoteSection'

const CustomerPaymentSection = () => {
  return (
    <div className='w-1/5 flex flex-col bg-card'>
      <CustomerSection/>
      <DiscountSection />
      <NoteSection />
      <PaymentSection />

    </div>
  )
}

export default CustomerPaymentSection