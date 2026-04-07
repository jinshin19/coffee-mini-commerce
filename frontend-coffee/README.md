# Frontend Coffee — Jinshin Brew Reserve Coffee House

## Overview

The **Frontend Coffee** is the customer-facing storefront for **Jinshin Brew Reserve Coffee House**. It provides a clean, realistic coffee shop browsing and purchasing experience — allowing customers to discover products, add items to their cart, and complete orders through a simple checkout flow.

This application fetches product and order data from the backend API and is the primary interface for all customer interactions.

---

## Technology Stack

| Layer        | Technology               |
| ------------ | ------------------------ |
| Framework    | Next.js 15 (App Router)  |
| Language     | TypeScript 5.8           |
| UI Library   | React 19                 |
| Styling      | Tailwind CSS 3.4         |
| State        | React Context API (Cart) |
| API Client   | Fetch (custom service layer) |
| Containerized | Docker                  |

---

## Application Scope

The customer storefront covers the following functional areas:

1. **Homepage** — Hero, featured products, full product listing, brand story
2. **Product Detail** — Full product information with quantity selector and purchase actions
3. **Cart** — Cart management with item review and order summary
4. **Checkout** — Customer form, payment method selection, payment proof upload
5. **Order Success** — Post-purchase confirmation page

---

## Application Structure

```
frontend-coffee/
├── app/                         — Next.js App Router pages
│   ├── layout.tsx               — Root layout with Cart context provider
│   ├── page.tsx                 — Homepage (hero, featured, listing, story)
│   ├── cart/                    — Cart page
│   ├── checkout/                — Checkout page
│   ├── order-success/           — Order success confirmation page
│   ├── coffee/
│   │   └── [slug]/              — Product detail page (dynamic route)
│   ├── api/                     — Next.js API routes (server-side proxy)
│   ├── globals.css              — Global styles
│   └── not-found.tsx            — 404 page
├── components/                  — All UI components (13 components)
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductActions.tsx
│   ├── QuantitySelector.tsx
│   ├── CartItemRow.tsx
│   ├── CheckoutContent.tsx
│   ├── OrderSuccessContent.tsx
│   ├── BrandStory.tsx
│   ├── WhyChooseUs.tsx
│   ├── Testimonials.tsx
│   └── SectionHeading.tsx
├── context/
│   └── CartContext.tsx          — Cart state management (localStorage-backed)
├── services/
│   ├── apis/
│   │   ├── src/
│   │   │   ├── products/        — Products API calls
│   │   │   └── orders/          — Order creation API calls
│   │   └── api.service.ts       — Base HTTP service
│   └── handlers/                — Response processing utilities
├── data/                        — Static data (e.g., delivery fee constants)
├── helpers/                     — Utility/helper functions
└── lib/                         — Shared library utilities
```

---

## Page Sitemap

```
/                           — Homepage
/coffee/[slug]              — Product Detail Page
/cart                       — Cart Page
/checkout                   — Checkout Page
/order-success              — Order Success Page
```

---

## Pages

### Homepage — `/`

The main entry point for customers. A single-page layout with smooth anchor scrolling between sections.

**Navigation Links:**

| Link     | Behavior                                              |
| -------- | ----------------------------------------------------- |
| Home     | Scrolls to top of homepage                            |
| Featured | Smooth scrolls to the featured products section       |
| Story    | Smooth scrolls to the brand story section             |
| Checkout | Navigates to `/checkout` (separate page)              |

**Homepage Sections:**

#### Hero Section
- Brand introduction headline
- Call-to-action button (e.g., "Shop Now" → product listing)
- Coffee-focused hero visual

#### Featured Products Section
- Curated set of products flagged as `featured` in the backend
- Each product card links to the product detail page

#### Coffee Listing Section
- Full list of available products in a grid layout
- Each product card shows: image, name, price, and click-to-detail interaction

#### Brand Story Section
- Jinshin Brew Reserve brand background and coffee philosophy
- "Why Choose Us" content
- Testimonials

**Key Components:** `Hero.tsx`, `ProductCard.tsx`, `BrandStory.tsx`, `WhyChooseUs.tsx`, `Testimonials.tsx`

---

### Product Detail Page — `/coffee/[slug]`

Displays full information about a single coffee product. Accessed by clicking any product card.

**Product Information Displayed:**
- Product image
- Product name
- Price
- Short description and full description
- Roast level (dark, light, medium, espresso, medium-dark, medium-light)
- Origin (country/region)
- Stock availability (optional display)

**Quantity Selector:**
- Increase / decrease quantity
- Minimum quantity: 1
- Cannot decrement below 1

**Action Buttons:**

| Button     | Behavior                                                       |
| ---------- | -------------------------------------------------------------- |
| Add to Cart | Adds selected product + quantity to the cart (via CartContext) |
| Buy Now    | Immediately redirects to `/checkout` with only this product (bypasses cart) |

