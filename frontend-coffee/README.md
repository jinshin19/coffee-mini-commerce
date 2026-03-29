# Main Frontend App Documentation

## Overview

The Main Frontend is the customer-facing storefront for **Jinshin Brew Reserve Coffee House**.  
It allows users to browse coffee products, view detailed information, add items to cart, and place orders through a simple checkout flow.

The application is designed to feel like a real coffee shop website, with a clean browsing experience and a straightforward purchasing process.

---

# Purpose

The main frontend enables customers to:

- browse available coffee products
- view product details
- add products to cart
- adjust quantity
- review cart items
- proceed to checkout
- choose payment method
- upload proof of payment (GCash)
- place an order successfully

---

# Navigation Structure

The main navigation contains four links:

- Home
- Featured
- Story
- Checkout

### Navigation Behavior

- **Home** → Scrolls to homepage top section
- **Featured** → Scrolls to featured products section
- **Story** → Scrolls to brand story section
- **Checkout** → Navigates to the checkout page

The **Home**, **Featured**, and **Story** sections exist within the same homepage and use smooth scrolling.  
The **Checkout** link redirects to a separate checkout page.

---

# Application Sitemap

## Pages

- Homepage (`/`)
- Product Detail (`/product/[slug]`)
- Cart Page (`/cart`)
- Checkout Page (`/checkout`)
- Order Success Page (`/success`)

---

# Homepage

The homepage acts as the main entry point for customers.

### Sections

#### Hero Section

- Brand introduction
- Call to action
- Coffee-focused visuals

#### Featured Products

- Displays selected or featured coffee items
- Each product card links to product detail page

#### Coffee Listing

- Shows available products in a grid layout
- Includes:
  - product image
  - product name
  - price

#### Story Section

- Brand background
- Coffee philosophy
- "Why choose us" content

---

# Product Browsing

Customers can browse the coffee lineup from the homepage.

Each product card includes:

- product image
- product name
- price
- click interaction to open product detail

---

# Product Detail Page

Path:

This page shows detailed information about a selected coffee product.

### Product Details Includes

- product image
- product name
- price
- description
- roast level
- origin
- stock (optional display)

### Quantity Selector

Users can:

- increase quantity
- decrease quantity
- quantity cannot go below 1

### Actions

Two primary actions are available:

#### Add to Cart

Adds selected product with chosen quantity to cart.

#### Buy Now

Redirects user directly to checkout page for this single product.

Important behavior:

- Existing cart items are ignored
- Only the selected product is used for checkout

---

# Cart Page

Path:

When the cart icon is clicked, the user is redirected to the cart page.

This page displays all products added to the cart.

### Cart Page Contents

#### Cart Items

Each item shows:

- product image
- product name
- quantity
- price
- item subtotal

#### Order Summary

Displays:

- subtotal
- delivery fee
- total amount

#### Proceed to Checkout Button

Users can proceed to checkout using cart items.

---

# Checkout Flow (From Cart)

When **Proceed to Checkout** is clicked:

User is redirected to:

Checkout page includes:

### Order Summary

Displays cart products with:

- product name
- quantity
- item subtotal
- total summary

### Customer Information Form

User must fill:

- Name
- Contact Number
- Address
- Payment Method

### Payment Method Options

Two available methods:

- GCash
- Cash on Delivery (COD)

---

# GCash Payment Flow

If user selects **GCash**:

- QR code is displayed
- User scans QR using GCash app
- User uploads proof of payment image
- Proof of payment is required

### Required Fields for GCash

- name
- contact number
- address
- payment method
- proof of payment image

---

# Cash on Delivery (COD) Flow

If user selects **COD**:

- No QR code shown
- No proof of payment required

### Required Fields for COD

- name
- contact number
- address
- payment method

---

# Place Order

When user clicks **Place Order**:

- order is submitted to backend
- cart is cleared
- user redirected to success page

---

# Order Success Page

Path:

This page confirms the order was placed successfully.

### Page Content

- success message
- order confirmation text
- optional order reference
- call to continue browsing

After this:

- admin can now see the order
- admin decides to confirm or reject order

---

# Buy Now Flow (From Product Detail)

If user clicks **Buy Now** on product detail page:

Behavior:

- user is redirected directly to checkout page
- only selected product is included
- existing cart items are ignored
- checkout form must still be filled

This supports quick purchase without affecting cart contents.

---

# Cart vs Buy Now Behavior

### Example

Cart contains:

- Product A (2 items)
- Product B (1 item)

User opens Product C detail page and clicks **Buy Now**

Result:

- Checkout page only shows Product C
- Cart items are ignored
- Order created for Product C only

---

# Functional Sitemap

## Homepage

- Hero
- Featured Section
- Coffee Listing
- Story Section

## Product

- Product Detail
- Quantity Selector
- Add to Cart
- Buy Now

## Cart

- Cart Items
- Quantity Summary
- Subtotal
- Delivery Fee
- Total
- Proceed to Checkout

## Checkout

- Order Summary
- Customer Form
- Payment Method
  - GCash
  - COD
- Proof of Payment (GCash only)
- Place Order

## Order Success

- Success Message
- Confirmation View

---

# User Flow

### Standard Purchase Flow

Browse Products  
→ Product Detail  
→ Add to Cart  
→ Cart Page  
→ Proceed to Checkout  
→ Fill Form  
→ Place Order  
→ Success Page

---

### Buy Now Flow

Browse Products  
→ Product Detail  
→ Buy Now  
→ Checkout Page  
→ Fill Form  
→ Place Order  
→ Success Page

---

# Design Goals

The main frontend is designed to be:

- simple
- clean
- realistic
- easy to navigate
- mobile-friendly
- coffee brand focused

---

# Backend Integration

The main frontend communicates with backend for:

- product listing
- product details
- order creation
- payment method submission
- proof of payment upload

---

# Summary

The Main Frontend serves as the customer-facing storefront of Jinshin Brew Reserve Coffee House.

It allows customers to:

- browse coffee selections
- view detailed product information
- add products to cart
- purchase immediately using buy now
- review cart and checkout
- choose payment method
- upload proof of payment if needed
- place orders successfully

The application provides a clean and realistic coffee shop purchasing experience.
