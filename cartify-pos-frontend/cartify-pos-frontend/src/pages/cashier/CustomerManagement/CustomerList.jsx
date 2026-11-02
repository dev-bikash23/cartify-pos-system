import React from 'react'
import CustomerCard from './CustomerCard'

const CustomerList = ({ customers, loading, error, setSelectedCustomer }) => {
  if (loading) {
    return <p className="p-4 text-sm text-muted-foreground">Loading customers...</p>
  }

  if (error) {
    return <p className="p-4 text-sm text-red-600">{error}</p>
  }

  if (!customers.length) {
    return <p className="p-4 text-sm text-muted-foreground">No customers found.</p>
  }

  return (
    <div className='flex-1 overflow-auto'>
      <div className='divide-y'>  
        {customers.map((customer) => (
          
          <CustomerCard className="cursor-pointer hover:bg-accent"
           
            setSelectedCustomer = {setSelectedCustomer}
           key={customer.id} customer={customer} />
        ))}

      </div>


    </div>
  )
}

export default CustomerList