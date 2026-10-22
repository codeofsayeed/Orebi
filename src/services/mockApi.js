/**
 * DATA LAYER. Pages only talk to these functions, never to storage directly.
 * Today: in-memory mock data. Later: replace each function body with Firebase
 * (Firestore equivalent noted beside each one) and nothing else changes.
 *
 * Firebase later:  npm i firebase -> src/services/firebase.js with
 *   initializeApp(config); export const db = getFirestore(); export const auth = getAuth()
 */
const img = (n) => `/images/${n}.png`
const names = ['bowl', 'headphones', 'table', 'cap', 'clock', 'backpack', 'sunglasses', 'basket', 'desk-clock', 'product-31', 'product-16', 'product-19', 'product-12', 'product-27']
const jimg = (n) => `/images/journal/journal-${n}.svg`
export const IMAGE_OPTIONS = names.map((n) => ({ label: n, value: img(n) }))
// Journal picker: real photos first, then the drawn illustrations (public/images/journal)
export const JOURNAL_IMAGES = [
  ...IMAGE_OPTIONS.map((o) => ({ label: `photo: ${o.label}`, value: o.value })),
  ...['home', 'clock', 'headphones', 'backpack', 'sunglasses', 'table', 'cap'].map((n) => ({ label: `illustration: ${n}`, value: jimg(n) })),
]
export const STATUSES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled']
const labels = {
  bowl: 'Marble Mortar & Pestle', headphones: 'Wireless Headphones', table: 'Round Side Table', cap: 'Classic Baseball Cap',
  clock: 'Analog Clock', backpack: 'Black Travel Backpack', sunglasses: 'Classic Sunglasses', basket: 'Woven Storage Basket',
  'desk-clock': 'Black Desk Alarm Clock', 'product-31': 'Leaf Plush Toy', 'product-16': 'Striped Basket Set',
  'product-19': 'Black Smart Watch', 'product-12': 'Grey Canvas Backpack', 'product-27': 'Patterned Ceramic Vase',
}
const prices = { bowl: 36, headphones: 59, table: 44, cap: 14.5, clock: 27, backpack: 64, sunglasses: 19, basket: 22.5, 'desk-clock': 44, 'product-31': 9.5, 'product-16': 39, 'product-19': 44, 'product-12': 49, 'product-27': 29 }
// Product text. Keys match the image names in `names`. Edit freely.
const descriptions = {
  bowl: 'A solid marble mortar and pestle for grinding spices, herbs and pastes by hand. The heavy stone base stays steady on the counter, and the polished gray finish looks good left out in the kitchen.',
  headphones: 'Over-ear wireless headphones in a deep burgundy finish. Soft padded ear cups and an adjustable headband keep them comfortable through long listening sessions.',
  table: 'A round side table with a white top and a warm brown base. Compact enough for a small corner, it holds a lamp, a book or your morning coffee.',
  cap: 'A classic baseball cap with a gray crown and a black curved brim. Lightweight and easy to wear, it works for everyday errands, sport or sunny days out.',
  clock: 'A simple analog clock with a clean gray face and easy-to-read hands. A quiet, minimal piece that suits a living room, kitchen or office wall.',
  backpack: 'A black travel backpack with several pockets to keep your things organized. Padded shoulder straps make it comfortable to carry on commutes, trips and days out.',
  sunglasses: 'Classic black sunglasses with a timeless frame that suits most face shapes. Dark lenses cut glare on bright days, whether you are driving, walking or traveling.',
  basket: 'A woven storage basket in a light beige finish. Use it for laundry, blankets, toys, or as a tidy bin in any room of the house.',
  'desk-clock': 'A compact black alarm clock for your desk or bedside table. Clear to read at a glance, with a clean, modern shape that does not take up much space.',
  'product-31': 'A soft gray plush toy holding a green leaf. Gentle to hold and fun to display, it makes a thoughtful gift for children and collectors alike.',
  'product-16': 'A set of striped storage baskets in brown and black. Stack or nest them to organize shelves, bathrooms and closets, and keep small items out of sight.',
  'product-19': 'A black smart watch with a slim, comfortable band. Check the time and keep up with your day without reaching for your phone.',
  'product-12': 'A gray canvas backpack with sturdy straps and a roomy main compartment. A comfortable everyday bag for school, work or weekend trips.',
  'product-27': 'A white ceramic vase with a bold black pattern. It looks great with fresh flowers, or on its own as a decorative piece on a shelf or table.',
}
const features = {
  bowl: ['Material: natural marble', 'Color: Gray', 'Heavy base that stays in place', 'Hand wash, then dry before storing'],
  headphones: ['Wireless, over-ear design', 'Padded ear cups and adjustable headband', 'Color: Burgundy', 'Includes charging cable'],
  table: ['Round top with a compact footprint', 'Color: Brown base, white top', 'Fits beside a sofa or bed', 'Wipe clean with a damp cloth'],
  cap: ['Curved brim', 'Color: Gray crown, black brim', 'Lightweight and breathable', 'Spot clean only'],
  clock: ['Analog display with clear hands', 'Color: Gray', 'Quiet, minimal design', 'Runs on a standard AA battery'],
  backpack: ['Multiple pockets for organizing', 'Padded shoulder straps', 'Color: Black', 'Suits commutes and short trips'],
  sunglasses: ['Classic frame, suits most faces', 'Dark lenses reduce glare', 'Color: Black', 'Wipe lenses with a soft cloth'],
  basket: ['Woven finish', 'Color: Beige', 'Good for laundry, blankets or toys', 'Wipe clean with a dry cloth'],
  'desk-clock': ['Alarm clock for desk or bedside', 'Color: Black', 'Compact, space-saving shape', 'Easy-to-read display'],
  'product-31': ['Soft plush filling', 'Color: Gray with a green leaf', 'A good gift idea', 'Spot clean gently'],
  'product-16': ['Set of striped baskets', 'Color: Brown and black', 'Stack or nest to save space', 'Wipe clean with a dry cloth'],
  'product-19': ['Slim, comfortable band', 'Color: Black', 'Shows the time at a glance', 'Charge before first use'],
  'product-12': ['Roomy main compartment', 'Sturdy shoulder straps', 'Color: Gray canvas', 'Spot clean only'],
  'product-27': ['Material: ceramic', 'Color: White with a black pattern', 'Holds fresh or dried flowers', 'Hand wash recommended'],
}
// Category and sub-category of each product (names must exist in src/services/categories.js; '' = no sub-category)
const productCategories = {
  bowl: ['Home & Living', 'Kitchen'], headphones: ['Electronics', 'Audio'], table: ['Furniture', ''], cap: ['Accessories', ''],
  clock: ['Home & Living', 'Decor'], backpack: ['Bags', ''], sunglasses: ['Accessories', ''], basket: ['Home & Living', 'Storage'],
  'desk-clock': ['Electronics', 'Watches & Clocks'], 'product-31': ['Home & Living', 'Decor'], 'product-16': ['Home & Living', 'Storage'],
  'product-19': ['Electronics', 'Watches & Clocks'], 'product-12': ['Bags', ''], 'product-27': ['Home & Living', 'Decor'],
}
const tags = { 0: 'New', 1: '-10%', 4: 'New', 6: '-10%', 7: '-15%', 9: 'New', 11: '-10%' }
// Real colour of each product, taken from its picture. Names must exist in src/services/colors.js
const productColors = {
  bowl: 'Gray', headphones: 'Burgundy', table: 'Brown', cap: 'Gray',
  clock: 'Gray', backpack: 'Black', sunglasses: 'Black', basket: 'Beige',
  'desk-clock': 'Black', 'product-31': 'Gray', 'product-16': 'Brown',
  'product-19': 'Black', 'product-12': 'Gray', 'product-27': 'White',
}
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10)
const wait = (v) => new Promise((r) => setTimeout(() => r(v), 60))

