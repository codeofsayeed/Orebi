/**
 * Firebase version of the data layer (same function names as mockApi.js).
 * Collections: products, orders, messages, posts, users.
 */
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from './firebase.js'
import { SEED } from './mockApi.js'

const col = (name) => collection(db, name)
const today = () => new Date().toISOString().slice(0, 10)
const withId = (d) => ({ id: d.id, ...d.data() })
const stripId = ({ id, ...rest }) => rest

const DB_MESSAGES = {
  'permission-denied': 'Permission denied. Log in as an admin and make sure the Firestore rules are published.',
  unavailable: 'Cannot reach Firebase. Check your internet connection.',
  'failed-precondition': 'Firestore is not set up yet. Create the database in the Firebase console.',
}
// Log the error, show it as a red notice in the dashboard, and stop the calling code.
const fail = (e) => {
  const msg = DB_MESSAGES[e?.code] || e?.message || 'Something went wrong with the database.'
  console.error('[firebase]', e)
  window.dispatchEvent(new CustomEvent('orebi-error', { detail: msg }))
  throw new Error(msg)
}
const run = async (fn) => { try { return await fn() } catch (e) { return fail(e) } }

export const productsApi = {
  list: () => run(async () => (await getDocs(col('products'))).docs.map(withId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))),
  get: (id) => run(async () => { const s = await getDoc(doc(db, 'products', id)); return s.exists() ? withId(s) : null }),
  create: (p) => run(async () => {
    const data = { tag: '', image: '', gallery: [], features: [], description: '', oldPrice: null, ...stripId(p), order: -Date.now() }
    const ref = await addDoc(col('products'), data)
    return { id: ref.id, ...data }
  }),
  update: (id, patch) => run(async () => { await updateDoc(doc(db, 'products', id), stripId(patch)); return true }),
  remove: (id) => run(async () => { await deleteDoc(doc(db, 'products', id)); return true }),
}

export const ordersApi = {
  list: () => run(async () => (await getDocs(col('orders'))).docs.map(withId).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))),
  create: async (o) => { // used by Checkout (guests allowed); errors are handled by the page
    try {
      const id = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`
      const data = { ...stripId(o), status: 'Pending', date: today(), createdAt: Date.now(), uid: auth.currentUser?.uid || null }
      await setDoc(doc(db, 'orders', id), data)
      return { id, ...data }
    } catch (e) { console.error('[firebase]', e); throw new Error('Could not place the order.') }
  },
  update: (id, patch) => run(async () => { await updateDoc(doc(db, 'orders', id), stripId(patch)); return true }),
  remove: (id) => run(async () => { await deleteDoc(doc(db, 'orders', id)); return true }),
}

export const messagesApi = {
  list: () => run(async () => (await getDocs(col('messages'))).docs.map(withId).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))),
  create: async (m) => { // used by the Contacts form (public); errors are handled by the page
    try { await addDoc(col('messages'), { ...stripId(m), read: false, date: today(), createdAt: Date.now() }); return true } catch (e) { console.error('[firebase]', e); throw new Error('Could not send the message.') }
  },
  update: (id, patch) => run(async () => { await updateDoc(doc(db, 'messages', id), stripId(patch)); return true }),
  remove: (id) => run(async () => { await deleteDoc(doc(db, 'messages', id)); return true }),
}

export const postsApi = {
  // list({ published: true }) is what the public Journal uses (visitors can only read published posts)
  list: (opts) => run(async () => {
    const q = opts?.published ? query(col('posts'), where('published', '==', true)) : col('posts')
    return (await getDocs(q)).docs.map(withId).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  }),
  get: async (id) => {
    try { const s = await getDoc(doc(db, 'posts', id)); return s.exists() ? withId(s) : null } catch (e) { if (e.code === 'permission-denied') return null; return fail(e) }
  },
  create: (p) => run(async () => { const data = { published: true, date: today(), ...stripId(p) }; const ref = await addDoc(col('posts'), data); return { id: ref.id, ...data } }),
  update: (id, patch) => run(async () => { await updateDoc(doc(db, 'posts', id), stripId(patch)); return true }),
  remove: (id) => run(async () => { await deleteDoc(doc(db, 'posts', id)); return true }),
}

const AUTH_MESSAGES = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/user-not-found': 'Wrong email or password.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/invalid-email': 'That email address is not valid.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Cannot reach Firebase. Check your internet connection.',
  'auth/operation-not-allowed': 'Email/password sign-in is not switched on in the Firebase console.',
}
const authError = (e) => new Error(AUTH_MESSAGES[e?.code] || e?.message || 'Sign-in failed.')

// Name and role come from the `users/{uid}` document. Role "admin" is set by you in the Firebase console.
const profile = async (u) => {
  let d = {}
  try { const s = await getDoc(doc(db, 'users', u.uid)); if (s.exists()) d = s.data() } catch (e) { console.error('[firebase]', e) }
  return { uid: u.uid, email: u.email, name: d.name || u.displayName || (u.email || '').split('@')[0], role: d.role === 'admin' ? 'admin' : 'customer' }
}

export const authApi = {
  live: true,
  login: async (email, password) => {
    if (!email || !password) throw new Error('Enter email and password')
    try { const c = await signInWithEmailAndPassword(auth, email.trim(), password); return await profile(c.user) } catch (e) { throw authError(e) }
  },
  signup: async (data) => {
    if (!data.email || !data.password) throw new Error('Email and password are required')
    if (data.password !== data.repeat) throw new Error('Passwords do not match')
    try {
      const c = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password)
      const { password, repeat, agree, ...rest } = data
      const name = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email.split('@')[0]
      await setDoc(doc(db, 'users', c.user.uid), { ...rest, email: data.email.trim(), name, role: 'customer' })
      return { uid: c.user.uid, email: c.user.email, name, role: 'customer' }
    } catch (e) { throw authError(e) }
  },
  logout: () => signOut(auth),
  onChange: (cb) => onAuthStateChanged(auth, async (u) => cb(u ? await profile(u) : null)),
}

// Fills an empty database with the demo products, orders, messages and articles (admin only).
export const seedApi = {
  run: () => run(async () => {
    const batch = writeBatch(db)
    SEED.products.forEach((p, i) => batch.set(doc(db, 'products', p.id), { ...stripId(p), order: i }))
    SEED.orders.forEach((o) => batch.set(doc(db, 'orders', o.id), { ...stripId(o), createdAt: new Date(o.date).getTime() }))
    SEED.messages.forEach((m) => batch.set(doc(db, 'messages', m.id), { ...stripId(m), createdAt: new Date(m.date).getTime() }))
    SEED.posts.forEach((p) => batch.set(doc(db, 'posts', p.id), stripId(p)))
    await batch.commit()
    return true
  }),
}