**Buy Now Behavior:**
- Stores the selected product in a temporary `instant` session storage key
- On the checkout page, uses the instant item instead of cart contents
- Existing cart items are preserved and unaffected

**Key Components:** `ProductActions.tsx`, `QuantitySelector.tsx`

---

### Cart Page — `/cart`

Displays all products the customer has added to their cart.

**Cart Contents:**

Each cart item shows:
- Product image
- Product name
- Unit price
- Current quantity
- Item subtotal (price × quantity)

**Order Summary:**
- Items subtotal
- Delivery fee
- Total amount

**Actions:**
- Adjust item quantities (inline)
- Remove individual items
- **Proceed to Checkout** button → navigates to `/checkout` using cart contents

**Key Component:** `CartItemRow.tsx`

---

### Checkout Page — `/checkout`

The order placement page. Reached either from the cart ("Proceed to Checkout") or directly from a product page ("Buy Now").

**Order Source Logic:**
- If navigated via **Buy Now** → uses the instant item from session storage
- If navigated via **Cart** → uses all current cart items

**Checkout Sections:**

#### Order Summary
- Product name, quantity, and item subtotal for each item
- Total amount

#### Customer Information Form

| Field           | Required | Description                   |
| --------------- | -------- | ----------------------------- |
| Full Name       | Yes      | Customer's name               |
| Contact Number  | Yes      | Customer's phone number       |
| Delivery Address| Yes      | Full delivery address         |
| Payment Method  | Yes      | Select GCash or COD           |

#### Payment Method: GCash
- QR code is displayed for scanning
- Customer scans with their GCash app
- Customer uploads a proof-of-payment image (required)
- Image uploaded via `POST /api/v1/uploads/proof`

#### Payment Method: COD (Cash on Delivery)
- No QR code shown
- No proof-of-payment required
- Customer pays upon delivery

**Required Fields by Payment Method:**

| Field             | GCash    | COD      |
| ----------------- | -------- | -------- |
| Name              | Required | Required |
| Contact Number    | Required | Required |
| Address           | Required | Required |
| Payment Method    | Required | Required |
| Proof of Payment  | Required | Not Required |

#### Place Order Button
- Validates all required fields
- Submits order to backend (`POST /api/v1/orders`)
- On success: clears cart, redirects to `/order-success`

**Key Component:** `CheckoutContent.tsx`

---

### Order Success Page — `/order-success`

Displayed after a successful order placement.

**Content:**
- Success confirmation icon/message
- Order confirmation text
- Optional: order reference or details
- Call-to-action to continue browsing (→ homepage)

**Post-success state:**
- Cart is cleared
- Admin can now see the new order in the admin dashboard
- Admin will review and decide to confirm or reject the order

**Key Component:** `OrderSuccessContent.tsx`

---

## Component Inventory

| Component                 | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `Navbar.tsx`              | Top navigation with Home, Featured, Story, Checkout links       |
| `Hero.tsx`                | Full-width hero section with brand headline and CTA             |
| `ProductCard.tsx`         | Product card showing image, name, price, and detail link        |
| `BrandStory.tsx`          | Brand story and coffee philosophy section                       |
| `WhyChooseUs.tsx`         | "Why Choose Us" value proposition section                       |
| `Testimonials.tsx`        | Customer testimonial section                                    |
| `SectionHeading.tsx`      | Reusable section title/heading component                        |
| `ProductActions.tsx`      | Add to Cart and Buy Now buttons on product detail page          |
| `QuantitySelector.tsx`    | Increment/decrement quantity control (min: 1)                   |
| `CartItemRow.tsx`         | Individual cart item row with image, name, qty, subtotal        |
| `CheckoutContent.tsx`     | Full checkout form with order summary info and payment flow     |
| `OrderSuccessContent.tsx` | Order success confirmation screen                               |
| `Footer.tsx`              | Site footer with brand info and links                           |

---

## State Management

### CartContext (`context/CartContext.tsx`)

Manages the shopping cart state across the entire application.

- Cart data persisted in `localStorage` under key: `coffee-next-store-cart`
- Instant (Buy Now) item stored under key: `coffee-next-store-instant`
- Provides: `cartItems`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`
- Automatically syncs with localStorage on every cart update

---

## User Flows

### Standard Purchase Flow (via Cart)

```
Homepage
  └── Browse Products
        └── Product Detail (/coffee/[slug])
              └── Select Quantity
                    └── Add to Cart
                          └── Cart Page (/cart)
                                └── Proceed to Checkout
                                      └── Checkout Page (/checkout)
                                            ├── Fill Customer Form
                                            ├── Select Payment Method
                                            │   ├── GCash → Upload Proof of Payment
                                            │   └── COD   → No proof needed
                                            └── Place Order
                                                  └── Order Success (/order-success)
```

### Buy Now Flow (Bypass Cart)

```
Homepage
  └── Browse Products
        └── Product Detail (/coffee/[slug])
              └── Select Quantity
                    └── Buy Now
                          └── Checkout Page (/checkout)
                                ├── [Only selected product — cart ignored]
                                ├── Fill Customer Form
                                ├── Select Payment Method
                                └── Place Order
                                      └── Order Success (/order-success)
