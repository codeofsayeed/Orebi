/**
 * The ONE place the pages import data from.
 * Firebase keys in .env  ->  real Firebase (firebaseApi.js)
 * No keys                ->  built-in demo data (mockApi.js, resets on reload)
 */
import * as mock from './mockApi.js'
import * as fb from './firebaseApi.js'
import { firebaseEnabled } from './firebase.js'

const impl = firebaseEnabled ? fb : mock

export const backend = firebaseEnabled ? 'firebase' : 'demo'
export const { IMAGE_OPTIONS, JOURNAL_IMAGES, STATUSES } = mock
export const productsApi = impl.productsApi
export const ordersApi = impl.ordersApi
export const messagesApi = impl.messagesApi
export const postsApi = impl.postsApi
export const authApi = impl.authApi
export const seedApi = impl.seedApi
