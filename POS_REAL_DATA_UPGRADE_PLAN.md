# POS Real Data Upgrade Plan

This plan is designed for the current Java + React POS project and follows the real-world production approach:

- real database data
- real payment tracking
- real sales and refund reporting
- cashier workflow based on actual transactions

It avoids dummy data and focuses on a clean upgrade path that can be implemented step by step.

---

## 1. Recommended approach

Use this order:

1. Real data foundation
2. Payment tracking and order status
3. Sales, refund, and shift reporting
4. Advanced integrations and analytics

This is the best choice for a real POS application because it keeps the product trustworthy, measurable, and business-ready.

---

## 2. Objective

Build the cashier system around true transactional data so that:

- orders come from the real backend database
- payments are tracked and connected to orders
- refunds reduce the correct totals
- shift summary reflects real cashier activity
- sales reports are based on actual transaction data

---

## 3. Core architecture

### Backend (Spring Boot)

Use a layered structure:

- Controller layer
- Service layer
- Repository layer
- Entity layer
- DTO layer

### Frontend (React + Vite)

Use Redux slices and API-thunks to load data from the backend.

- POS Terminal
- Orders History
- Customers
- Returns / Refund
- Shift Summary
- Sales Reports

---

## 4. Phase 1: Real data foundation

### Goal

Replace static or mock behavior with live backend data.

### Must-have items

- Orders must be fetched from API
- Order items must be loaded with products and totals
- Customers must come from customer table
- Refunds must come from refund table
- Shift summary must be calculated from real orders/refunds

### API responsibilities

- GET /api/orders/cashier/{cashierId}
- GET /api/customers
- GET /api/customers/{id}/orders
- GET /api/refunds/cashier/{cashierId}
- GET /api/shift-reports/cashier/{cashierId}

### Frontend responsibilities

- store response in Redux slices
- display actual order totals, item counts, and cashier sales
- remove static dummy values from sales and reports screens

### Success check

Every page must reflect actual database records, not hardcoded data.

---

## 5. Phase 2: Payment flow

### Goal

Track payment accurately for each sold order.

### Required payment types

- Cash
- Card
- UPI/QR
- Wallet

### Required payment states

- pending
- paid
- partial
- failed
- refunded

### Data model

Add or extend these entities:

- Payment
- PaymentMethod
- PaymentStatus
- Order
- OrderItem
- Refund

### Order lifecycle

1. order created
2. order items saved
3. payment created
4. payment status updated to paid / partial / failed
5. order marked completed
6. refund can be created later if needed

### Payment rules

- total amount = sum of all items
- total paid must match expected payment
- refund amount must reduce net sales
- cash drawer should reflect final cash collection

### Success check

The total paid, refund amount, and final net sales should always stay consistent.

---

## 6. Phase 3: Sales, returns, and shift summary

### Sales summary

Compute values from real transaction data:

- total sales
- refund amount
- net sales
- sales by day
- sales by week
- sales by month
- sales by cashier
- sales by payment method

### Refund logic

- item-level refund is allowed
- total refund is tracked separately
- refund should update net sales
- refund record should connect to order and cashier

### Shift summary logic

A shift summary should include:

- start time
- end time
- total orders
- total sales
- total refunds
- cash collected
- card/UPI collected
- final cash-in-hand

### Success check

A cashier should be able to close a shift and see exact, real numbers for that session.

---

## 7. Phase 4: Reporting and dashboard

### Serious reporting features

- Today sales
- This week sales
- This month sales
- Custom date range
- Sales by product category
- Sales by cashier
- Payment method breakdown
- Return rate
- Net revenue report

### Recommended reporting query rules

- use backend aggregation for totals
- do not calculate totals only on the frontend
- use SQL / JPA queries for analytics

### Success check

Dashboard numbers must match actual order/payment/refund records.

---

## 8. Best practical implementation sequence for this project

### Step 1

Finish the real data flow for:

- customer page
- order history page
- refund page
- shift summary page

### Step 2

Add proper payment status to orders and payment records.

### Step 3

Add accurate sales aggregation at the backend.

### Step 4

Add dashboards and custom report range filters.

### Step 5

Upgrade to advanced payment gateways only when needed.

---

## 9. Real-world recommendation for this app

The best production-ready version for your current system is:

- real database data
- real order and payment record tracking
- real refund and sales summary logic
- real cashier shift reporting

This is far better than dummy data and more useful than a full enterprise system at the beginning.

---

## 10. Final recommendation

Use this structure in the project:

### Backend modules

- OrderService
- CustomerService
- RefundService
- PaymentService
- ShiftReportService
- SalesReportService

### Frontend modules

- POS terminal
- Order history
- Customers
- Return/refund
- Shift reports
- Dashboard analytics

### Data rule

Everything must come from the database, not static front-end arrays or sample values.

---

## 11. Final conclusion

The best real application approach is:

Real Data + Payment Tracking + Sales Reporting

This is the correct path for a POS system.

Start with real data, then add more advanced features only when the business needs them.
