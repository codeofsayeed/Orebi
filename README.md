# Orebi (React + Vite)

    npm install         # also downloads the Figma images into public/images automatically
    npm run dev

Demo admin login: `admin@orebi.com` / `admin123` -> opens /admin (Dashboard, Products).

## Adding Firebase later

All data goes through `src/services/api.js` (products, orders, auth). Each function has its
Firestore / Firebase Auth equivalent in a comment. Install `firebase`, create
`src/services/firebase.js`, then replace the function bodies. Pages and components don't change.

## Images

Journal artwork is included (public/images/journal, original SVG illustrations).
`npm run images` downloads every image from the Figma file. Figma's temporary links expire 7 days after
they were generated (about Oct 21, 2026); after that, ask Claude to refresh them. Until the images are
downloaded the site still works and shows gray boxes.

## Pages

Home, Shop, Product (gallery, reviews), About, Contacts (form, map), Login, Sign up, My Account,
Cart, Checkout, 404, Journal (list, filters, article pages), and /admin.

## Admin (/admin)

Dashboard (clickable stats, sales chart, status breakdown, low stock), Orders (status tabs, search, details,
status changes), Products (search, filter, sort, inline edit, stock +/-, add), Messages, Journal (write and publish).
Journal and the dashboard are designed to match the Figma style; the Figma file has no Journal page.
