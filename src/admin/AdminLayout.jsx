// AdminLayout.jsx: the frame of every admin page: dark sidebar, top bar and the page itself. People who are not admins are sent away.
import { useEffect, useRef } from "react";
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
import { ToastProvider, useToast, money } from "./ui.jsx";
import { Icon } from "./icons.jsx";
import { useLive } from "./useLive.js";

// Title shown in the top bar for each admin address
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

// Everything inside the admin frame. It sits inside ToastProvider, so it can show notices.
function Shell({ user }) {
  const { logout } = useApp();
  const toast = useToast();
  const loc = useLocation();
  const nav = useNavigate();
  // The moment this page opened (minus 1 minute). Only orders and messages created after it get a 'new' notice.
  const since = useRef(Date.now() - 60000);
  // Live lists: they update by themselves whenever a customer places an order or sends a message.
  const [orders] = useLive(ordersApi.subscribe, (o) => {
    if ((o.createdAt || 0) > since.current)
      toast(
        `New order ${o.id} from ${o.customer} (${money(o.total)}) - ${o.status}`,
      );
  });
  const [msgs] = useLive(messagesApi.subscribe, (m) => {
    if ((m.createdAt || 0) > since.current) toast(`New message from ${m.name}`);
  });
  // badges = the red numbers in the sidebar (pending orders, unread messages). They follow the live lists.
  const badges = {
    orders: orders.filter((x) => x.status === "Pending").length,
    messages: msgs.filter((x) => !x.read).length,
  };

  // Builds one sidebar link: address, text, icon and an optional red counter
  const item = (to, label, icon, n, end) => (
    <NavLink to={to} end={end} className="ad-link">
      <Icon name={icon} />
      <span>{label}</span>
      {n > 0 && <i className="count">{n}</i>}
    </NavLink>
  );
  // Name and date shown in the sidebar and the top bar
  const name = user.name || "Admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="admin">
      {/* Dark sidebar */}
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
      {/* Right side: top bar and the current admin page (Outlet) */}
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
  );
}

export default function AdminLayout() {
  const { user, authReady } = useApp();
  // true only when the logged-in user has the role admin
  const isAdmin = !!user && user.role === "admin";
  // Wait for the login to be restored; people who are not admins go to the login page
  if (!authReady)
    return (
      <p className="muted" style={{ padding: 40 }}>
        Loading…
      </p>
    );
  if (!isAdmin) return <Navigate to="/login" replace />;
  return (
    <ToastProvider>
      <ErrorBridge />
      <Shell user={user} />
    </ToastProvider>
  );
}
