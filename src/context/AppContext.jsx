import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => load("cart", [])); // [{ product, qty }]
  const [user, setUser] = useState(() => load("user", null));

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("user", JSON.stringify(user)), [user]);

  const addToCart = (product, qty = 1) =>
    setCart((c) => {
      const found = c.find((i) => i.product.id === product.id);
      return found
        ? c.map((i) =>
            i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
          )
        : [...c, { product, qty }];
    });
  const setQty = (id, qty) =>
    setCart((c) =>
      c.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  const removeFromCart = (id) =>
    setCart((c) => c.filter((i) => i.product.id !== id));
  const clearCart = () => setCart([]);
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const login = async (email, password) =>
    setUser(await authApi.login(email, password));
  const signup = async (data) => setUser(await authApi.signup(data));
  const logout = () => setUser(null);

  return (
    <Ctx.Provider
      value={{
        cart,
        addToCart,
        setQty,
        removeFromCart,
        clearCart,
        total,
        count,
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
