# AJ MART — Multi-Vendor E-Commerce Platform

A full-stack multi-vendor marketplace where buyers shop across independent seller stores, sellers manage their own inventory and payouts, and an admin oversees the entire platform — all backed by real-time chat and Stripe payments.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Key Flows](#key-flows)

---

## Live Demo

> Deploy link coming soon. Screenshots are available in the project root.

| Screenshot | Preview |
|---|---|
| Landing page | `landing_pag.PNG` |
| Product detail | `product detail page.PNG` |
| Seller dashboard | `seller-dashboard.PNG` |
| Checkout | `checkout.PNG` |
| Payment | `checkout-payment.PNG` |

---

## Features

### Buyer
- Register with email activation (5-minute token)
- Login / logout with JWT stored in an HttpOnly cookie
- Browse products by category, search, best-selling, and featured
- Timed sale events with live countdown timers
- Product detail pages with image gallery, ratings, and reviews
- Add to cart and wishlist (Redux-persisted)
- Multi-step checkout — address → payment → confirmation
- Stripe card payments (PaymentIntent flow)
- Order history, order detail, and order tracking
- Request a refund on delivered orders
- Submit a product review (one per order item, post-delivery)
- Real-time inbox messaging with sellers (Socket.io)

### Seller
- Register a shop with email activation
- Seller-scoped JWT cookie (`seller_token`) separate from buyer auth
- Dashboard: revenue overview, order counts, product counts
- Create, list, and delete products (multi-image upload via Multer)
- Create, list, and delete timed events
- Manage orders and update status (Processing → Shipped → Delivered)
- Approve or reject buyer refund requests (stock restored on refund)
- Coupon code management
- Available balance tracking — 90 % of each delivered order credited
- Withdraw request submission; history of approved transactions
- Shop settings — name, description, address, phone, avatar
- Real-time inbox messaging with buyers

### Admin
- Admin account auto-seeded from `.env` on first server start
- View and delete all users
- View and delete all sellers
- View all products across the platform
- View all orders across the platform
- Approve seller withdraw requests

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | UI framework, fast HMR dev server |
| **Routing** | React Router v6 | Client-side routing |
| **State** | Redux Toolkit | Cart, wishlist, user, seller, orders |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Payments (client)** | Stripe.js / @stripe/react-stripe-js | Card element, PaymentIntent confirmation |
| **Real-time (client)** | socket.io-client | Live chat |
| **Notifications** | react-toastify | Toast alerts |
| **Backend** | Node.js + Express | REST API |
| **Database** | MongoDB Atlas + Mongoose | Document store |
| **Auth** | JWT + bcryptjs | Stateless auth, password hashing |
| **File uploads** | Multer | Local disk storage for images |
| **Email** | Nodemailer + Gmail SMTP | Activation and notification emails |
| **Payments (server)** | Stripe SDK | PaymentIntent creation |
| **Real-time (server)** | Socket.io | WebSocket server for chat |

---

## Architecture

```
┌──────────────────────────────────────────────┐
│                  Browser                     │
│  React + Redux + Stripe.js + Socket.io-client│
└────────────────┬─────────────────────────────┘
                 │  REST (HTTP/HTTPS)
                 │  WebSocket (Socket.io)
┌────────────────▼─────────────────────────────┐
│             Express API  :8000               │
│  /api/v2/user    /api/v2/shop                │
│  /api/v2/product /api/v2/event               │
│  /api/v2/order   /api/v2/coupon              │
│  /api/v2/conversation  /api/v2/message       │
│  /api/v2/payment /api/v2/withdraw            │
│  /uploads (static images)                   │
└───────┬─────────────────┬────────────────────┘
        │                 │
┌───────▼──────┐  ┌───────▼────────┐
│ MongoDB Atlas│  │  Stripe API    │
│  (Mongoose)  │  │ (PaymentIntent)│
└──────────────┘  └────────────────┘
```

**Authentication flow:**
- Buyer JWT → `token` cookie (HttpOnly)
- Seller JWT → `seller_token` cookie (HttpOnly)
- Both signed with the same `JWT_SECRET_KEY`; role enforcement is done per-middleware (`isAuthenticated`, `isSeller`, `isAdmin`)

**Image storage:**
- Multer writes uploads to `backend/uploads/`
- Express serves the directory as `/uploads` static
- On delete the file is removed from disk

---

## Project Structure

```
week_1/
├── backend/
│   ├── config/
│   │   └── .env                  # All secrets (never commit)
│   ├── controller/               # Express routers (one file per domain)
│   │   ├── user.js
│   │   ├── shop.js
│   │   ├── product.js
│   │   ├── event.js
│   │   ├── order.js
│   │   ├── coupounCode.js
│   │   ├── conversation.js
│   │   ├── message.js
│   │   ├── payment.js
│   │   └── withdraw.js
│   ├── model/                    # Mongoose schemas
│   │   ├── user.js
│   │   ├── shop.js
│   │   ├── product.js
│   │   ├── event.js
│   │   ├── order.js
│   │   ├── couponCode.js
│   │   ├── conversation.js
│   │   ├── messages.js
│   │   └── withdraw.js
│   ├── middleware/
│   │   ├── auth.js               # isAuthenticated, isSeller, isAdmin
│   │   ├── catchAsyncErrors.js
│   │   └── error.js              # Global error handler
│   ├── utils/
│   │   ├── ErrorHandler.js
│   │   ├── jwtToken.js           # sendToken for users
│   │   ├── shopToken.js          # sendToken for sellers
│   │   └── sendMail.js           # Nodemailer wrapper
│   ├── db/
│   │   └── Database.js           # Mongoose connect
│   ├── multer.js                 # Multer disk storage config
│   ├── app.js                    # Express app (middleware + routes)
│   └── server.js                 # HTTP server + Socket.io + admin seed
│
└── frontend/
    ├── src/
    │   ├── pages/                # One file per page/route
    │   ├── components/
    │   │   ├── Admin/
    │   │   ├── Checkout/
    │   │   ├── Events/
    │   │   ├── Layout/           # Header, Footer
    │   │   ├── Login/ Signup/
    │   │   ├── Messaging/
    │   │   ├── Payment/
    │   │   ├── Products/
    │   │   ├── Profile/
    │   │   ├── Route/            # Home page sections
    │   │   ├── Shop/             # Seller dashboard components
    │   │   └── Wishlist/ cart/
    │   ├── redux/
    │   │   ├── store.js
    │   │   ├── actions/
    │   │   └── reducers/
    │   ├── static/data.js        # Seed/demo data
    │   ├── server.js             # Axios base URL
    │   └── App.jsx               # Route definitions
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- yarn
- A MongoDB Atlas cluster (or local MongoDB)
- A Stripe test account
- A Gmail account with an App Password for SMTP

### 1 — Clone and install

```bash
git clone <repo-url>
cd week_1

# Backend
cd backend && yarn install

# Frontend
cd ../frontend && yarn install
```

### 2 — Configure environment

Copy the template and fill in your values:

```bash
cp backend/config/.env.example backend/config/.env
```

See [Environment Variables](#environment-variables) for all keys.

### 3 — Run

Open two terminals:

```bash
# Terminal 1 — API
cd backend && yarn dev

# Terminal 2 — Frontend
cd frontend && yarn dev
```

- API: `http://localhost:8000`
- Frontend: `http://localhost:5173`

On the first backend start the admin account is created automatically from the `ADMIN_*` vars in `.env`. You will see:

```
MongoDB connected: ...
Admin user seeded: your@email.com
```

---

## Environment Variables

All variables live in `backend/config/.env`.

| Variable | Description |
|---|---|
| `PORT` | Express server port (default `8000`) |
| `FRONTEND_URL` | Used for CORS and activation email links |
| `DB_URL` | MongoDB connection string |
| `JWT_SECRET_KEY` | Signs both user and seller JWTs |
| `JWT_EXPIRES` | Token expiry e.g. `1d` |
| `ACTIVATION_SECRET` | Signs the 5-minute activation tokens |
| `SMTP_HOST` | SMTP host e.g. `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port e.g. `465` |
| `SMTP_SERVICE` | e.g. `gmail` |
| `SMTP_MAIL` | Sender email address |
| `SMTP_PASSWORD` | Gmail App Password (not your login password) |
| `STRIPE_API_KEY` | Stripe publishable key (sent to frontend) |
| `STRIPE_SECRET_KEY` | Stripe secret key (server only) |
| `ADMIN_NAME` | Display name for the seeded admin |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |

---

## API Reference

All endpoints are prefixed `/api/v2`.

### Users `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-user` | — | Register; sends activation email |
| `POST` | `/activation` | — | Activate account from email token |
| `POST` | `/login-user` | — | Login; sets `token` cookie |
| `GET` | `/getuser` | User | Load current user |
| `GET` | `/user-info/:id` | — | Public user info (for chat) |
| `GET` | `/logout` | — | Clear `token` cookie |
| `GET` | `/admin-all-users` | Admin | List all users |
| `DELETE` | `/delete-user/:id` | Admin | Delete a user |

### Shops (Sellers) `/shop`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-shop` | — | Register shop; sends activation email |
| `POST` | `/activation` | — | Activate shop from email token |
| `POST` | `/login-shop` | — | Login; sets `seller_token` cookie |
| `GET` | `/getSeller` | Seller | Load current seller |
| `GET` | `/get-shop-info/:id` | — | Public shop profile |
| `GET` | `/logout` | — | Clear `seller_token` cookie |
| `PUT` | `/update-shop-avatar` | Seller | Replace shop avatar |
| `PUT` | `/update-seller-info` | Seller | Update name/description/address |
| `GET` | `/admin-all-sellers` | Admin | List all sellers |
| `DELETE` | `/delete-seller/:id` | Admin | Delete a seller |

### Products `/product`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-product` | — | Create product (multi-image) |
| `GET` | `/get-all-products` | — | All products (public) |
| `GET` | `/get-all-products-shop/:id` | — | Products for one shop |
| `DELETE` | `/delete-shop-product/:id` | Seller | Delete product + images from disk |
| `PUT` | `/create-new-review` | User | Add/update review; marks order item reviewed |
| `GET` | `/admin-all-products` | Admin | All products |

### Events `/event`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-event` | — | Create timed sale event |
| `GET` | `/get-all-events` | — | All events (public) |
| `GET` | `/get-all-events-shop/:id` | — | Events for one shop |
| `DELETE` | `/delete-shop-event/:id` | Seller | Delete event + images |

### Orders `/order`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-order` | — | Create orders (one per shop in cart); decrements stock |
| `GET` | `/get-all-orders/:userId` | — | Buyer's order history |
| `GET` | `/get-seller-all-orders/:shopId` | — | Seller's order list |
| `PUT` | `/update-order-status/:id` | Seller | Update status; credits seller on Delivered |
| `PUT` | `/order-refund/:id` | — | Buyer requests refund |
| `PUT` | `/order-refund-success/:id` | Seller | Approve refund; restores stock |
| `GET` | `/admin-all-orders` | Admin | All orders |

### Payment `/payment`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/process` | — | Create Stripe PaymentIntent; returns `client_secret` |
| `GET` | `/stripeapikey` | — | Return publishable key to frontend |

### Conversations `/conversation`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-new-conversation` | — | Create or return existing conversation |
| `GET` | `/get-all-conversation-seller/:id` | Seller | Seller's inbox |
| `GET` | `/get-all-conversation-user/:id` | User | Buyer's inbox |
| `PUT` | `/update-last-message/:id` | — | Update last message preview |

### Messages `/message`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-new-message` | — | Send a message |
| `GET` | `/get-all-messages/:id` | — | Fetch all messages in a conversation |

### Withdraw `/withdraw`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-withdraw-request` | Seller | Request payout; deducts from balance |
| `GET` | `/get-all-withdraw-request-seller/:id` | Seller | Seller's request history |
| `GET` | `/get-all-withdraw-request` | Admin | All requests |
| `PUT` | `/update-withdraw-request/:id` | Admin | Approve request; records transaction |

### Coupon Codes `/coupon`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-coupon-code` | Seller | Create coupon |
| `GET` | `/get-coupon/:name` | — | Validate coupon by name |
| `GET` | `/get-coupon-shop/:id` | Seller | Seller's coupons |
| `DELETE` | `/delete-coupon/:id` | Seller | Delete coupon |

---

## Database Models

### User
`name · email · password (bcrypt) · phoneNumber · addresses[] · role (default: "user") · avatar{public_id, url}`

### Shop
`name · email · password (bcrypt) · description · address · phoneNumber · zipCode · role (default: "Seller") · avatar · availableBalance · transactions[] · withdrawMethod`

### Product
`name · description · category · tags · originalPrice · discountPrice · stock · sold_out · shopId · shop (embedded) · images[] · reviews[] · ratings`

### Event
`name · description · category · tags · originalPrice · discountPrice · stock · sold_out · shopId · shop (embedded) · images[] · startDate · endDate · status`

### Order
`cart[] · shippingAddress · user (embedded) · totalPrice · status · paymentInfo{id, status, type} · paidAt · deliveredAt`

### Conversation
`groupTitle · members[] · lastMessage · lastMessageId`

### Message
`conversationId · text · sender · images[]`

### CouponCode
`name · value · shopId`

### Withdraw
`seller{_id, name, email} · amount · status (Processing / succeed)`

---

## Key Flows

### Registration & Activation
```
User fills form → POST /create-user (multipart)
  → Server stores payload in 5-min JWT
  → Sends activation email with link
  → User clicks link → frontend POSTs token to /activation
  → Server verifies, creates User, sets cookie
```

### Checkout & Payment
```
Buyer reviews cart → enters address → hits /payment/stripeapikey
  → renders Stripe card element
  → POST /payment/process (amount) → Stripe returns client_secret
  → stripe.confirmCardPayment(client_secret, card)
  → on success → POST /order/create-order
  → stock decremented per item, one Order doc per shop
```

### Seller Payout
```
Order delivered → seller status → "Delivered"
  → shop.availableBalance += totalPrice * 0.9  (10 % platform fee)
  → Seller hits /withdraw/create-withdraw-request
  → Admin sees request → PUT /update-withdraw-request/:id
  → status = "succeed", transaction appended to shop.transactions
```

### Real-time Chat
```
User opens inbox → socket.emit("addUser", userId)
  → POST /conversation/create-new-conversation
  → GET /message/get-all-messages/:conversationId
  → socket.emit("sendMessage", {senderId, receiverId, text})
  → server relays → socket.emit("getMessage", ...) to recipient
```
