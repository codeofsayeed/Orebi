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
import { ordersApi, messagesApi } from "../services/api.js";
import { ToastProvider } from "./ui.jsx";

export default function AdminLayout() {
  const { user, logout } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const [badges, setBadges] = useState({ orders: 0, messages: 0 });
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    Promise.all([ordersApi.list(), messagesApi.list()]).then(([o, m]) =>
      setBadges({
        orders: o.filter((x) => x.status === "Pending").length,
        messages: m.filter((x) => !x.read).length,
      }),
    );
  }, [loc.pathname, user]);
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  const item = (to, label, n, end) => (
    <NavLink to={to} end={end}>
      {label}
      {n > 0 && <i className="count">{n}</i>}
    </NavLink>
  );
  return (
    <ToastProvider>
      <div className="admin">
        <aside>
          <Link to="/" className="logo">
            OREBI
          </Link>
          {item("/admin", "Dashboard", 0, true)}
          {item("/admin/orders", "Orders", badges.orders)}
          {item("/admin/products", "Products")}
          {item("/admin/messages", "Messages", badges.messages)}
          {item("/admin/journal", "Journal")}
          <div className="spacer" />
          <Link to="/">← Back to shop</Link>
          <button
            className="link"
            onClick={() => {
              logout();
              nav("/");
            }}
          >
            Logout
          </button>
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
    </ToastProvider>
  );
}
