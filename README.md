# Orebi: E-Commerce Web App (React + Vite + Firebase)

An online shop with a customer storefront and an admin panel. The interface follows the **Orebi** Figma design; the Journal page and the admin panel were designed in the same style.

It runs in two modes:

| Mode | When | Data | Login |
|---|---|---|---|
| **Demo** | no Firebase keys in `.env` | built-in sample data, resets when the page reloads | admin: `admin@orebi.com` / `admin123` |
| **Firebase** | Firebase keys in `.env` | saved permanently in Cloud Firestore | real accounts (Firebase Authentication) |

---

## Features

**Customer side**
- Home page with banner, offers and product sections
- Shop with filters (category and sub-category, color, brand, price), sorting, paging, and header search
- Product page with image gallery, color / size / quantity, details, and a review form
- Cart (kept in the browser after reload) and checkout that saves the order
- Sign up, log in, log out, My Account
- Journal (articles with category filter and search), About, Contacts (form and live map), 404 page

**Admin panel** (`/admin`, admin accounts only)
- Dashboard: welcome banner, animated stat cards with weekly trends, sales chart (7 / 14 / 30 days), orders-by-status chart, top products, low stock, latest messages
- Orders: status tabs, search, details, change status, delete
- Products: search, filter, sort, inline edit of name / price / stock, stock +/-, add, delete
- Messages: read / unread, reply by email, delete
- Journal: write, edit, publish or draft, delete
- Settings: footer social links (Facebook, LinkedIn, Instagram)

## Tech stack

| Part | Used |
|---|---|
| UI | React 18, React Router 6 |
| Build tool | Vite 5 |
| Backend | Firebase Authentication + Cloud Firestore (optional) |
| Styling | plain CSS (`src/styles/global.css`), font DM Sans |

---

## Quick start

You need **Node.js 18 or newer** (check with `node -v`).

```bash
npm install
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`). With no `.env` file the site starts in **Demo mode**.

Other commands:

| Command | What it does |
|---|---|
| `npm run dev` | start the development server |
| `npm run build` | build the production site into `dist/` |
| `npm run preview` | preview the production build |
| `npm run images` | download the Figma images into `public/images` (also runs after `npm install`) |

### Images

Product, banner and ad pictures live in `public/images/`. The code refers to them by path (for example `/images/hero.png`), so nothing needs importing.

- The Figma images are downloaded by `scripts/fetch-images.mjs`. **Figma's download links are temporary and have expired**, so a fresh install may print `FAILED`. That is harmless. Copy the `public/images` folder from a computer where the project already works.
- Files that already exist are skipped, so nothing is downloaded twice.
- The Journal illustrations are included in `public/images/journal/`.
- To replace a picture, save the new file with the same name in `public/images/`.

### Moving the project to another computer

1. Copy the project folder, **without `node_modules`**, but **with** `public/images` and the hidden `.env` file.
2. Run `npm install`, then `npm run dev`.

---

## Firebase setup (about 10 minutes)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**.
2. **Build > Authentication > Get started > Email/Password > Enable**.
3. **Build > Firestore Database > Create database** (production mode, pick a location).
4. **Project settings (gear) > Your apps > Web (`</>`)**: register an app and copy the config values.
5. Copy `.env.example` to a new file named `.env` (next to `package.json`) and paste the values, with no quotes or spaces. **Restart `npm run dev`** after saving.
6. **Firestore Database > Rules**: replace the text with the contents of `firestore.rules` and click **Publish**.
7. Open `/signup` on the site and create your own account.
8. In the Firebase console open **Firestore Database > users >** your account's document and change the field `role` from `customer` to `admin`.
9. Log out and log in again, open `/admin`, and click **Load demo data** to fill the shop (or add your own products).

If the login page no longer shows "Demo admin: ...", the site is connected to Firebase.

Whenever `firestore.rules` changes, publish it again in the console.

---

## Project structure

```
orebi-react/
├── index.html
├── package.json
├── firestore.rules          security rules for Firestore
├── .env.example             copy to .env and fill in your Firebase keys
├── scripts/fetch-images.mjs
├── public/images/           product, banner and ad images (+ journal/)
└── src/
    ├── main.jsx, App.jsx    start-up and all routes
    ├── components/          Layout (header, footer), ProductCard, Img
    ├── pages/               Home, Shop, Product, Cart, Checkout, Login, Signup, Account,
    │                        About, Contacts, Journal, JournalPost, NotFound
    ├── admin/               AdminLayout, Dashboard, AdminOrders, AdminProducts,
    │                        AdminMessages, AdminJournal, AdminSettings, ui, icons
    ├── context/             AppContext (cart and logged-in user)
    ├── services/            api, firebase, firebaseApi, mockApi, colors, categories
    └── styles/global.css
```

### How the data layer works

