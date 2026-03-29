# Admin Frontend App Documentation

## Overview

The Admin Frontend is the internal management interface for the coffee e-commerce application.

It is built for the administrator to manage products, monitor orders, and review high-level business activity through a dashboard. This application connects directly to the backend and is intended for admin-only use.

The goal of the admin panel is to provide a clean and simple workflow for daily store operations such as product maintenance, stock updates, order decisions, and quick business monitoring.

---

## Purpose

The Admin Frontend allows the administrator to:

- sign in securely
- manage coffee products
- search and filter products
- restock inventory
- monitor incoming and processed orders
- review detailed order information
- confirm or reject orders
- delete orders when needed
- view dashboard summaries and inventory watchlist

---

# Application Scope

The admin panel covers the following functional areas:

- **Admin Authentication**
- **Dashboard Overview**
- **Products Management**
- **Orders Management**

---

# Primary User

## Administrator

This application is designed for a single admin role.

The admin is responsible for:

- accessing the system through login
- maintaining the product catalog
- handling stock updates
- reviewing customer orders
- making order decisions
- monitoring sales and low-stock inventory

---

# Main App Sections

## 1. Authentication

The admin frontend includes a protected login flow for admin-only access.

### Features

- admin login
- admin signout
- protected admin pages
- session or token-based access handling

### Purpose

This ensures that only authorized users can access the admin dashboard and management tools.

### Typical Flow

- Admin enters valid credentials
- Admin is authenticated through the backend
- Protected pages become accessible
- Admin can sign out when finished

---

## 2. Dashboard Overview

The dashboard acts as the main entry point after login.

It provides a quick summary of the store’s current status and highlights the most important business information.

### Dashboard Contents

#### Total Products

Displays the total number of products currently available in the catalog.

#### Low Stock

Displays the total number of products that are below the low-stock threshold.

#### Incoming Orders

Shows how many new or pending orders require admin attention.

#### Confirmed Orders

Displays the number of orders that have already been confirmed.

#### Total Sales

Provides the current sales total based on confirmed or completed orders, depending on implementation.

#### Recent Order Activity

Shows recent order-related activity so the admin can quickly see what happened recently.

Examples:

- newly created orders
- recently confirmed orders
- recently rejected orders

#### Inventory Watchlist

Highlights products that need stock attention.

Examples:

- low stock products
- products nearing depletion
- stock-sensitive items requiring restocking

### Purpose

The dashboard is meant to help the admin quickly understand store activity without needing to manually inspect each section.

---

## 3. Products Management

The Products section allows the admin to manage the product catalog.

### Main Features

- view products
- search products
- filter products
- paginate products
- create product
- edit product
- delete product
- restock product

---

### Product Listing

The admin can view all products in a table-based layout.

Typical product information shown in the table may include:

- image
- product name
- category
- price
- roast level
- origin
- stock
- flags such as featured or bestseller

### Search Products

The admin can search products using relevant fields, such as:

- product name
- slug
- category
- origin
- roast level

### Filter Products

The admin can filter products using useful management filters.

Examples:

- all products
- featured
- bestseller
- low stock
- in stock
- out of stock

### Pagination

The product table supports basic pagination for easier browsing and better handling of larger product lists.

Typical pagination features:

- previous page
- next page
- current page display
- total pages
- total item count if available

### Create Product

The admin can create a new product and provide key product information such as:

- product name
- slug
- category
- short description
- full description
- image
- price
- stock
- roast level
- origin
- featured status
- bestseller status

### Edit Product

The admin can update existing product details whenever changes are needed.

Examples:

- edit product name
- update price
- change description
- update image
- change stock-related presentation
- adjust flags like featured or bestseller

### Delete Product

The admin can remove a product from the catalog.

This is useful for:

- discontinued items
- incorrect entries
- products no longer meant to be displayed

### Restock Product

The admin can add stock to an existing product when inventory is replenished.

This supports simple inventory maintenance without needing to manually recreate the product.

---

## 4. Orders Management

The Orders section allows the admin to review, monitor, and decide on customer orders.