let products = names.map((n, i) => ({
  id: String(i + 1),
  name: labels[n], // rename in the dashboard or here
  price: prices[n],
  oldPrice: /%/.test(tags[i] || '') ? Math.round(prices[n] / (1 - parseInt(tags[i].replace('-', ''), 10) / 100)) : null,
  color: productColors[n],
  brand: `Brand ${(i % 5) + 1}`,
  category: productCategories[n][0],
  sub: productCategories[n][1],
  tag: tags[i] || '',
  stock: 20 + i,
  image: img(n),
  gallery: [0, 1, 2, 3].map((k) => img(names[(i + k) % names.length])),
  description: descriptions[n],
  features: features[n],
}))

const seedOrders = [['John Ford', 2, 'Delivered', 12], ['Mia Chen', 3, 'Delivered', 10], ['Sam Roy', 1, 'Shipped', 8], ['Lena Park', 4, 'Paid', 7], ['Omar Haq', 2, 'Delivered', 6], ['Ava Stone', 5, 'Shipped', 5], ['Noah Lee', 1, 'Cancelled', 4], ['Zoe Khan', 3, 'Paid', 3], ['Ravi Das', 2, 'Pending', 2], ['Ella Fox', 6, 'Paid', 1], ['Kim Ali', 1, 'Pending', 0]]
let orders = seedOrders.map(([customer, q, status, d], i) => ({
  id: `ORD-${1001 + i}`, customer, status, date: day(d), total: q * products[i % names.length].price, payment: i % 2 ? 'Bank 2' : 'Bank',
  items: [{ id: String((i % names.length) + 1), name: products[i % names.length].name, qty: q, price: products[i % names.length].price }],
}))
let seq = 1001 + orders.length