```

### Cart vs. Buy Now Behavior

| Scenario | Cart Items | Buy Now Item | Checkout Uses          |
| -------- | ---------- | ------------ | ---------------------- |
| Add to Cart → Checkout | Yes | None | All cart items |
| Buy Now (on product page) | Preserved | Product C (1 item) | Only the Buy Now item |

---

## API Integration

The customer storefront communicates with the backend using a service layer under `services/apis/`.

| Service          | Backend Endpoint           | Operations                             |
| ---------------- | -------------------------- | -------------------------------------- |
| Products Service | `/api/v1/products`         | list (homepage), getBySlug (detail page) |
| Orders Service   | `/api/v1/orders`           | create (place order)                   |
| Uploads (direct) | `/api/v1/uploads/proof`    | Upload GCash proof of payment image    |

**Server-Side Proxying:**
- The `app/api/` directory contains Next.js API routes used as a server-side proxy
- Server-side requests use the internal Docker network URL (`http://backend:3000/api/v1`) to avoid cross-container DNS issues

---

## Environment Variables

| Variable                           | Example Value                           | Description                                    |
| ---------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_NODE_ENV`             | `development`                           | Environment mode                               |
| `NEXT_PUBLIC_API_URL`              | `http://localhost:30011/api/v1`         | Backend API URL (client-side requests)         |
| `NEXT_PUBLIC_PATH_1`               | `/api/v1`                               | Relative API path (via Nginx in production)    |
| `NEXT_PUBLIC_PATH_2`               | `http://backend:3000/api/v1`            | Internal Docker network backend URL            |
| `NEXT_PUBLIC_CART_STORAGE_KEY`     | `coffee-next-store-cart`                | localStorage key for cart data                 |
| `NEXT_PUBLIC_INSTANT_STORAGE_KEY`  | `coffee-next-store-instant`             | localStorage key for Buy Now item              |

---

## Running Locally

```bash
# Development server (clears .next cache first)
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

The development server runs on `http://0.0.0.0:3000`.

---

## Docker

```yaml
# In docker-compose.yaml
main:
  build: ./frontend-coffee/
  env_file: ./frontend-coffee/.env.production
  healthcheck:
    test: curl -fsS http://localhost:3000
  restart: unless-stopped
  networks:
    - coffee-network
```

Nginx routes `/` → this container.

---

## Functional Sitemap

```
Customer Storefront
│
├── / (Homepage)
│   ├── Navbar (Home | Featured | Story | Checkout)
│   ├── Hero Section
│   │   └── Call-to-Action (Browse Products)
│   ├── Featured Products Section
│   │   └── ProductCard (×N) → /coffee/[slug]
│   ├── Coffee Listing Section
│   │   └── ProductCard (×N) → /coffee/[slug]
│   ├── Brand Story Section
│   ├── Why Choose Us
│   ├── Testimonials
│   └── Footer
│
├── /coffee/[slug] (Product Detail)
│   ├── Product Image
│   ├── Product Info (name, price, description, roast level, origin)
│   ├── Quantity Selector (min: 1)
│   ├── Add to Cart → Cart Updated
│   └── Buy Now → /checkout (instant mode)
│
├── /cart (Cart Page)
│   ├── Cart Item Rows (image, name, qty, subtotal)
│   ├── Order Summary (subtotal, delivery fee, total)
│   └── Proceed to Checkout → /checkout (cart mode)
│
├── /checkout (Checkout Page)
│   ├── Order Summary (items, total)
│   ├── Customer Form (name, contact, address, payment method)
│   ├── GCash Flow
│   │   ├── QR Code Display
│   │   └── Proof of Payment Upload (required)
│   ├── COD Flow
│   │   └── (No proof required)
│   └── Place Order → /order-success
│
└── /order-success (Order Success)
    ├── Success Message
    ├── Order Confirmation
    └── Continue Browsing → /
```

---

## Design Goals

The customer storefront is designed to be:

- **Clean and minimal** — no distractions from the coffee products
- **Realistic** — feels like a genuine coffee shop website
- **Easy to navigate** — single-page homepage with anchor sections
- **Mobile-friendly** — responsive across common screen sizes
- **Brand-focused** — Jinshin Brew Reserve identity throughout

---

## Summary

The **Frontend Coffee** is the customer-facing heart of the Jinshin Brew Reserve Coffee House platform. It enables customers to:

- Discover coffee products through a beautiful, curated homepage
- View full product details including roast level, origin, and descriptions
- Add items to cart and manage quantities before checkout
- Purchase immediately with Buy Now, bypassing the cart entirely
- Complete orders via GCash (with proof upload) or Cash on Delivery
- Receive a clear order success confirmation

The application is designed to provide a seamless, coffee-brand-authentic purchasing experience from discovery to order completion.
