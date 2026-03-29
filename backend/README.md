# Backend App Documentation

## Overview

This backend powers both the **Admin Dashboard** and the **Main Frontend** of the coffee e-commerce application.

It is responsible for handling admin authentication, product management, order management, and dashboard reporting. The system is designed so that the admin side can manage the business, while the main frontend can consume product and order-related data as needed.

---

## Scope

The backend supports the following core areas:

- **Admin Authentication**
- **Products Management**
- **Orders Management**
- **Dashboard Overview**

---

# Backend Architecture Summary

## Consumers

### 1. Admin Frontend

Used by the administrator to:

- sign in and sign out
- manage products
- manage orders
- monitor business overview and key metrics

### 2. Main Frontend

Used by customers to:

- browse products
- search and view product details
- place orders
- view order-related information where applicable

---

# Main Backend Modules

## 1. Admin Authentication

This module is intended for **admin-only access**.

### Responsibilities

- Admin login
- Admin signout
- Session or token handling for protected admin routes

### Features

- Validates admin credentials
- Grants authenticated access to protected admin endpoints
- Removes or invalidates session/token on signout

### Typical Actions

- `Login`
- `Signout`

---

## 2. Products Module

This module manages all product-related operations for both admin and customer-facing use cases.

### Responsibilities

- create product
- update product
- delete product
- restock product
- search product
- filter product
- paginate product list
- expose products for frontend display

### Admin Product Capabilities

#### Product Listing

Admin can view the product list with pagination.

Supported capabilities:

- search by keyword
- filter by status or stock condition
- sort if applicable
- navigate using basic pagination

#### Product Search

Admin can search products using relevant fields such as:

- product name
- slug
- category
- roast level
- origin

#### Product Filters

Admin can filter products by business-related conditions such as:

- all products
- low stock
- featured
- bestseller
- in stock
- out of stock

#### Create Product

Admin can add a new coffee product.

Typical product information includes:

- product id
- slug
- name
- category
- short description
- full description
- price
- image
- roast level
- origin
- stock
- featured flag
- bestseller flag

#### Edit Product

Admin can modify existing product details such as:

- name
- description
- price
- image
- roast level
- origin
- category
- featured or bestseller flags

#### Delete Product

Admin can remove a product from the catalog.

#### Restock Product

Admin can increase product inventory when new stocks are available.

### Frontend Product Support

The main frontend can consume product data for:

- product listing page
- featured products section
- product detail page
- search results
- filtered product views

---

## 3. Orders Module

This module manages customer orders and admin decision workflows.

### Responsibilities

- search orders
- filter orders
- paginate order list
- view order details
- confirm order
- reject order
- delete order

### Order Listing

Admin can view all orders in a paginated table.

### Order Search

Admin can search orders using relevant fields such as:

- order id
- customer name
- contact number
- payment method
- status

### Order Filters

Admin can filter orders by status, such as:

- all orders
- pending
- incoming
- confirmed
- rejected

Depending on implementation, incoming and pending may refer to the same business state or be separated.

### Order Details View

Admin can open a detailed order page to review the full order information.

#### Order Details Includes

##### Order Information

- order id
- created date
- order status

##### Customer Information

- customer name
- contact number
- address

##### Order Summary

- subtotal
- total amount
- payment method
- payment status if applicable

##### Ordered Items

- product name
- quantity
- unit price
- item total

##### Payment Information

- payment method
- proof of payment image, if provided by the customer

##### Admin Decision

- confirm order
- reject order
- delete order if allowed by business rules

### Confirm Order

Admin can confirm an order after validating payment and order details.

Typical effect:

- order moves to confirmed state
- order becomes part of sales reporting
- stock deduction logic may apply depending on implementation

### Reject Order

Admin can reject an order.

Typical effect:

- order moves to rejected state
- any reserved or deducted stock may be restored depending on business rule

### Delete Order

Admin can remove an order record, usually after it has been resolved, closed, or explicitly rejected.

---

## 4. Dashboard Overview Module

This module provides a summary of key business metrics for the admin dashboard.

### Responsibilities

- display high-level metrics
- surface order activity
- monitor stock health
- give quick operational visibility

### Dashboard Data Includes

#### Total Products

Shows the total number of products currently in the catalog.

#### Low Stock

Shows how many products are currently considered low stock based on the defined stock threshold.

#### Incoming Orders

Shows how many new or pending orders need admin attention.

#### Confirmed Orders

Shows the total number of confirmed orders.

#### Total Sales

Shows the total sales value based on confirmed or completed orders, depending on the business rule.

#### Recent Order Activity

Displays the latest order activity to help the admin track recent customer actions and order decisions.

Examples:

- newly placed orders
- recently confirmed orders
- recently rejected orders

#### Inventory Watchlist

Shows products that require inventory attention.

Examples:

- low stock items
- products near depletion
- count of products below stock threshold

---

# Functional Sitemap

## Admin Authentication

- Admin Login
- Admin Signout

## Dashboard

- Overview Summary
  - Total Products
  - Low Stock
  - Incoming Orders
  - Confirmed Orders
  - Total Sales
  - Recent Order Activity
  - Inventory Watchlist

## Products

- Product List
- Search Products
- Filter Products
- Paginated Products
- Create Product
- Edit Product
- Delete Product
- Restock Product
- Product Details if applicable

## Orders

- Order List
- Search Orders
- Filter Orders
- Paginated Orders
- Order Details
  - Order Information
  - Customer Information
  - Ordered Items
  - Payment Details
  - Proof of Payment
  - Admin Decision
- Confirm Order
- Reject Order
- Delete Order

---

# Suggested Route Structure

This section is only a conceptual route map for documentation purposes.

## Auth

- `POST /admin/login`
- `POST /admin/signout`

## Products

- `GET /products`
- `GET /products/:id` or `GET /products/:slug`
- `POST /products`
- `PATCH /products/:id`
- `DELETE /products/:id`
- `PATCH /products/:id/restock`

## Orders

- `GET /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/confirm`
- `PATCH /orders/:id/reject`
- `DELETE /orders/:id`

## Dashboard

- `GET /dashboard/overview`

> Adjust the exact route names based on your real implementation.

---

# Pagination Support

Both **products** and **orders** support basic pagination.

### Pagination Purpose

Pagination helps:

- reduce load time
- organize admin tables
- improve scalability for larger datasets

### Common Pagination Metadata

Typical pagination response may include:

- page
- limit
- total
- totalPages

---

# Search and Filter Support

## Products

Supports searching and filtering by relevant product fields and stock conditions.

Examples:

- search by name
- search by slug
- filter low stock
- filter featured
- filter bestseller

## Orders

Supports searching and filtering by customer and order-related fields.

Examples:

- search by order id
- search by customer name
- filter all
- filter pending
- filter incoming
- filter confirmed
- filter rejected

---

# Business Goal

The backend is designed to support a simple but realistic coffee commerce workflow:

- admins can manage products and inventory
- admins can review and decide on customer orders
- admins can monitor the overall store performance through dashboard metrics
- customers on the main frontend can browse products and place orders using data provided by this backend

---

# Summary

This backend serves as the central system for both the admin dashboard and the customer-facing coffee storefront.

It provides:

- secure admin access
- full product management
- complete order monitoring and decision handling
- dashboard insights for daily operations

The overall goal is to keep the system simple, maintainable, and ready for real-world coffee commerce operations.