let messages = [
  { id: 'm1', date: day(1), name: 'Mia Chen', email: 'mia@example.com', message: 'Do you ship to Canada, and how long does it take?', read: false },
  { id: 'm2', date: day(3), name: 'Sam Roy', email: 'sam@example.com', message: 'Can I change the size on my order before it ships?', read: true },
]

const body = (a) => a.join('\n\n')
let posts = [
  { id: 'p1', title: 'How to style a minimal home in five easy steps', category: 'Home', date: day(2), image: img('basket'), published: true,
    excerpt: 'Neutral tones, honest materials and a few well-chosen pieces are all it takes to make a space feel calm.',
    body: body(['Minimal does not mean empty. It means every object in the room has a reason to be there.', 'Start with a neutral base: warm whites, soft greys and natural wood. Then add texture with woven baskets, linen and matte ceramics.', 'Finish with one statement piece, such as a clock or a lamp, and leave the surfaces around it clear.']) },
  { id: 'p2', title: 'The desk clock that keeps your mornings on time', category: 'Guides', date: day(5), image: img('desk-clock'), published: true,
    excerpt: 'A small, quiet clock can change how you start the day. Here is what to look for before you buy.',
    body: body(['A good desk clock is quiet, easy to read and built to last.', 'Look for a matte finish that will not reflect light, a movement that does not tick, and a shape that fits your desk.', 'Place it at eye level, a little to the side, so you can check the time without breaking focus.']) },
  { id: 'p3', title: 'Headphones worth the hype: what to listen for', category: 'Tech', date: day(9), image: img('headphones'), published: true,
    excerpt: 'Comfort, battery life and sound balance matter more than the spec sheet suggests.',
    body: body(['Spec sheets rarely tell you how headphones feel after three hours.', 'Try them with music you know well. Listen for clear vocals, controlled bass and a soundstage that does not feel cramped.', 'Check the battery claims against real reviews, and make sure the ear cups fit your head comfortably.']) },
  { id: 'p4', title: 'Everyday carry: choosing a backpack that lasts', category: 'Style', date: day(14), image: img('backpack'), published: true,
    excerpt: 'Straps, zips and stitching tell you more about a backpack than its logo ever will.',
    body: body(['A backpack takes a beating every day, so the details matter.', 'Check the zips first, then the stitching at the strap joins. Padded straps and a ventilated back panel make a big difference.', 'Pick a size that fits your daily load, not your once-a-year trip.']) },
  { id: 'p5', title: 'Sunglasses 101: frames for every face shape', category: 'Style', date: day(20), image: img('sunglasses'), published: true,
    excerpt: 'The right frame balances your features. A quick guide to finding yours.',
    body: body(['Round faces suit angular frames, while angular faces look best in softer, rounder shapes.', 'Make sure the frame is not wider than your face and that the lenses cover your eyebrows.', 'UV400 protection matters more than the tint colour.']) },
  { id: 'p6', title: 'Small table, big impact: styling a side table', category: 'Home', date: day(27), image: img('table'), published: true,
    excerpt: 'A side table is the easiest place to show some personality. Keep it simple.',
    body: body(['A side table works best with three things: something tall, something low and something living.', 'A lamp, a small bowl and a plant are a classic combination.', 'Leave some space. Empty surface is part of the design.']) },
  { id: 'p7', title: 'Winter caps that actually keep you warm', category: 'Guides', date: day(33), image: img('cap'), published: false,
    excerpt: 'Draft: material guide for cold-weather caps.', body: 'Draft in progress.' },
]

