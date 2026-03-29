# Jinshin Brew Reserve Coffee House — Full Stack Deployment

This repository contains the full stack application for **Jinshin Brew Reserve Coffee House**, composed of three separate applications orchestrated together and prepared for Docker-based deployment on an Ubuntu Server (Oracle VM) with Nginx reverse proxy.

---

# Repository Structure

repo/
├── backend
├── frontend-admin
├── frontend-coffee
├── docker-compose.yaml
└── README.md

---

# Applications

## 1. Backend

The backend powers both frontend applications.

### Responsibilities

- Admin authentication
- Product management
- Order management
- Dashboard metrics
- Search and filtering
- Pagination
- Order decision workflow

### Used by

- frontend-admin
- frontend-coffee

---

## 2. Frontend Admin

Internal admin dashboard used to manage the coffee store.

### Features

- Admin login / signout
- Dashboard overview
- Product management
- Order management
- Inventory monitoring
- Order confirmation / rejection

---

## 3. Frontend Coffee

Customer-facing storefront.

### Features

- Browse coffee products
- Product detail page
- Add to cart
- Buy now flow
- Cart page
- Checkout page
- GCash or COD payment
- Upload proof of payment
- Order success page

---

# Deployment Architecture

The application is designed to run on:

- Oracle VM
- Ubuntu Server
- Docker
- Docker Compose
- Nginx reverse proxy

---

# Deployment Flow

Internet
│
▼
Nginx (reverse proxy)
├── / → frontend-coffee
├── /admin → frontend-admin
└── /api → backend

---

# Services

| Service         | Description     | Default Port |
| --------------- | --------------- | ------------ |
| backend         | API server      | 3000         |
| frontend-coffee | Customer site   | 3001         |
| frontend-admin  | Admin dashboard | 3002         |
| nginx           | Reverse proxy   | 80           |

---

# Docker Compose

The `docker-compose.yaml` file orchestrates:

- backend container
- frontend-coffee container
- frontend-admin container
- nginx container

All services share the same Docker network.

---

# Example docker-compose structure

---

# Services

| Service         | Description     | Default Port |
| --------------- | --------------- | ------------ |
| backend         | API server      | 3000         |
| frontend-coffee | Customer site   | 3001         |
| frontend-admin  | Admin dashboard | 3002         |
| nginx           | Reverse proxy   | 80           |

---

# Docker Compose

The `docker-compose.yaml` file orchestrates:

- backend container
- frontend-coffee container
- frontend-admin container
- nginx container

All services share the same Docker network.

---

# Example docker-compose structure

services:
backend
frontend-coffee
frontend-admin
nginx

---

# Nginx Routing

Example routing configuration:

/ → frontend-coffee
/admin → frontend-admin
/api → backend

This allows:

- Public storefront at root domain
- Admin panel under `/admin`
- API served under `/api`

---

# Deployment Environment

Target environment:

- Oracle VM VirtualBox
- Ubuntu Server ISO
- Docker Engine
- Docker Compose
- Nginx (containerized)

---

# Deployment Steps

## 1. Clone Repository

`RUN: git clone <repo-url>`
`RUN: cd repo`

## 2. Build and Run Containers

`RUN: docker compose up --build -d`

## 3. Verify Running Containers

`RUN: docker ps`

You should see:

- backend
- frontend-admin
- frontend-coffee
- nginx

---

# Access URLs

After deployment:

### Coffee Storefront

`http://<server-ip>/`

### Admin Dashboard

`http://<server-ip>/admin`

### API

`http://<server-ip>/api`

---

# Networking

All containers communicate through Docker internal network:

- frontend-coffee → backend
- frontend-admin → backend
- nginx → all services

No direct port exposure required except Nginx.

---

# Production Notes

Recommended production setup:

- expose only nginx port (80 or 443)
- keep backend internal
- keep frontends internal
- use nginx as single entry point
- optionally add SSL later

---

# Future Enhancements

- HTTPS with Let's Encrypt
- Domain configuration
- CI/CD deployment
- Database container
- Persistent storage
- Rate limiting
- Auth hardening

---

# Summary

This repository contains:

- Backend API
- Admin Dashboard
- Coffee Storefront
- Docker Compose orchestration
- Nginx reverse proxy configuration

Designed for deployment on:

- Oracle VM
- Ubuntu Server
- Docker
- Nginx

The architecture separates responsibilities while allowing a clean, production-like deployment using containerized services.
