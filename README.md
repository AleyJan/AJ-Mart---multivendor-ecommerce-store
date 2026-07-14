# AJ MART — Multi-Vendor E-Commerce Platform

A full-stack multi-vendor marketplace where buyers shop across independent seller stores, sellers manage their own inventory and payouts, and an admin oversees the entire platform - all backed by real-time chat and Stripe payments.

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

> Deploy link: https://aj-mart-multivendor-ecommerce-store-sepia.vercel.app/

## Features

### Buyer

- Register with email activation (5-minute token)
- Login / logout with JWT stored in an HttpOnly cookie (cross-domain-ready)
- **Forgot / reset password** via a hashed, 15-minute email token
- Browse products by category, search, best-selling, and featured
- Product cards with a **multi-image slider**
- Timed sale events with live countdown timers
- Product detail pages with image gallery, ratings, and reviews
- Add to cart and wishlist (Redux-persisted)
- Multi-step checkout — address → payment → confirmation
- **Payment options: Stripe card, Cash on Delivery, or a saved "default" card**
- Order history, order detail, and order tracking
- Request a refund on delivered orders
- Submit a product review (one per order item, post-delivery)
- Real-time inbox messaging with sellers (Socket.io)
- **Profile dashboard**: edit name/phone/email, change avatar, saved **addresses**, saved **payment methods**, inbox
- **Newsletter subscribe** (footer) with unsubscribe link in every email
- **Fiverr-style role switch** — jump to the seller dashboard (or seller registration) from the buyer site

### Seller

- Register a shop with email activation
- **Forgot / reset shop password** via a hashed, 15-minute email token
- Seller-scoped JWT cookie (`seller_token`) separate from buyer auth
- **Email-match guard** — the seller dashboard only loads when the seller session isn't shadowing a different person's buyer session
- Dashboard: revenue overview, order counts, product counts
- **Create, edit, and delete products** (multi-image upload to Cloudinary; optional discount price)
- Create, list, and delete timed events
- **New events automatically email all newsletter subscribers**
- Manage orders and update status (Processing → Shipped → Delivered)
- Approve or reject buyer refund requests (stock restored on refund)
- Coupon code management
- Available balance tracking — 90 % of each delivered order credited
- Withdraw request submission; history of approved transactions
- Shop settings — name, description, address, phone, avatar
- Real-time inbox messaging with buyers
- **Fiverr-style role switch** — jump to the buyer site (or buyer registration) from the dashboard

### Admin

- Admin account auto-seeded from `.env` on first server start
- View and delete all users
- View and delete all sellers
- View all products across the platform
- View all orders across the platform
- Approve seller withdraw requests
- **View and remove newsletter subscribers**

---

## Tech Stack

| Layer                  | Technology                          | Purpose                                       |
| ---------------------- | ----------------------------------- | --------------------------------------------- |
| **Frontend**           | React 18 + Vite                     | UI framework, fast HMR dev server             |
| **Routing**            | React Router v6                     | Client-side routing                           |
| **State**              | Redux Toolkit                       | Cart, wishlist, user, seller, orders          |
| **Styling**            | Tailwind CSS                        | Utility-first CSS                             |
| **Payments (client)**  | Stripe.js / @stripe/react-stripe-js | Card element, PaymentIntent confirmation      |
| **Real-time (client)** | socket.io-client                    | Live chat                                     |
| **Notifications**      | react-toastify                      | Toast alerts                                  |
| **Backend**            | Node.js + Express                   | REST API                                      |
| **Database**           | MongoDB Atlas + Mongoose            | Document store                                |
| **Auth**               | JWT + bcryptjs                      | Stateless auth, password hashing              |
| **File uploads**       | Multer (memory) + Cloudinary        | In-memory buffer streamed to Cloudinary CDN   |
| **Email**              | Nodemailer + Gmail SMTP             | Activation, password reset, subscriber emails |
| **Payments (server)**  | Stripe SDK                          | PaymentIntent creation                        |
| **Real-time (server)** | Socket.io                           | WebSocket server for chat                     |

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
│  /api/v2/subscriber                          │
└───────┬───────────┬───────────────┬──────────┘
        │           │               │
