package com.cartify.service;

import com.cartify.modal.Customer;

import java.util.List;

public interface CustomerService {

    Customer createCustomer(Customer customer);
    Customer updateCustomer(Long id, Customer customer) throws Exception;
    void deleteCustomer(Long id) throws Exception;
    Customer getCustomer(Long id) throws Exception;
    List<Customer> getAllCustomer() throws Exception;


    List<Customer> searchCustomers(String keyword) throws Exception;

}
