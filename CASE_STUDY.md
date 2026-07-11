# Case Study — AJ MART Multi-Vendor E-Commerce Platform

## Project Overview

| | |
|---|---|
| **Project Name** | AJ MART |
| **One-liner** | A multi-vendor marketplace that lets independent sellers run their own storefronts, accept Stripe payments, and chat with buyers in real time — all managed under a single admin panel. |
| **GitHub** | [Repository](https://github.com/AleyJan/week_1) |
| **Live Demo** | Demo coming soon |
| **Team Size** | 1 person |
| **Your Role** | Full-stack — architecture, backend API, frontend UI, auth, payments, real-time, admin panel |
| **Timeline** | 1 week, full-time (Dev Weekends Week 1) |

---

## Goals

### What We Built

- **Multi-role marketplace:** Three distinct personas — Buyer, Seller, and Admin — each with their own auth flow, dashboard, and scoped data access. Sellers never see another seller's orders or balance; admins see everything.
- **End-to-end purchase flow:** A buyer can discover a product, add it to cart, check out with a real Stripe card payment, track their order through status updates from the seller, and leave a review post-delivery.
- **Seller self-service:** Sellers register independently, manage their own product catalog and timed sale events, respond to refund requests, and request payouts from their earned balance — without needing admin intervention.

### Non-Goals (Scope Boundaries)

- **Mobile app:** 100 % of the UI is desktop/responsive web. A React Native client is deferred.
- **Cloud image storage (Cloudinary/S3):** Images are stored on local disk via Multer. A CDN-backed storage layer is a clear v2 upgrade but was out of scope for the one-week timeline.
- **Real-time inventory reservation:** Stock is decremented at order creation, not at cart-add time. A flash-sale reservation system with TTLs is a known gap for high-concurrency scenarios.
- **Email notifications for order updates:** Activation emails are sent; transactional order status emails are v2.

---

## System Architecture

### Tech Stack

| Layer | Technology | Why We Chose It | What We Considered |
|---|---|---|---|
| **Frontend** | React 18 + Vite | Fast HMR, large ecosystem, component model maps cleanly to the multi-role UI | Next.js — rejected because SSR was not needed; the app is auth-gated and not SEO-critical |
| **State** | Redux Toolkit | Cart and wishlist need to persist across routes and survive page refreshes via localStorage; Redux middleware makes this straightforward | React Context — insufficient for cross-cutting state like cart items that multiple unrelated components write to |
| **Styling** | Tailwind CSS | Utility classes allow fast iteration without context-switching to a CSS file | Styled-components — overhead of a runtime CSS-in-JS library was unjustified for this scope |
| **Backend** | Node.js + Express | Same language as the frontend, minimal boilerplate, strong Mongoose integration | NestJS — adds structure but the learning curve was a poor trade-off for a one-week build |
| **Database** | MongoDB Atlas + Mongoose | The product/order data models are document-shaped (embedded reviews, embedded cart items in orders); Atlas provides a free managed tier | PostgreSQL — relational guarantees matter for payment data, but Stripe owns the payment of record; our order document doesn't need ACID across tables |
| **Auth** | JWT in HttpOnly cookies | Stateless, no server-side session store needed; HttpOnly prevents XSS token theft; two separate cookies (`token`, `seller_token`) for dual-role support | Sessions with Redis — adds infrastructure complexity with no benefit at this scale |
| **File uploads** | Multer (disk storage) | Zero external dependency, instant setup, files served as Express static assets | Cloudinary — better for production (CDN, transformations) but introduces an external API dependency and cost for a week-1 project |
| **Payments** | Stripe PaymentIntents | PCI-compliant card handling entirely in Stripe's iframe; PaymentIntent flow supports 3DS and is the current Stripe recommendation | PayPal — smaller developer community, weaker React SDK |
| **Real-time** | Socket.io | Handles WebSocket with automatic fallback to long-polling; rooms/namespaces map to conversation participants | Firebase Realtime Database — vendor lock-in, and we already had a Node server that could host the WebSocket |
| **Email** | Nodemailer + Gmail SMTP | Free, zero infrastructure, App Passwords avoid storing the real account password | SendGrid — better for production volume but requires account setup and API keys |

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│   React + Redux  |  Stripe.js  |  socket.io-client       │
└───────────┬───────────────────┬──────────────────────────┘
            │ REST (HTTP)       │ WebSocket
            ▼                   ▼
┌───────────────────────────────────────────────────────────┐
│               Express API  :8000                          │
│                                                           │
│  /api/v2/user        /api/v2/shop                         │
│  /api/v2/product     /api/v2/event                        │
│  /api/v2/order       /api/v2/coupon                       │
│  /api/v2/conversation /api/v2/message                     │
│  /api/v2/payment     /api/v2/withdraw                     │
│  /uploads (static files — Multer disk storage)           │
│                                                           │
│  Middleware stack:                                        │
│    cors → cookieParser → express.json → routes → errors   │
└──────────┬────────────────────┬──────────────────────────┘
           │                    │
    ┌──────▼──────┐     ┌───────▼────────┐
    │ MongoDB     │     │   Stripe API   │
    │ Atlas       │     │ (PaymentIntent)│
    │ (Mongoose)  │     └────────────────┘
    └─────────────┘
```

---

## Key Features

### Authentication (Three Roles)

- **Email-activation registration** — on sign-up the server embeds the user payload in a 5-minute JWT and sends an activation link. The browser never stores unverified credentials; if the link expires the user must re-register.
- **Dual-cookie architecture** — buyers get a `token` cookie, sellers get a `seller_token` cookie. Both are HttpOnly and signed with the same `JWT_SECRET_KEY`. Separate middleware (`isAuthenticated`, `isSeller`) guards each domain's routes.
- **Role-based admin guard** — `isAdmin("Admin")` checks `req.user.role === "Admin"`. Privilege escalation is impossible from the seller path because the seller cookie's JWT payload only contains the shop ID, resolved against the `Shop` collection — not the `User` collection.
- **Admin auto-seeding** — credentials live in `.env`. On every server start, after DB connect, the seed function checks for the admin email and creates the account only if it does not exist. No manual terminal command needed.

### Product & Event Catalog

- **Multi-image upload** — sellers upload multiple images per product via a single multipart POST. Multer writes each to `backend/uploads/`; the server stores `{public_id: filename, url: "uploads/filename"}` per image. On product delete, each file is removed from disk (`fs.unlink`).
- **Timed sale events** — events have `startDate`, `endDate`, and a `status` field. The frontend renders a live countdown (`CountDown.jsx`) per event card. Events have their own catalog separate from the main product list.
- **Review system** — authenticated buyers can post one review per product per order. A re-review updates the existing entry rather than duplicating. After saving, the server recomputes `product.ratings` as the average of all review scores and marks the order line item as `isReviewed: true`.

### Cart, Checkout, and Payments

- **Client-side cart** — cart state lives in Redux, persisted to `localStorage`. No server-side cart session; this avoids the orphaned cart problem and simplifies the backend.
- **Order splitting by shop** — on checkout, the frontend sends the full cart; the backend groups items by `shopId` and creates one `Order` document per shop. This allows sellers to manage their orders independently and credits the right shop's balance.
- **Stripe PaymentIntent flow** — the server creates a PaymentIntent with the total amount and returns `client_secret`. The frontend passes this to `stripe.confirmCardPayment()`. No card data touches our server; Stripe handles PCI scope entirely.
- **Stock decrement on order creation** — `product.stock -= qty` and `product.sold_out += qty` are applied synchronously inside the order creation handler. This is a read-then-write pattern without atomic guarantees — a known trade-off acceptable at this scale (see Challenges).

### Seller Dashboard

- **Revenue tracking** — each delivered order credits `shop.availableBalance += totalPrice * 0.9` (10 % platform fee). Sellers see their live balance in the dashboard.
- **Withdraw flow** — sellers request a payout amount up to their available balance. The balance is deducted immediately on request creation. Admins approve via a PUT endpoint, which sets status to `"succeed"` and appends a transaction record to the shop's `transactions[]` array.
- **Refund management** — buyers set order status to `"Processing refund"`. Sellers see it in their refund tab and can approve, which sets status to `"Refund Success"` and restores stock (`product.stock += qty`).
- **Coupon codes** — sellers create named coupons with a percentage discount value. Buyers enter a coupon name at checkout; the frontend fetches `/api/v2/coupon/get-coupon/:name` and applies the discount locally before the payment step.

### Real-Time Messaging (Socket.io)

- **Conversation model** — a `Conversation` document holds `members: [userId, sellerId]` and a `groupTitle` (composite key). Creating a conversation is idempotent — if one with the same `groupTitle` exists it is returned, not duplicated.
- **Online presence** — on WebSocket connect, clients emit `addUser(userId)`. The server maintains an in-memory `onlineUsers` array and broadcasts the full list to all clients on join/leave.
- **Message delivery** — `sendMessage` events are relayed directly to the recipient's socket ID. If the recipient is offline the message is persisted to MongoDB via the `/message` REST API and displayed when they next open the inbox.

### Admin Panel

- **Platform overview** — `AdminDashboardMain` aggregates total users, sellers, products, and orders from four separate API calls.
- **CRUD operations** — admins can delete users and sellers. There is no soft-delete; the documents are removed from MongoDB.
- **Withdraw approvals** — the admin withdraw page lists all pending requests. Approval calls `PUT /withdraw/update-withdraw-request/:id` which flips status to `"succeed"` and appends the transaction to the seller's record.

---

## API Design

### Users

| Method | Endpoint | Description | Notes |
|---|---|---|---|
| `POST` | `/api/v2/user/create-user` | Register with avatar upload | Multipart; duplicate email → file cleaned up, 400 returned |
| `POST` | `/api/v2/user/activation` | Activate from email token | Token expires in 5 min; re-registration required after expiry |
| `POST` | `/api/v2/user/login-user` | Authenticate buyer | Sets `token` HttpOnly cookie |
| `GET` | `/api/v2/user/getuser` | Load session user | Guarded by `isAuthenticated` |
| `GET` | `/api/v2/user/logout` | Clear cookie | Expires `token` cookie immediately |
| `GET` | `/api/v2/user/admin-all-users` | List all users | Guarded by `isAuthenticated + isAdmin` |
| `DELETE` | `/api/v2/user/delete-user/:id` | Hard delete user | Admin only |

### Products

| Method | Endpoint | Description | Notes |
|---|---|---|---|
| `POST` | `/api/v2/product/create-product` | Create product | `upload.array("images")` — multiple files |
| `GET` | `/api/v2/product/get-all-products` | Public product list | Sorted by `createdAt` desc |
| `GET` | `/api/v2/product/get-all-products-shop/:id` | Shop-scoped products | No auth — public shop pages use this |
| `DELETE` | `/api/v2/product/delete-shop-product/:id` | Delete product + images | Guarded by `isSeller`; disk files unlinked |
| `PUT` | `/api/v2/product/create-new-review` | Upsert product review | Guarded by `isAuthenticated`; recomputes average rating; marks order item |

### Orders

| Method | Endpoint | Description | Notes |
|---|---|---|---|
| `POST` | `/api/v2/order/create-order` | Create orders from cart | Splits by shopId; cart items without shopId (demo data) are skipped |
| `PUT` | `/api/v2/order/update-order-status/:id` | Seller updates status | On "Delivered": credits seller balance at 90 %, marks payment succeeded |
| `PUT` | `/api/v2/order/order-refund/:id` | Buyer requests refund | Sets status to "Processing refund" |
| `PUT` | `/api/v2/order/order-refund-success/:id` | Seller approves refund | Restores stock; sets status to "Refund Success" |

### Payment

| Method | Endpoint | Description | Notes |
|---|---|---|---|
| `POST` | `/api/v2/payment/process` | Create Stripe PaymentIntent | `amount` in cents; returns `client_secret` |
| `GET` | `/api/v2/payment/stripeapikey` | Publishable key for frontend | Safe to expose — Stripe publishable keys are public by design |

---

## Database Design

```
User
  _id · name · email (unique) · password_hash · role
  phoneNumber · addresses[] · avatar{public_id, url}

Shop
  _id · name · email (unique) · password_hash · role ("Seller")
  description · address · phoneNumber · zipCode
  avatar · availableBalance · withdrawMethod
  transactions[]{amount, status, createdAt}

Product
  _id · shopId (FK→Shop) · shop (embedded snapshot)
  name · description · category · tags
  originalPrice · discountPrice · stock · sold_out
  images[]{public_id, url}
  reviews[]{user, rating, comment, productId}
  ratings (computed average)

Event
  _id · shopId (FK→Shop) · shop (embedded)
  name · description · category · startDate · endDate · status
  originalPrice · discountPrice · stock
  images[]{public_id, url}

Order
  _id · cart[] (item snapshot at purchase time)
  shippingAddress (embedded) · user (embedded)
  totalPrice · status · paymentInfo{id, status, type}
  paidAt · deliveredAt

Conversation
  _id · members[userId, sellerId] · groupTitle (composite key)
  lastMessage · lastMessageId

Message
  _id · conversationId (FK→Conversation)
  text · sender · images[]

CouponCode
  _id · name (unique per shop) · value · shopId

Withdraw
  _id · seller{_id, name, email} · amount · status
```

### Key Design Decisions

- **Embedded snapshots in orders** — `user` and `cart` are embedded as plain objects, not references. This means the order record is self-contained: if a user deletes their account or a product is removed, the order history remains intact and readable. The trade-off is that order documents can be large and the user's name on old orders won't reflect a future name change (acceptable for an order receipt).
- **Shop snapshot in products** — `shop` is embedded in each `Product` and `Event` document. This avoids a join on product listing pages, which are the highest-traffic read path. The trade-off is that a seller name change doesn't auto-update the embedded snapshot — v2 would add a background update or switch to a `$lookup`.
- **No soft deletes** — users, sellers, and products are hard-deleted. This keeps the schema simple and avoids filtering `deleted_at IS NULL` on every query. For a v2 with audit requirements, soft deletes would be introduced on the Order and User models.

---

## Key Flows

### Buyer Registration

```
Browser                    Express API              MongoDB
  │                             │                      │
  ├─POST /create-user (form)───►│                      │
  │  (name, email, pw, avatar)  │──findOne(email)─────►│
  │                             │◄── null (new user) ──│
  │                             │──embed payload in    │
  │                             │  5-min JWT           │
  │                             │──sendMail(link)──────► Gmail SMTP
  │◄──201 "check your email"────│                      │
  │                             │                      │
  ├─POST /activation (token)───►│                      │
  │                             │──jwt.verify(token)   │
  │                             │──User.create(...)───►│
  │◄──201 + Set-Cookie: token───│                      │
```

### Checkout & Payment

```
Browser                        API                  Stripe
  │                             │                      │
  ├─GET /payment/stripeapikey──►│                      │
  │◄── publishable key ─────────│                      │
  │  (render Stripe card element)                      │
  │                             │                      │
  ├─POST /payment/process ─────►│                      │
  │  {amount: 4999}             │──create PaymentIntent►│
  │                             │◄── client_secret ────│
  │◄── {client_secret} ─────────│                      │
  │                             │                      │
  │  stripe.confirmCardPayment()                       │
  │─────────────────────────────────────────────────►  │
  │◄── {paymentIntent.status: "succeeded"} ────────────│
  │                             │                      │
  ├─POST /order/create-order───►│                      │
  │  {cart, address, paymentInfo}│                     │
  │                             │──split by shopId     │
  │                             │──Order.create × N   ►│(MongoDB)
  │                             │──product.stock -= qty│
  │◄── {orders[]} ──────────────│                      │
```

### Real-Time Chat

```
Buyer Browser          Socket.io Server         Seller Browser
  │                          │                          │
  ├─emit("addUser", userId)─►│◄─emit("addUser", sellerId)
  │                          │──emit("getUsers", list)──►│
  │                          │                          │
  ├─POST /conversation/create-new-conversation          │
  ├─GET  /message/get-all-messages/:convId              │
  │                          │                          │
  ├─emit("sendMessage",{     │                          │
  │   senderId, receiverId,  │                          │
  │   text})─────────────────►──emit("getMessage",...)─►│
  │                          │                          │
  │   (also POST /message/   │                          │
  │    create-new-message    │                          │
  │    for persistence)      │                          │
```

---

## Challenges and Solutions

| # | Challenge | Why It Was Hard | Alternatives Considered | Solution | Trade-off |
|---|---|---|---|---|---|
| 1 | Dual-role auth (buyer + seller) on the same domain | A user can also be a seller; cookies from both roles coexist and must not interfere | Single cookie with role claim — ambiguous when a user has both roles | Two separate cookies (`token`, `seller_token`) resolved by separate middleware | Two round-trips on pages that need both identities; manageable at this scale |
| 2 | Order splitting by shop in a single checkout | Cart can contain items from multiple sellers; each seller must see only their own orders | One order document with all items — sellers would need to filter a shared document | Group cart by `shopId` server-side; create one `Order` per shop | More documents per checkout; `admin-all-orders` returns the full set cleanly |
| 3 | Stock not atomically decremented | Two simultaneous orders for the last item could both decrement, driving stock negative | Mongoose transactions (requires replica set or Atlas M10+); pessimistic locks | Clamp at zero: `stock = Math.max(0, stock - qty)` | Over-selling is possible under concurrency; acceptable for week-1 scope; v2 solution is a reservation TTL system |
| 4 | Image cleanup on product/user delete | Orphaned files accumulate on disk if the DB delete succeeds but `fs.unlink` fails | Cloudinary with server-side delete — moves the problem to a managed service | `fs.unlink` called after `deleteOne()`; errors are swallowed (logged, not thrown) | Silent failures on file removal; a cleanup cron job is the proper v2 fix |
| 5 | Admin account setup without a UI | Exposing a `/create-admin` endpoint is a security risk; manual DB insertion is brittle | A one-time setup script run via CLI | `ADMIN_*` vars in `.env`; seed function runs in `connectDatabase().then(seedAdmin)` — idempotent | Admin credentials are in a file on disk; must be rotated and the `.env` must never be committed |

### Deep Dive: Order Splitting by Shop

**The Problem:** When a buyer checks out a cart containing products from Shop A and Shop B, the naive approach is one `Order` document with all items mixed together. This means Shop A's seller would have to filter the shared document to find their items — a fragile pattern that breaks the seller isolation model.

**Investigation:** Mapped out the data access patterns before writing any code:
- Sellers query orders by `cart.shopId`
- Buyers query orders by `user._id`
- Admin queries all orders
- The seller's balance credit must be scoped to their items' total, not the full cart

**Solution:** Group the cart client-side and ship the full cart to the server. Server-side, iterate the cart into a `Map<shopId, items[]>`, then `Order.create()` once per entry. Each order document contains only that shop's items and a `totalPrice` computed from those items alone.

```js
const shopItemsMap = new Map();
for (const item of cart) {
  const shopId = item.shopId;
  if (!shopId) continue;          // skip demo/static items
  if (!shopItemsMap.has(shopId)) shopItemsMap.set(shopId, []);
  shopItemsMap.get(shopId).push(item);
}

for (const [, items] of shopItemsMap) {
  const totalPrice = items.reduce((acc, i) => acc + i.discountPrice * i.qty, 0);
  await Order.create({ cart: items, shippingAddress, user, totalPrice, paymentInfo });
}
```

**Result:** Each seller sees exactly their orders. Balance crediting (`shop.availableBalance += totalPrice * 0.9`) is applied per order, so multi-shop checkouts credit each seller independently. The buyer sees all orders returned as an array and displays them in a unified list.

---

## Best Practices Applied

### Security

- [x] **Password hashing** — bcryptjs with 10 salt rounds on both User and Shop models via a `pre("save")` hook
- [x] **HttpOnly cookies** — JWT tokens are never accessible from JavaScript; mitigates XSS token theft
- [x] **Secrets in environment variables** — all keys in `config/.env`, which is gitignored
- [x] **Role guards on every protected route** — `isAuthenticated`, `isSeller`, `isAdmin` middleware applied at the router level, not inlined in handlers
- [x] **Activation token expiry** — registration tokens expire in 5 minutes via JWT `expiresIn`
- [x] **File validation on upload** — file presence is checked before DB operations; orphaned files from duplicate-email registrations are cleaned up immediately
- [ ] Rate limiting on auth endpoints — not implemented; v2 priority
- [ ] CSRF protection — cookies use `sameSite: lax`; explicit CSRF tokens are v2
- [ ] Input sanitization library (Joi/Zod) — validation is implicit in Mongoose schema constraints; explicit schema validation is v2

### Performance

- [x] **Mongoose schema indexes** — `email` fields on User and Shop are `unique: true` (creates an index automatically)
- [x] **Sorted queries** — all list endpoints use `.sort({ createdAt: -1 })` so MongoDB uses the natural sort with no full-collection scan on small collections
- [x] **Password field excluded by default** — `select: false` on both password fields; re-selected only in login handlers to avoid leaking hashes in GET responses
- [x] **Static file serving for images** — images served directly by Express static middleware, not proxied through route handlers
- [ ] Caching — no Redis cache layer; repeated GET /get-all-products hits MongoDB every time; CDN caching of static images is v2
- [ ] Connection pooling — Mongoose default pool (5 connections); not tuned

### Developer Experience

- [x] **Centralized error handling** — `ErrorHandler` class + `catchAsyncErrors` wrapper; all async errors funnel to a single `app.use(ErrorHandler)` middleware
- [x] **Domain-driven file structure** — one controller file per domain, one model file per collection; new developers can find any endpoint in under 10 seconds
- [x] **Environment-driven configuration** — switching from development to production requires only env var changes, no code edits
- [ ] TypeScript — not used; JavaScript throughout; v2 migration to TypeScript planned
- [ ] API documentation (Swagger) — documented in README; machine-readable spec is v2
- [ ] CI/CD pipeline — not set up; manual deploys; v2 priority

---

## Results and Metrics

| Metric | Value | Notes |
|---|---|---|
| **API response time (login)** | ~120 ms | Measured locally; includes bcrypt compare + JWT sign |
| **Admin seed check on startup** | < 50 ms | Single `findOne` query after DB connect |
| **Image upload (single)** | < 200 ms | Multer disk write; no external API call |
| **Stripe PaymentIntent creation** | ~400 ms | Network round-trip to Stripe API |
| **Full checkout flow** | < 1 s | PaymentIntent + order creation combined |
| **Socket.io message delivery** | < 30 ms | LAN; WebSocket relay with no DB write on delivery |
| **Routes implemented** | 40+ | Across 10 domain controllers |
| **React components** | 80+ | Pages, layout, domain-specific components |

*All measurements taken on localhost with MongoDB Atlas free tier (M0) in the same region.*

---

## Learnings and Next Steps

### What Went Well

- **Two-cookie auth for dual roles** paid off immediately. Keeping buyer and seller sessions completely separate meant zero ambiguity in middleware — each route knows exactly what identity to validate without checking role strings in a shared token.
- **Order splitting server-side** was the right call. Doing it client-side (sending pre-split orders from the browser) would have allowed a malicious actor to manipulate the grouping. Server-side grouping is authoritative.
- **Socket.io for real-time chat** was far simpler to integrate than expected. The online user list, message relay, and disconnect cleanup all fit in ~50 lines of straightforward event handlers.

### What I Would Do Differently

- **Atomic inventory with a reservation system** — the current read-then-decrement pattern is the most significant correctness gap. I would implement cart-level reservations with a TTL (e.g., 15 minutes): on cart-add, `findOneAndUpdate` with `$inc: { stock: -1 }` and reject if the result is negative. Reservations expire back to stock if checkout is never completed.
- **Cloudinary from day one** — local disk storage works for development but means images are lost on server restart/redeploy and don't benefit from a CDN. The Multer storage engine can be swapped for `multer-storage-cloudinary` with minimal controller changes; I would make that swap at project start.
- **Separate the Socket.io server** — embedding Socket.io in `server.js` alongside the REST API means both scale together. For production, real-time would be extracted into a separate process or service, allowing the REST API to scale horizontally without each instance maintaining WebSocket state.

### Future Roadmap

- [ ] **Atomic inventory reservation with cart TTL** — highest correctness priority; prevents overselling under concurrent load
- [ ] **Cloudinary/S3 image storage** — removes disk dependency, adds CDN delivery and image transformations
- [ ] **Transactional order emails** — notify buyers on status changes (Shipped, Delivered, Refund approved)
- [ ] **Rate limiting on auth endpoints** — 5 requests/minute per IP on `/login-user` and `/create-user`
- [ ] **TypeScript migration** — start with models and shared types to catch schema drift at compile time
- [ ] **CI/CD with GitHub Actions** — lint + test on PR, auto-deploy to Railway/Render on merge to main
- [ ] **Soft deletes on critical models** — replace hard deletes on User and Order with `deleted_at` timestamps to support audit trails

---

## Links

- **GitHub:** Repository (see repo root)
- **Screenshots:** Available in project root — `landing_pag.PNG`, `seller-dashboard.PNG`, `checkout.PNG`, `product detail page.PNG`, `profile page.PNG`
- **README:** Full setup, API reference, and database schema — see `README.md` in this repo