┌───────▼──────┐ ┌──▼─────────┐ ┌───▼────────┐
│ MongoDB Atlas│ │ Cloudinary │ │ Stripe API │
│  (Mongoose)  │ │  (images)  │ │ (Payment)  │
└──────────────┘ └────────────┘ └────────────┘
```

Deployed as split Vercel projects: the frontend static build and the backend as a serverless function (`backend/api/index.js`) with a cached Mongoose connection.

**Authentication flow:**

- Buyer JWT → `token` cookie (HttpOnly)
- Seller JWT → `seller_token` cookie (HttpOnly)
- Both signed with the same `JWT_SECRET_KEY`; role enforcement is done per-middleware (`isAuthenticated`, `isSeller`, `isAdmin`)
- Cookies are `SameSite=None; Secure` in production (cross-domain frontend/backend) and `lax` in development; lifetime matches the JWT (`maxAge` 1 day). CORS accepts `FRONTEND_URL` plus any origins in `ALLOWED_ORIGINS`.

**Image storage:**

- Multer keeps the upload in memory (`memoryStorage`); the buffer is streamed to Cloudinary via `upload_stream`
- Each image is stored as `{ public_id, url }` (Cloudinary `secure_url`) on the document
- On delete, the Cloudinary asset is removed with `cloudinary.uploader.destroy(public_id)`

---

## Project Structure

```
week_1/
├── backend/
│   ├── config/
│   │   └── .env                  # All secrets (never commit)
│   ├── api/
│   │   └── index.js              # Vercel serverless entry (cached DB connection)
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
│   │   ├── withdraw.js
│   │   └── subscriber.js         # Newsletter subscribe / unsubscribe / admin list
│   ├── model/                    # Mongoose schemas
│   │   ├── user.js
│   │   ├── shop.js
│   │   ├── product.js
│   │   ├── event.js
│   │   ├── order.js
│   │   ├── couponCode.js
│   │   ├── conversation.js
│   │   ├── messages.js
│   │   ├── withdraw.js
│   │   └── subscriber.js         # SubscribedEmail (collection: subscribedemails)
│   ├── middleware/
│   │   ├── auth.js               # isAuthenticated, isSeller, isAdmin
│   │   ├── catchAsyncErrors.js
│   │   └── error.js              # Global error handler
│   ├── utils/
│   │   ├── ErrorHandler.js
│   │   ├── jwtToken.js           # sendToken for users
│   │   ├── shopToken.js          # sendToken for sellers
│   │   ├── cookieOptions.js      # Shared auth-cookie flags (SameSite/Secure/maxAge)
│   │   ├── cloudinary.js         # Cloudinary config + uploadBuffer/destroy helpers
│   │   └── sendMail.js           # Nodemailer wrapper
│   ├── db/
│   │   └── Database.js           # Mongoose connect (cached for serverless)
│   ├── multer.js                 # Multer memory storage config
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
    │   ├── routes/               # GuestRoute + useSellerAccess session guards
    │   ├── static/data.js        # Category + nav config (demo product data removed)
    │   ├── server.js             # Axios base URL
    │   └── App.jsx               # Route definitions
    ├── public/                   # logo.png (favicon), home-logo.png (brand logo)
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
git clone https://github.com/AleyJan/AJ-Mart---multivendor-ecommerce-store.git


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

| Variable                | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `PORT`                  | Express server port (default `8000`)                              |
| `NODE_ENV`              | `PRODUCTION` in prod (drives Secure/SameSite cookies)             |
| `FRONTEND_URL`          | CORS origin + activation/reset/subscriber email links             |
| `ALLOWED_ORIGINS`       | Extra comma-separated CORS origins (e.g. `http://localhost:5173`) |
| `DB_URL`                | MongoDB connection string                                         |
| `JWT_SECRET_KEY`        | Signs both user and seller JWTs                                   |
| `JWT_EXPIRES`           | Token expiry e.g. `1d` (cookie `maxAge` matches this)             |
| `ACTIVATION_SECRET`     | Signs the 5-minute activation tokens                              |
| `SMTP_HOST`             | SMTP host e.g. `smtp.gmail.com`                                   |
| `SMTP_PORT`             | SMTP port e.g. `465`                                              |
| `SMTP_SERVICE`          | e.g. `gmail`                                                      |
| `SMTP_MAIL`             | Sender email address                                              |
| `SMTP_PASSWORD`         | Gmail App Password (not your login password)                      |
| `CLOUDINARY_NAME`       | Cloudinary cloud name                                             |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                                |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                                             |
| `STRIPE_API_KEY`        | Stripe publishable key (sent to frontend)                         |
| `STRIPE_SECRET_KEY`     | Stripe secret key (server only)                                   |
| `ADMIN_NAME`            | Display name for the seeded admin                                 |
| `ADMIN_EMAIL`           | Email for the seeded admin account                                |
| `ADMIN_PASSWORD`        | Password for the seeded admin account                             |

---

## API Reference

All endpoints are prefixed `/api/v2`.

### Users `/user`

