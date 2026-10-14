import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  productsApi,
  ordersApi,
  messagesApi,
  STATUSES,
} from "../services/api.js";
import { Badge, dayStr, money, useToast } from "./ui.jsx";

export default function Dashboard() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [range, setRange] = useState(7);
  const [hover, setHover] = useState(null);
  const load = () =>
    Promise.all([
      productsApi.list(),
      ordersApi.list(),
      messagesApi.list(),
    ]).then(([p, o, m]) => {
      setProducts(p);
      setOrders(o);
      setMsgs(m);
    });
  useEffect(() => {
    load();
  }, []);

  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const days = Array.from({ length: range }, (_, i) => dayStr(range - 1 - i));
  const sales = days.map((d) => ({
    d,
    v: live.filter((o) => o.date === d).reduce((s, o) => s + o.total, 0),
  }));
  const max = Math.max(1, ...sales.map((s) => s.v));
  const periodTotal = sales.reduce((s, x) => s + x.v, 0);
  const low = products
    .filter((p) => p.stock < 25)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);
  const unread = msgs.filter((m) => !m.read).length;
  const cards = [
    ["Revenue", money(revenue), "/admin/orders"],
    ["Orders", orders.length, "/admin/orders"],
    ["Products", products.length, "/admin/products"],
    ["Unread messages", unread, "/admin/messages"],
  ];

  const setStatus = async (id, status) => {
    await ordersApi.update(id, { status });
    toast(`${id} marked ${status}`);
    load();
  };
  const restock = async (p) => {
    await productsApi.update(p.id, { stock: p.stock + 10 });
    toast("Added 10 units");
    load();
  };

  return (
    <>
      <h2>Dashboard</h2>
      <div className="stats">
        {cards.map(([l, v, to]) => (
          <Link key={l} to={to}>
            <span className="muted">{l}</span>
            <b>{v}</b>
            <small>View →</small>
          </Link>
        ))}
      </div>

      <div className="panels">
        <div className="panel">
          <div className="ph">
            <h5>Sales</h5>
            <div className="chips">
              {[7, 14].map((r) => (
                <button
                  key={r}
                  className={range === r ? "on" : ""}
                  onClick={() => setRange(r)}
                >
                  {r} days
                </button>
              ))}
            </div>
          </div>
          <p className="muted">
            {hover
              ? `${hover.d}: ${money(hover.v)}`
              : `${money(periodTotal)} in the last ${range} days`}
          </p>
          <div className="chart">
            {sales.map((s) => (
              <div
                key={s.d}
                className="bar"
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className="fill"
                  style={{ height: `${(s.v / max) * 100}%` }}
                />
                <span>{s.d.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h5>Orders by status</h5>
          {STATUSES.map((st) => {
            const n = orders.filter((o) => o.status === st).length;
            return (
              <Link to="/admin/orders" key={st} className="srow">
                <span>{st}</span>
                <div className="track">
                  <div
                    className={`fillh ${st.toLowerCase()}`}
                    style={{
                      width: `${orders.length ? (n / orders.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <b>{n}</b>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="panels">
        <div className="panel">
          <div className="ph">
            <h5>Recent orders</h5>
            <Link className="link ul" to="/admin/orders">
              View all
            </Link>
          </div>
          <table className="tbl compact">
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{money(o.total)}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <div className="ph">
            <h5>Low stock</h5>
            <Link className="link ul" to="/admin/products">
              All products
            </Link>
          </div>
          {!low.length ? (
            <p className="muted">All products are well stocked.</p>
          ) : (
            <table className="tbl compact">
              <tbody>
                {low.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.name} <span className="muted">· {p.color}</span>
                    </td>
                    <td>
                      <b className="warn">{p.stock} left</b>
                    </td>
                    <td>
                      <button className="link ul" onClick={() => restock(p)}>
                        +10
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {!!orders.length && (
        <p className="muted">
          Latest order: <Badge status={orders[0].status} /> {orders[0].id} ·{" "}
          {orders[0].customer}
        </p>
      )}
    </>
  );
}
