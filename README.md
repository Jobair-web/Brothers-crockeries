# Brothers Crockeries (New Brothers Crockeries)

```
Brothers crockeries/
├── client/   Next.js 16 (App Router) · Tailwind CSS v4 · DaisyUI 5 · Better Auth · Zustand
└── server/   Express · MongoDB (Mongoose) · Cloudinary or ImageKit
```

## 1. Run it

**Prerequisites:** Node 20+ and a MongoDB database (local or Atlas).

```bash
# API
cd server
cp .env.example .env        # fill in MONGODB_URI, BETTER_AUTH_SECRET, ADMIN_EMAILS, image storage
npm install
npm run seed                # optional: 10 categories + 49 demo products (placeholder images)
npm run dev                 # http://localhost:5000

# Website (new terminal)
cd client
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

Rules for the two `.env` files:
- `MONGODB_URI` must be the **same database** in both (include the DB name). Better Auth (in Next.js) writes users and sessions there; the API reads them to authenticate requests.
- `BETTER_AUTH_SECRET` must match in both. Generate one with `openssl rand -base64 32`.
- `ADMIN_EMAILS` (comma separated): any account created with one of these emails becomes `admin`.

## 2. Becoming admin
1. Put your email in `ADMIN_EMAILS` (both `.env` files).
2. Register at `/register` with that email, then open `/admin/dashboard`.
3. Add categories first (`/admin/categories`), then products. Orders are managed at `/admin/orders`.

## 3. Image uploads
Set **one** provider in `server/.env`:
- Cloudinary: `CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud_name>`
- ImageKit: `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`

`GET /api/health` shows which provider is active. Without one, the product form still works with pasted image URLs.

## 4. Google sign-in
Create OAuth credentials in Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI, then set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `client/.env.local`. The button is shown at the bottom of the login and register forms.

## 5. How auth works
- Better Auth runs inside Next.js (`/api/auth/*`) and stores `user`, `session`, `account` in MongoDB.
- The browser sends `Authorization: Bearer <session token>` to the Express API. The API looks the token up in the `session` collection and loads the user (`server/middleware/auth.js`). Admin routes check `role === "admin"` (or `ADMIN_EMAILS`) on the server, so the client-side admin guard is only a convenience.
- "Email or phone" login: Better Auth is email-based, so a phone number (01XXXXXXXXX) is mapped to an internal address `01XXXXXXXXX@phone.brothers-crockeries.local`. Password reset by email is therefore not available for phone-only accounts.

## 6. Feature map
| Requirement | Where |
|---|---|
| Navbar (name + logo, live search, About/Contact, wishlist & cart badges, login) | `client/src/components/layout/Navbar.tsx`, `SearchBar.tsx` |
| Auto-rotating hero | `components/home/HeroCarousel.tsx` (images in `public/hero-banner-*.jpg`) |
| Featured categories + hover scale | `components/home/FeaturedCategories.tsx` |
| Product card (heart, hover scale + image zoom) | `components/product/ProductCard.tsx` |
| Wishlist (local + synced to API when signed in) | `store/useWishlistStore.ts`, `hooks/useWishlist.ts`, `app/(shop)/wishlist` |
| Category filter + left price slider | `components/product/ProductListing.tsx`, `PriceFilter.tsx` |
| 5-column grid, 40 per page, Next pagination | `ProductGrid.tsx`, `Pagination.tsx`, `server/controllers/productController.js` |
| Reviews marquee (right to left, slow) | `components/home/CustomerReviews.tsx` + `globals.css` |
| Cart drawer / cart page / checkout (bKash/Nagad + COD) | `components/cart/CartDrawer.tsx`, `app/(shop)/cart`, `checkout` |
| Admin (products, categories, orders, payment verification, users, reviews) | `client/src/app/admin/*`, `server/controllers/*` |
| Customer reviews (submit, admin approval) | `components/home/ReviewForm.tsx`, `app/admin/reviews` |
| My orders | `client/src/app/(shop)/orders` |
| Forgot / reset password | `components/auth/PasswordForms.tsx`, `lib/better-auth.ts` |
| Ship to a different address | `app/(shop)/checkout`, `server/controllers/orderController.js` |
| FAQ and care tips | `components/home/FaqSection.tsx`, `TipsSection.tsx`, `lib/tips.ts` |
| Rate limiting, order emails | `server/server.js`, `server/utils/mailer.js`, `orderEmail.js` |

## 7. Email (optional)
Fill the `SMTP_*` and `MAIL_FROM` variables (server and client `.env`) to send order confirmations and password-reset links. Without them nothing breaks: the server logs "SMTP not configured", and the reset link is printed in the Next.js terminal so you can test locally. Order emails go only to customers who typed an email at checkout. There is no SMS: Bangladeshi SMS gateways need a paid account, so that was left out.

## 8. Tests
```bash
cd server && npm test     # node:test – slugify, shipping totals, order email
cd client && npm test     # vitest – phone/email helpers, price format
```

## 9. Things to know
- **Prices, stock and shipping are recalculated on the server** when an order is placed; the client total is only a preview. Shipping: Dhaka ৳80, Chattogram ৳70, others ৳150 (`SHIPPING_COST` in `orderController.js` and `SHIPPING_ZONES` in `client/src/lib/constants.ts`: change both).
- bKash/Nagad orders are saved as "Verify payment" with the sender number and TrxID; confirm the payment in your bKash/Nagad app, then press **Verify** in `/admin/orders`. The number shown at checkout comes from `NEXT_PUBLIC_BKASH_NUMBER` (default `01609663539`).
- The 6 reviews on the home page are **sample text** (`client/src/lib/sampleReviews.ts`). Once 6 or more approved reviews exist in the `reviews` collection, those are shown instead. Replace the samples with real customer feedback before launch.
- Seed products are demo data with placeholder images and made-up prices.
- The session token is readable by page scripts (needed for the cross-origin API). Keep dependencies updated and avoid injecting untrusted HTML.
- The FAQ answer about problems with a product and the care tips in `client/src/lib/tips.ts` are general wording. Check them against the shop's real policy before launch.
- Rate limits (in `server/server.js`): 600 requests / 15 min per IP overall, 20 orders / hour, 10 reviews / hour. Set `TRUST_PROXY=1` when deployed behind a proxy.
- Tailwind v4 is configured in CSS (`globals.css`), so there is no `tailwind.config.ts`.