| Method   | Endpoint                     | Auth  | Description                                  |
| -------- | ---------------------------- | ----- | -------------------------------------------- |
| `POST`   | `/create-user`               | —     | Register; sends activation email             |
| `POST`   | `/activation`                | —     | Activate account from email token            |
| `POST`   | `/login-user`                | —     | Login; sets `token` cookie                   |
| `GET`    | `/getuser`                   | User  | Load current user                            |
| `GET`    | `/user-info/:id`             | —     | Public user info (for chat)                  |
| `GET`    | `/exists?email=`             | —     | Whether a buyer account exists (role switch) |
| `GET`    | `/logout`                    | —     | Clear `token` cookie                         |
| `PUT`    | `/update-user-info`          | User  | Update name / email / phone                  |
| `PUT`    | `/update-avatar`             | User  | Replace avatar (Cloudinary)                  |
| `PUT`    | `/update-user-addresses`     | User  | Add or update an address (by type)           |
| `DELETE` | `/delete-user-address/:id`   | User  | Remove a saved address                       |
| `PUT`    | `/update-payment-methods`    | User  | Add a card (stores brand/last4/expiry)       |
| `PUT`    | `/set-default-payment/:id`   | User  | Set a saved card as default                  |
| `DELETE` | `/delete-payment-method/:id` | User  | Remove a saved card                          |
| `POST`   | `/forgot-password`           | —     | Email a reset link (15-min token)            |
| `PUT`    | `/reset-password/:token`     | —     | Set a new password from the token            |
| `GET`    | `/admin-all-users`           | Admin | List all users                               |
| `DELETE` | `/delete-user/:id`           | Admin | Delete a user                                |

### Shops (Sellers) `/shop`

| Method   | Endpoint                 | Auth   | Description                                 |
| -------- | ------------------------ | ------ | ------------------------------------------- |
| `POST`   | `/create-shop`           | —      | Register shop; sends activation email       |
| `POST`   | `/activation`            | —      | Activate shop from email token              |
| `POST`   | `/login-shop`            | —      | Login; sets `seller_token` cookie           |
| `GET`    | `/getSeller`             | Seller | Load current seller                         |
| `GET`    | `/get-shop-info/:id`     | —      | Public shop profile                         |
| `GET`    | `/exists?email=`         | —      | Whether a shop account exists (role switch) |
| `GET`    | `/logout`                | —      | Clear `seller_token` cookie                 |
| `PUT`    | `/update-shop-avatar`    | Seller | Replace shop avatar (Cloudinary)            |
| `PUT`    | `/update-seller-info`    | Seller | Update name/description/address             |
| `POST`   | `/forgot-password`       | —      | Email a shop reset link (15-min token)      |
| `PUT`    | `/reset-password/:token` | —      | Set a new shop password                     |
| `GET`    | `/admin-all-sellers`     | Admin  | List all sellers                            |
| `DELETE` | `/delete-seller/:id`     | Admin  | Delete a seller                             |

### Products `/product`

| Method   | Endpoint                     | Auth   | Description                                          |
| -------- | ---------------------------- | ------ | ---------------------------------------------------- |
| `POST`   | `/create-product`            | —      | Create product (multi-image → Cloudinary)            |
| `GET`    | `/get-product/:id`           | —      | Single product (used by the edit form)               |
| `PUT`    | `/update-product/:id`        | Seller | Edit product; ownership-checked; optional new images |
| `GET`    | `/get-all-products`          | —      | All products (public)                                |
| `GET`    | `/get-all-products-shop/:id` | —      | Products for one shop                                |
| `DELETE` | `/delete-shop-product/:id`   | Seller | Delete product + Cloudinary images                   |
| `PUT`    | `/create-new-review`         | User   | Add/update review; marks order item reviewed         |
| `GET`    | `/admin-all-products`        | Admin  | All products                                         |

### Events `/event`

| Method   | Endpoint                   | Auth   | Description             |
| -------- | -------------------------- | ------ | ----------------------- |
| `POST`   | `/create-event`            | —      | Create timed sale event |
| `GET`    | `/get-all-events`          | —      | All events (public)     |
| `GET`    | `/get-all-events-shop/:id` | —      | Events for one shop     |
| `DELETE` | `/delete-shop-event/:id`   | Seller | Delete event + images   |

### Orders `/order`

| Method | Endpoint                         | Auth   | Description                                            |
| ------ | -------------------------------- | ------ | ------------------------------------------------------ |
| `POST` | `/create-order`                  | —      | Create orders (one per shop in cart); decrements stock |
| `GET`  | `/get-all-orders/:userId`        | —      | Buyer's order history                                  |
| `GET`  | `/get-seller-all-orders/:shopId` | —      | Seller's order list                                    |
| `PUT`  | `/update-order-status/:id`       | Seller | Update status; credits seller on Delivered             |
| `PUT`  | `/order-refund/:id`              | —      | Buyer requests refund                                  |
| `PUT`  | `/order-refund-success/:id`      | Seller | Approve refund; restores stock                         |
| `GET`  | `/admin-all-orders`              | Admin  | All orders                                             |

