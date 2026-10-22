import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Values come from the .env file (see .env.example). Restart `npm run dev` after editing .env.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// No keys in .env = the site runs on built-in demo data (nothing is saved).
export const firebaseEnabled = Boolean(config.apiKey && config.projectId)
const app = firebaseEnabled ? initializeApp(config) : null
export const db = app ? initializeFirestore(app, { ignoreUndefinedProperties: true }) : null
export const auth = app ? getAuth(app) : null
