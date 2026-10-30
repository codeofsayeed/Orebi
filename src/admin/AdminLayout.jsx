import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { ordersApi, messagesApi, backend } from "../services/api.js";
import { ToastProvider, useToast } from "./ui.jsx";
import { Icon } from "./icons.jsx";

const TITLES = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/messages": "Messages",
  "/admin/journal": "Journal",
  "/admin/settings": "Settings",
};

// Shows database errors (for example "permission denied") as a red notice.
function ErrorBridge() {
  const toast = useToast();
  useEffect(() => {
    const h = (e) => toast(e.detail, "err");
    window.addEventListener("orebi-error", h);
    return () => window.removeEventListener("orebi-error", h);
  }, [toast]);
  return null;
}

export default function AdminLayout() {
  const { user, logout, authReady } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const [badges, setBadges] = useState({ orders: 0, messages: 0 });
  const isAdmin = !!user && user.role === "admin";
  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([ordersApi.list(), messagesApi.list()])
      .then(([o, m]) =>
        setBadges({
          orders: o.filter((x) => x.status === "Pending").length,
          messages: m.filter((x) => !x.read).length,
        }),
      )
      .catch(() => {});
  }, [loc.pathname, isAdmin]);
  if (!authReady)
    return (
      <p className="muted" style={{ padding: 40 }}>
        Loading…
      </p>
    );
  if (!isAdmin) return <Navigate to="/login" replace />;

  const item = (to, label, icon, n, end) => (
    <NavLink to={to} end={end} className="ad-link">
      <Icon name={icon} />
      <span>{label}</span>
      {n > 0 && <i className="count">{n}</i>}
    </NavLink>
  );
  const name = user.name || "Admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ToastProvider>
      <ErrorBridge />
      <div className="admin">
        <aside className="ad-side">
          <Link to="/" className="ad-brand">
            OREBI<span>Admin</span>
          </Link>
          <nav className="ad-nav">
            {item("/admin", "Dashboard", "dashboard", 0, true)}
            {item("/admin/orders", "Orders", "orders", badges.orders)}
            {item("/admin/products", "Products", "products")}
            {item("/admin/messages", "Messages", "messages", badges.messages)}
            {item("/admin/journal", "Journal", "journal")}
            {item("/admin/settings", "Settings", "settings")}
          </nav>
          <div className="spacer" />
          <div className={`ad-mode ${backend}`}>
            {backend === "firebase" ? "● Firebase connected" : "● Demo mode"}
          </div>
          <div className="ad-user">
            <div className="ad-avatar">{name[0].toUpperCase()}</div>
            <div>
              <b>{name}</b>
              <small>Administrator</small>
            </div>
          </div>
          <Link to="/" className="ad-link">
            <Icon name="shop" />
            <span>View shop</span>
          </Link>
          <button
            className="ad-link"
            onClick={async () => {
              await logout();
              nav("/");
            }}
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </aside>
        <section className="ad-main">
          <div className="ad-top">
            <div>
              <small>Admin panel</small>
              <b>{TITLES[loc.pathname] || "Admin"}</b>
            </div>
            <span className="ad-date">{today}</span>
          </div>
          <div className="ad-body">
            <Outlet />
          </div>
        </section>
      </div>
    </ToastProvider>
  );
}