### Payment `/payment`

| Method | Endpoint        | Auth | Description                                          |
| ------ | --------------- | ---- | ---------------------------------------------------- |
| `POST` | `/process`      | —    | Create Stripe PaymentIntent; returns `client_secret` |
| `GET`  | `/stripeapikey` | —    | Return publishable key to frontend                   |

### Conversations `/conversation`

| Method | Endpoint                           | Auth   | Description                            |
| ------ | ---------------------------------- | ------ | -------------------------------------- |
| `POST` | `/create-new-conversation`         | —      | Create or return existing conversation |
| `GET`  | `/get-all-conversation-seller/:id` | Seller | Seller's inbox                         |
| `GET`  | `/get-all-conversation-user/:id`   | User   | Buyer's inbox                          |
| `PUT`  | `/update-last-message/:id`         | —      | Update last message preview            |

### Messages `/message`

| Method | Endpoint                | Auth | Description                          |
| ------ | ----------------------- | ---- | ------------------------------------ |
| `POST` | `/create-new-message`   | —    | Send a message                       |
| `GET`  | `/get-all-messages/:id` | —    | Fetch all messages in a conversation |

### Withdraw `/withdraw`

| Method | Endpoint                               | Auth   | Description                          |
| ------ | -------------------------------------- | ------ | ------------------------------------ |
| `POST` | `/create-withdraw-request`             | Seller | Request payout; deducts from balance |
| `GET`  | `/get-all-withdraw-request-seller/:id` | Seller | Seller's request history             |
| `GET`  | `/get-all-withdraw-request`            | Admin  | All requests                         |
| `PUT`  | `/update-withdraw-request/:id`         | Admin  | Approve request; records transaction |

### Coupon Codes `/coupon`

| Method   | Endpoint               | Auth   | Description             |
| -------- | ---------------------- | ------ | ----------------------- |
| `POST`   | `/create-coupon-code`  | Seller | Create coupon           |
| `GET`    | `/get-coupon/:name`    | —      | Validate coupon by name |
| `GET`    | `/get-coupon-shop/:id` | Seller | Seller's coupons        |
| `DELETE` | `/delete-coupon/:id`   | Seller | Delete coupon           |

### Subscribers `/subscriber`

| Method   | Endpoint             | Auth  | Description                         |
| -------- | -------------------- | ----- | ----------------------------------- |
| `POST`   | `/subscribe`         | —     | Add an email to the newsletter list |
| `PUT`    | `/unsubscribe`       | —     | Remove an email (from email links)  |
| `GET`    | `/admin-subscribers` | Admin | List all subscribers                |
| `DELETE` | `/admin-delete/:id`  | Admin | Remove a subscriber                 |

> Creating an event (`POST /event/create-event`) emails every subscriber a "new event" notice with an unsubscribe link.

---

## Database Models

### User

`name · email · password (bcrypt) · phoneNumber · addresses[] · paymentMethods[]{cardHolderName, brand, last4, expiryDate, isDefault} · role (default: "user") · avatar{public_id, url} · resetPasswordToken · resetPasswordTime`

> Payment methods store only the card brand, last 4 digits, and expiry — never the full number or CVV.

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

### SubscribedEmail

`email (unique, lowercased) · timestamps` — collection `subscribedemails`

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

### Password Reset

```
User submits email → POST /(user|shop)/forgot-password
  → server stores sha256(resetToken) + 15-min expiry
  → emails FRONTEND_URL/reset-password/(user|shop)/<rawToken>
  → user opens link, submits new password
  → PUT /(user|shop)/reset-password/:token
  → server matches hashed token + expiry, sets new password, clears token
```

### Newsletter & Event Notifications

```
Visitor enters email in footer → POST /subscriber/subscribe (stored, de-duped)
Seller creates an event → POST /event/create-event
  → after save, server emails all subscribers a "new event" notice
  → each email carries FRONTEND_URL/unsubscribe?email=<email>
  → clicking it → PUT /subscriber/unsubscribe (idempotent removal)
Admin → Subscribers tab → GET /subscriber/admin-subscribers (list / remove)
```

### Role Switch (Fiverr-style)

```
Buyer clicks "Go to Seller Dashboard"
  → already the matching seller? → /dashboard
  → else GET /shop/exists?email=<buyer email>
      → exists → /shop-login   (authenticate as that seller)
      → not    → /shop-create  (register a shop)
Seller "Go to Buyer Dashboard" mirrors this against /user/exists.
The seller dashboard only renders when the seller session's email matches the
logged-in buyer's — a stale/other session can't leak another person's store.
```
