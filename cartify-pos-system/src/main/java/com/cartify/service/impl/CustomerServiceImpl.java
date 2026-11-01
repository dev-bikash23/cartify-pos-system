package com.cartify.service.impl;

import com.cartify.domain.OrderStatus;
import com.cartify.modal.Customer;
import com.cartify.modal.Order;
import com.cartify.repository.CustomerRepository;
import com.cartify.repository.OrderRepository;
import com.cartify.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Setter
@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    @Override
    public Customer createCustomer(Customer customer) {

        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) throws Exception {
        Customer customerToUpdate = customerRepository.findById(id).orElseThrow(
                () -> new Exception("customer not found")
        );
        customer.setFullName(customer.getFullName());
        customer.setEmail(customer.getEmail());
        customer.setPhone(customer.getPhone());

        return customerRepository.save(customerToUpdate);
    }

    @Override
    public void deleteCustomer(Long id) throws Exception {
        Customer customerToUpdate = customerRepository.findById(id).orElseThrow(
                () -> new Exception("Customer not found")
        );
        customerRepository.delete(customerToUpdate);
    }

    @Override
    public Customer getCustomer(Long id) throws Exception {
        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new Exception("Customer not found")
        );
        return withSummary(customer);
    }

    @Override
    public List<Customer> getAllCustomer() throws Exception {
        return customerRepository.findAll().stream()
            .map(this::withSummary)
            .toList();
    }

    @Override
    public List<Customer> searchCustomers(String keyword) throws Exception {
        return customerRepository
            .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword)
            .stream()
            .map(this::withSummary)
            .toList();
    }

        private Customer withSummary(Customer customer) {
        List<Order> completedOrders = orderRepository.findByCustomerId(customer.getId()).stream()
            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
            .toList();
        double totalSpent = completedOrders.stream()
            .mapToDouble(order -> order.getTotalAmount() == null ? 0 : order.getTotalAmount())
            .sum();

        customer.setTotalOrders(completedOrders.size());
        customer.setTotalSpent(totalSpent);
        customer.setLoyalPoints((long) Math.floor(totalSpent / 100));
        return customer;
        }
}