// untouched copy of the starting data (used to fill Firebase the first time)
export const SEED = JSON.parse(JSON.stringify({ products, orders, messages, posts }))

export const productsApi = {
  list: () => wait([...products]), // getDocs(collection(db, 'products'))
  get: (id) => wait(products.find((p) => p.id === id) || null), // getDoc(doc(db, 'products', id))
  create: (p) => { // addDoc(collection(db, 'products'), p)
    const item = { tag: '', image: '', gallery: [], description: '', features: [], oldPrice: null, ...p, id: String(Date.now()) }
    products = [item, ...products]
    return wait(item)
  },
  update: (id, patch) => { products = products.map((p) => (p.id === id ? { ...p, ...patch } : p)); return wait(true) }, // updateDoc
  remove: (id) => { products = products.filter((p) => p.id !== id); return wait(true) }, // deleteDoc
}

export const ordersApi = {
  list: () => wait([...orders]), // getDocs(query(collection(db, 'orders'), orderBy('date', 'desc')))
  create: (o) => { // addDoc(collection(db, 'orders'), o)
    const item = { id: `ORD-${seq++}`, status: 'Pending', date: day(0), ...o }
    orders = [item, ...orders]
    return wait(item)
  },
  update: (id, patch) => { orders = orders.map((o) => (o.id === id ? { ...o, ...patch } : o)); return wait(true) }, // updateDoc
  remove: (id) => { orders = orders.filter((o) => o.id !== id); return wait(true) }, // deleteDoc
}

export const messagesApi = {
  list: () => wait([...messages]), // getDocs(collection(db, 'messages'))
  create: (m) => { messages = [{ id: String(Date.now()), date: day(0), read: false, ...m }, ...messages]; return wait(true) },
  update: (id, patch) => { messages = messages.map((m) => (m.id === id ? { ...m, ...patch } : m)); return wait(true) },
  remove: (id) => { messages = messages.filter((m) => m.id !== id); return wait(true) },
}

export const postsApi = {
  list: (opts) => wait([...posts].filter((p) => !opts?.published || p.published).sort((a, b) => b.date.localeCompare(a.date))), // getDocs(query(collection(db, 'posts'), orderBy('date', 'desc')))
  get: (id) => wait(posts.find((p) => p.id === id) || null), // getDoc(doc(db, 'posts', id))
  create: (p) => { const item = { published: true, date: day(0), ...p, id: `p${Date.now()}` }; posts = [item, ...posts]; return wait(item) }, // addDoc
  update: (id, patch) => { posts = posts.map((p) => (p.id === id ? { ...p, ...patch } : p)); return wait(true) }, // updateDoc
  remove: (id) => { posts = posts.filter((p) => p.id !== id); return wait(true) }, // deleteDoc
}

/** MOCK auth. Demo admin: admin@orebi.com / admin123.
 *  Firebase Auth later: signInWithEmailAndPassword / createUserWithEmailAndPassword,
 *  then store `role` in a `users/{uid}` document (or a custom claim) to protect /admin. */
export const authApi = {
  live: false,
  logout: async () => {},
  login: (email, password) => {
    if (email === 'admin@orebi.com' && password === 'admin123') return wait({ email, name: 'admin', role: 'admin' })
    if (email && password) return wait({ email, name: email.split('@')[0], role: 'customer' })
    return Promise.reject(new Error('Enter email and password'))
  },
  signup: (data) => {
    if (!data.email || !data.password) return Promise.reject(new Error('Email and password are required'))
    if (data.password !== data.repeat) return Promise.reject(new Error('Passwords do not match'))
    return wait({ email: data.email, name: data.firstName || data.email.split('@')[0], role: 'customer' })
  },
}

export const seedApi = { run: async () => {} }
