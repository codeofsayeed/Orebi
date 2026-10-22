import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api.js'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

export function AppProvider({ children }) {
  const live = authApi.live // true when Firebase is connected
  const [cart, setCart] = useState(() => load('cart', [])) // [{ product, qty }]
  const [user, setUser] = useState(() => (live ? null : load('user', null)))
  const [authReady, setAuthReady] = useState(!live) // Firebase needs a moment to restore the login on page load

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart])
  useEffect(() => { if (!live) localStorage.setItem('user', JSON.stringify(user)) }, [user, live])
  useEffect(() => {
    if (!live) return undefined
    return authApi.onChange((u) => { setUser(u); setAuthReady(true) })
  }, [live])

  const addToCart = (product, qty = 1) =>
    setCart((c) => {
      const found = c.find((i) => i.product.id === product.id)
      return found
        ? c.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i))
        : [...c, { product, qty }]
    })
  const setQty = (id, qty) =>
    setCart((c) => c.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.product.id !== id))
  const clearCart = () => setCart([])
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const count = cart.reduce((s, i) => s + i.qty, 0)

  const login = async (email, password) => { const u = await authApi.login(email, password); setUser(u); return u }
  const signup = async (data) => { const u = await authApi.signup(data); setUser(u); return u }
  const logout = async () => { await authApi.logout(); setUser(null) }

  return (
    <Ctx.Provider value={{ cart, addToCart, setQty, removeFromCart, clearCart, total, count, user, authReady, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  )
}