Pages never talk to Firebase directly. They import from `src/services/api.js`, which picks the data source:

- `firebaseApi.js` when Firebase keys are present
- `mockApi.js` (sample data in memory) when they are not

## Pages and routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | everyone |
| `/shop`, `/product/:id` | Shop, Product | everyone |
| `/cart`, `/checkout` | Cart, Checkout | everyone |
| `/about`, `/contact` | About, Contacts | everyone |
| `/journal`, `/journal/:id` | Journal, article | everyone (published only) |
| `/login`, `/signup` | Login, Sign up | everyone |
| `/account` | My Account | logged-in users |
| `/admin`, `/admin/orders`, `/admin/products`, `/admin/messages`, `/admin/journal`, `/admin/settings` | Admin panel | admin only |

## Database (Firestore collections)

| Collection | Holds | Read | Write |
|---|---|---|---|
| `products` | shop products | everyone | admin |
| `posts` | journal articles | published: everyone; all: admin | admin |
| `orders` | placed orders | admin | anyone can create (status Pending); admin manages |
| `messages` | contact form messages | admin | anyone can send; admin manages |
| `users` | profile and `role` (customer or admin) | owner and admin | own profile on sign-up; only admin changes roles |
| `settings` | footer social links (`settings/site`) | everyone | admin |

---

## Where to change things

| I want to change | Where |
|---|---|
| Product names, prices, colors, categories, descriptions, features, tags (**demo data**) | `src/services/mockApi.js`: lists `labels`, `prices`, `productColors`, `productCategories`, `descriptions`, `features`, `tags` |
| The same in **Firebase mode** | Admin > Products (name, price, stock, or add a product), or edit the document in the Firebase console. `mockApi.js` only provides the starting data for "Load demo data". |
| Color list and exact shades | `src/services/colors.js` |
| Category and sub-category names | `src/services/categories.js` |
| Brand and price-range filters | top of `src/pages/Shop.jsx` |
| Header menu, category dropdown, footer links | `MENU`, `CATS`, `HELP` at the top of `src/components/Layout.jsx` |
| Footer social links | Admin > Settings (saved in `settings/site`) |
| Footer phone, email, address | the `Footer()` function in `src/components/Layout.jsx` |
| Offices and live map on Contacts | `OFFICES` list at the top of `src/pages/Contacts.jsx` (the map follows each address) |
| Home page text and which products appear | `src/pages/Home.jsx` |
| Journal articles | Admin > Journal (demo data: `posts` in `mockApi.js`) |
| Your own Journal photo | save it in `public/images/journal/`, then type `/images/journal/your-file.jpg` in the article form |
| Demo admin login | `authApi` in `src/services/mockApi.js` |
| Look and spacing | `src/styles/global.css`: header and footer `.hd-` / `.ft-`, shop filters `.flt-`, admin `.ad-` |

A color, category or brand must be spelled **exactly** the same on the product and in its list, including capital letters, otherwise the filter will not match it.

---

## Security notes

- Access is controlled by `firestore.rules`, not only by the pages. Nobody can make themselves admin from the website; the `role` field is changed by hand in the Firebase console.
- Checkout totals are calculated in the browser, so a determined visitor could submit a wrong price. A real shop with payments should calculate totals on the server (for example with Firebase Cloud Functions).
- `.env` is listed in `.gitignore`. Firebase web keys are not secret, but keep the file out of public repositories.

## Known limitations

- No payment gateway: "Proceed to Bank" only saves the order.
- Product reviews on the product page are not saved to the database yet.
- "Add to Wish List" and "Compare" on product cards are placeholders.
- Product images come from `public/images`; uploading pictures from the admin panel is not included.

## Deploying

Run `npm run build` and upload the `dist/` folder to any static host (Firebase Hosting, Netlify, and so on). Because the site uses client-side routing, configure the host to send every address to `index.html`. Add your site's domain under **Authentication > Settings > Authorized domains** in the Firebase console.

## Troubleshooting

| Problem | Fix |
|---|---|
| Login page still shows "Demo admin" | `.env` is missing, in the wrong folder, or has a typo. Fix it and restart `npm run dev`. |
| Gray boxes instead of pictures | The images are not in `public/images`. Copy that folder from a working computer. |
| "Failed to resolve import" | A file is missing from your copy. Copy the whole `src` folder again. |
| "Permission denied" in the admin panel | Rules are not published, your `role` is not `admin`, or you need to log out and in again. |
| `/admin` redirects to login | Your account's `role` is not `admin` yet. |
| Empty shop in Firebase mode | Open `/admin` and click **Load demo data**, or add products. |
| Port 5173 is busy | Vite picks another port; use the address printed in the terminal. |

## Credits

Design based on the **Orebi Minimal eCommerce Figma Template** by Adveits. Journal illustrations are original.