### Main Features

- view orders
- search orders
- filter orders
- paginate orders
- open order details
- confirm order
- reject order
- delete order

---

### Orders Listing

The admin can view customer orders in a paginated table.

Typical table data may include:

- order id
- customer name
- contact number
- payment method
- number of ordered items
- order total
- order status
- created date

### Search Orders

The admin can search orders using relevant order-related fields such as:

- order id
- customer name
- contact number
- payment method
- status

### Filter Orders

The admin can filter orders by order state.

Examples:

- all orders
- pending
- incoming
- confirmed
- rejected

### Pagination

The orders table includes basic pagination for cleaner record browsing and better handling of larger order volumes.

Typical pagination controls:

- previous page
- next page
- current page display
- total pages
- total order count if available

---

## 5. Order Details View

The Order Details page provides a complete view of an individual order.

This page helps the admin review all relevant information before making a decision.

### Order Details Includes

#### Order Information

- order id
- order date
- current status

#### Customer Information

- customer name
- contact number
- address

#### Order Summary

- subtotal
- total amount
- payment method
- payment summary if applicable

#### Ordered Items

- product name
- quantity
- unit price
- item total

#### Payment Proof

If the customer submitted proof of payment, the image can be viewed from the order details page.

#### Admin Actions

The admin can take action on the order, such as:

- confirm order
- reject order
- delete order where allowed

---

## 6. Confirm Order

The admin can confirm an order after reviewing the details.

### Purpose

This action is used when:

- payment is valid
- customer details are complete
- order information is correct
- the order is ready to move forward

### Typical Result

- order status becomes confirmed
- order becomes part of tracked business activity
- stock deduction may apply depending on backend logic

---

## 7. Reject Order

The admin can reject an order when necessary.

### Purpose

This action is used when:

- payment is invalid or missing
- order details are incomplete
- the order cannot be fulfilled
- the request should not proceed

### Typical Result

- order status becomes rejected
- inventory may be restored depending on stock logic

---

## 8. Delete Order

The admin can delete an order record if it is no longer needed or if business rules allow removal.

### Typical Use Cases

- removing resolved rejected orders
- clearing invalid records
- cleaning up no-longer-needed order entries

---

# Functional Sitemap

## Authentication

- Login
- Signout

## Dashboard

- Overview
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

# Suggested Admin Navigation Structure

## Sidebar or Main Navigation

- Dashboard
- Products
- Orders
- Signout

---

# Example Page Structure

## Login Page

Purpose:

- authenticate the admin before granting access to the panel

## Dashboard Page

Purpose:

- show store summary and quick operational metrics

## Products Page

Purpose:

- manage and monitor the full product catalog

Features:

- search
- filter
- pagination
- edit
- restock
- delete
- create new product

## Orders Page

Purpose:

- review all customer orders and monitor statuses

Features:

- search
- filter
- pagination
- open detail page

## Order Details Page

Purpose:

- review full order information before confirming or rejecting

Features:

- customer details
- ordered items
- payment method
- proof of payment image
- action buttons

---

# User Experience Goals

The admin frontend is designed with the following goals:

- simple and clean navigation
- fast access to important store data
- clear product and order management workflow
- easy monitoring of low stock items
- practical order review and decision-making
- consistent management experience across pages

---

# Design Intent

The admin frontend is intended to feel:

- clean
- focused
- practical
- easy to manage
- responsive across common screen sizes

The UI should support day-to-day admin work without unnecessary complexity.

---

# Backend Integration

The admin frontend depends on the backend for:

- authentication
- product listing and management
- order listing and order actions
- dashboard metrics and summaries

The frontend acts as the management interface, while the backend handles data persistence, business logic, filtering, pagination, and order state changes.

---

# Summary

The Admin Frontend is the operational control panel of the coffee e-commerce system.

It gives the administrator the ability to:

- securely access the system
- manage products and inventory
- monitor incoming and processed orders
- review detailed order information
- approve or reject customer orders
- track high-level business insights from the dashboard

Its role is to make daily store management simple, clear, and efficient.
