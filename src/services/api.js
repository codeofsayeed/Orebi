/**
 * DATA LAYER. Pages only talk to these functions, never to storage directly.
 * Today: in-memory mock data. Later: replace each function body with Firebase
 * (Firestore equivalent noted beside each one) and nothing else changes.
 *
 * Firebase later:  npm i firebase -> src/services/firebase.js with
 *   initializeApp(config); export const db = getFirestore(); export const auth = getAuth()
 */
const img = (n) => `/images/${n}.png`;
const names = [
  "bowl",
  "headphones",
  "table",
  "cap",
  "clock",
  "backpack",
  "sunglasses",
  "basket",
  "desk-clock",
  "product-31",
  "product-16",
  "product-19",
  "product-12",
  "product-27",
];
const jimg = (n) => `/images/journal/journal-${n}.svg`;
export const IMAGE_OPTIONS = names.map((n) => ({ label: n, value: img(n) }));
// Journal picker: real photos first, then the drawn illustrations (public/images/journal)
export const JOURNAL_IMAGES = [
  ...IMAGE_OPTIONS.map((o) => ({ label: `photo: ${o.label}`, value: o.value })),
  ...[
    "home",
    "clock",
    "headphones",
    "backpack",
    "sunglasses",
    "table",
    "cap",
  ].map((n) => ({ label: `illustration: ${n}`, value: jimg(n) })),
];
export const STATUSES = [
  "Pending",
  "Paid",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const labels = {
  bowl: "Marble Mortar & Pestle",
  headphones: "Wireless Headphones",
  table: "Round Side Table",
  cap: "Classic Baseball Cap",
  clock: "Analog Clock",
  backpack: "Black Travel Backpack",
  sunglasses: "Classic Sunglasses",
  basket: "Woven Storage Basket",
  "desk-clock": "Black Desk Alarm Clock",
  "product-31": "Leaf Plush Toy",
  "product-16": "Striped Basket Set",
  "product-19": "Black Smart Watch",
  "product-12": "Grey Canvas Backpack",
  "product-27": "Patterned Ceramic Vase",
};
const prices = {
  bowl: 36,
  headphones: 59,
  table: 44,
  cap: 14.5,
  clock: 27,
  backpack: 64,
  sunglasses: 19,
  basket: 22.5,
  "desk-clock": 44,
  "product-31": 9.5,
  "product-16": 39,
  "product-19": 44,
  "product-12": 49,
  "product-27": 29,
};
const tags = {
  0: "New",
  1: "-10%",
  4: "New",
  6: "-10%",
  7: "-15%",
  9: "New",
  11: "-10%",
};
// Real colour of each product, taken from its picture. Names must exist in src/services/colors.js
const productColors = {
  bowl: "Gray",
  headphones: "Burgundy",
  table: "Brown",
  cap: "Gray",
  clock: "Gray",
  backpack: "Black",
  sunglasses: "Black",
  basket: "Beige",
  "desk-clock": "Black",
  "product-31": "Gray",
  "product-16": "Brown",
  "product-19": "Black",
  "product-12": "Gray",
  "product-27": "White",
};
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const wait = (v) => new Promise((r) => setTimeout(() => r(v), 60));

let products = names.map((n, i) => ({
  id: String(i + 1),
  name: labels[n], // rename in the dashboard or here
  price: prices[n],
  oldPrice: /%/.test(tags[i] || "")
    ? Math.round(prices[n] / (1 - parseInt(tags[i].replace("-", ""), 10) / 100))
    : null,
  color: productColors[n],
  brand: `Brand ${(i % 5) + 1}`,
  category: `Category ${(i % 5) + 1}`,
  sub: i % 2 ? "Type B" : "Type A",
  tag: tags[i] || "",
  stock: 20 + i,
  image: img(n),
  gallery: [0, 1, 2, 3].map((k) => img(names[(i + k) % names.length])),
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.",
}));

const seedOrders = [
  ["John Ford", 2, "Delivered", 12],
  ["Mia Chen", 3, "Delivered", 10],
  ["Sam Roy", 1, "Shipped", 8],
  ["Lena Park", 4, "Paid", 7],
  ["Omar Haq", 2, "Delivered", 6],
  ["Ava Stone", 5, "Shipped", 5],
  ["Noah Lee", 1, "Cancelled", 4],
  ["Zoe Khan", 3, "Paid", 3],
  ["Ravi Das", 2, "Pending", 2],
  ["Ella Fox", 6, "Paid", 1],
  ["Kim Ali", 1, "Pending", 0],
];
let orders = seedOrders.map(([customer, q, status, d], i) => ({
  id: `ORD-${1001 + i}`,
  customer,
  status,
  date: day(d),
  total: q * products[i % names.length].price,
  payment: i % 2 ? "Bank 2" : "Bank",
  items: [
    {
      id: String((i % names.length) + 1),
      name: products[i % names.length].name,
      qty: q,
      price: products[i % names.length].price,
    },
  ],
}));
let seq = 1001 + orders.length;

let messages = [
  {
    id: "m1",
    date: day(1),
    name: "Mia Chen",
    email: "mia@example.com",
    message: "Do you ship to Canada, and how long does it take?",
    read: false,
  },
  {
    id: "m2",
    date: day(3),
    name: "Sam Roy",
    email: "sam@example.com",
    message: "Can I change the size on my order before it ships?",
    read: true,
  },
];

const body = (a) => a.join("\n\n");
let posts = [
  {
    id: "p1",
    title: "How to style a minimal home in five easy steps",
    category: "Home",
    date: day(2),
    image: img("basket"),
    published: true,
    excerpt:
      "Neutral tones, honest materials and a few well-chosen pieces are all it takes to make a space feel calm.",
    body: body([
      "Minimal does not mean empty. It means every object in the room has a reason to be there.",
      "Start with a neutral base: warm whites, soft greys and natural wood. Then add texture with woven baskets, linen and matte ceramics.",
      "Finish with one statement piece, such as a clock or a lamp, and leave the surfaces around it clear.",
    ]),
  },
  {
    id: "p2",
    title: "The desk clock that keeps your mornings on time",
    category: "Guides",
    date: day(5),
    image: img("desk-clock"),
    published: true,
    excerpt:
      "A small, quiet clock can change how you start the day. Here is what to look for before you buy.",
    body: body([
      "A good desk clock is quiet, easy to read and built to last.",
      "Look for a matte finish that will not reflect light, a movement that does not tick, and a shape that fits your desk.",
      "Place it at eye level, a little to the side, so you can check the time without breaking focus.",
    ]),
  },
  {
    id: "p3",
    title: "Headphones worth the hype: what to listen for",
    category: "Tech",
    date: day(9),
    image: img("headphones"),
    published: true,
    excerpt:
      "Comfort, battery life and sound balance matter more than the spec sheet suggests.",
    body: body([
      "Spec sheets rarely tell you how headphones feel after three hours.",
      "Try them with music you know well. Listen for clear vocals, controlled bass and a soundstage that does not feel cramped.",
      "Check the battery claims against real reviews, and make sure the ear cups fit your head comfortably.",
    ]),
  },
  {
    id: "p4",
    title: "Everyday carry: choosing a backpack that lasts",
    category: "Style",
    date: day(14),
    image: img("backpack"),
    published: true,
    excerpt:
      "Straps, zips and stitching tell you more about a backpack than its logo ever will.",
    body: body([
      "A backpack takes a beating every day, so the details matter.",
      "Check the zips first, then the stitching at the strap joins. Padded straps and a ventilated back panel make a big difference.",
      "Pick a size that fits your daily load, not your once-a-year trip.",
    ]),
  },
  {
    id: "p5",
    title: "Sunglasses 101: frames for every face shape",
    category: "Style",
    date: day(20),
    image: img("sunglasses"),
    published: true,
    excerpt:
      "The right frame balances your features. A quick guide to finding yours.",
    body: body([
      "Round faces suit angular frames, while angular faces look best in softer, rounder shapes.",
      "Make sure the frame is not wider than your face and that the lenses cover your eyebrows.",
      "UV400 protection matters more than the tint colour.",
    ]),
  },
  {
    id: "p6",
    title: "Small table, big impact: styling a side table",
    category: "Home",
    date: day(27),
    image: img("table"),
    published: true,
    excerpt:
      "A side table is the easiest place to show some personality. Keep it simple.",
    body: body([
      "A side table works best with three things: something tall, something low and something living.",
      "A lamp, a small bowl and a plant are a classic combination.",
      "Leave some space. Empty surface is part of the design.",
    ]),
  },
  {
    id: "p7",
    title: "Winter caps that actually keep you warm",
    category: "Guides",
    date: day(33),
    image: img("cap"),
    published: false,
    excerpt: "Draft: material guide for cold-weather caps.",
    body: "Draft in progress.",
  },
];

export const productsApi = {
  list: () => wait([...products]), // getDocs(collection(db, 'products'))
  get: (id) => wait(products.find((p) => p.id === id) || null), // getDoc(doc(db, 'products', id))
  create: (p) => {
    // addDoc(collection(db, 'products'), p)
    const item = {
      tag: "",
      image: "",
      gallery: [],
      description: "",
      oldPrice: null,
      ...p,
      id: String(Date.now()),
    };
    products = [item, ...products];
    return wait(item);
  },
  update: (id, patch) => {
    products = products.map((p) => (p.id === id ? { ...p, ...patch } : p));
    return wait(true);
  }, // updateDoc
  remove: (id) => {
    products = products.filter((p) => p.id !== id);
    return wait(true);
  }, // deleteDoc
};

export const ordersApi = {
  list: () => wait([...orders]), // getDocs(query(collection(db, 'orders'), orderBy('date', 'desc')))
  create: (o) => {
    // addDoc(collection(db, 'orders'), o)
    const item = { id: `ORD-${seq++}`, status: "Pending", date: day(0), ...o };
    orders = [item, ...orders];
    return wait(item);
  },
  update: (id, patch) => {
    orders = orders.map((o) => (o.id === id ? { ...o, ...patch } : o));
    return wait(true);
  }, // updateDoc
  remove: (id) => {
    orders = orders.filter((o) => o.id !== id);
    return wait(true);
  }, // deleteDoc
};

export const messagesApi = {
  list: () => wait([...messages]), // getDocs(collection(db, 'messages'))
  create: (m) => {
    messages = [
      { id: String(Date.now()), date: day(0), read: false, ...m },
      ...messages,
    ];
    return wait(true);
  },
  update: (id, patch) => {
    messages = messages.map((m) => (m.id === id ? { ...m, ...patch } : m));
    return wait(true);
  },
  remove: (id) => {
    messages = messages.filter((m) => m.id !== id);
    return wait(true);
  },
};

export const postsApi = {
  list: () => wait([...posts].sort((a, b) => b.date.localeCompare(a.date))), // getDocs(query(collection(db, 'posts'), orderBy('date', 'desc')))
  get: (id) => wait(posts.find((p) => p.id === id) || null), // getDoc(doc(db, 'posts', id))
  create: (p) => {
    const item = { published: true, date: day(0), ...p, id: `p${Date.now()}` };
    posts = [item, ...posts];
    return wait(item);
  }, // addDoc
  update: (id, patch) => {
    posts = posts.map((p) => (p.id === id ? { ...p, ...patch } : p));
    return wait(true);
  }, // updateDoc
  remove: (id) => {
    posts = posts.filter((p) => p.id !== id);
    return wait(true);
  }, // deleteDoc
};

/** MOCK auth. Demo admin: admin@orebi.com / admin123.
 *  Firebase Auth later: signInWithEmailAndPassword / createUserWithEmailAndPassword,
 *  then store `role` in a `users/{uid}` document (or a custom claim) to protect /admin. */
export const authApi = {
  login: (email, password) => {
    if (email === "admin@orebi.com" && password === "admin123")
      return wait({ email, name: "admin", role: "admin" });
    if (email && password)
      return wait({ email, name: email.split("@")[0], role: "customer" });
    return Promise.reject(new Error("Enter email and password"));
  },
  signup: (data) => {
    if (!data.email || !data.password)
      return Promise.reject(new Error("Email and password are required"));
    if (data.password !== data.repeat)
      return Promise.reject(new Error("Passwords do not match"));
    return wait({
      email: data.email,
      name: data.firstName || data.email.split("@")[0],
      role: "customer",
    });
  },
};
