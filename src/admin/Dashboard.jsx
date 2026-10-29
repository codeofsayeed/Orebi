import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Img from "../components/Img.jsx";
import {
  productsApi,
  ordersApi,
  messagesApi,
  STATUSES,
  backend,
  seedApi,
} from "../services/api.js";
import { dayStr, money, useToast } from "./ui.jsx";
import { Icon } from "./icons.jsx";

const STATUS_COLOR = {
  Pending: "#e0a526",
  Paid: "#3b82c4",
  Shipped: "#7a5bd1",
  Delivered: "#2e9e5b",
  Cancelled: "#c2c2c2",
};
const sum = (list) => list.reduce((s, o) => s + o.total, 0);
const niceMax = (m) => {
  const p = 10 ** Math.floor(Math.log10(m));
  const f = m / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
};
const initials = (n = "?") =>
  n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Number that counts up when the page opens.
function Count({ to, prefix = "", decimals = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    let t0;
    const run = (t) => {
      t0 = t0 ?? t;
      const p = Math.min(1, (t - t0) / 800);
      setV((Number(to) || 0) * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <>
      {prefix}
      {v.toFixed(decimals)}
    </>
  );
}

// Tiny line chart inside a stat card.
function Spark({ data, color }) {
  const max = Math.max(1, ...data);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * 100,
    29 - (v / max) * 25,
  ]);
  const line = pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const id = `sg${color.slice(1)}`;
  return (
    <svg className="ad-spark" viewBox="0 0 100 32" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L100 32 L0 32Z`} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Smooth area chart with hover tooltip.
function AreaChart({ points }) {
  const [hi, setHi] = useState(null);
  const W = 640;
  const H = 250;
  const L = 46;
  const R = 16;
  const T = 16;
  const B = 30;
  const max = niceMax(Math.max(1, ...points.map((p) => p.v)));
  const n = points.length;
  const x = (i) => L + (n === 1 ? 0 : (i / (n - 1)) * (W - L - R));
  const y = (v) => T + (1 - v / max) * (H - T - B);
  const curve = points
    .map((p, i) => {
      if (!i) return `M${x(0)} ${y(p.v)}`;
      const mx = (x(i - 1) + x(i)) / 2;
      return `C${mx} ${y(points[i - 1].v)} ${mx} ${y(p.v)} ${x(i)} ${y(p.v)}`;
    })
    .join(" ");
  const area = `${curve} L${x(n - 1)} ${H - B} L${x(0)} ${H - B}Z`;
  const step = Math.ceil(n / 7);
  const colW = (W - L - R) / Math.max(1, n - 1);
  return (
    <div className="ad-chart">
      <svg viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b82c4" stopOpacity=".38" />
            <stop offset="1" stopColor="#3b82c4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line
              x1={L}
              x2={W - R}
              y1={y(max * g)}
              y2={y(max * g)}
              className="ad-grid"
            />
            <text
              x={L - 8}
              y={y(max * g) + 4}
              textAnchor="end"
              className="ad-ax"
            >{`$${Math.round(max * g)}`}</text>
          </g>
        ))}
        <path d={area} fill="url(#areaG)" />
        <path
          d={curve}
          fill="none"
          stroke="#3b82c4"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {points.map(
          (p, i) =>
            i % step === 0 && (
              <text
                key={p.d}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                className="ad-ax"
              >
                {p.d.slice(5)}
              </text>
            ),
        )}
        {hi !== null && (
          <g>
            <line
              x1={x(hi)}
              x2={x(hi)}
              y1={T}
              y2={H - B}
              className="ad-cross"
            />
            <circle
              cx={x(hi)}
              cy={y(points[hi].v)}
              r="6"
              fill="#fff"
              stroke="#3b82c4"
              strokeWidth="3"
            />
          </g>
        )}
        {points.map((p, i) => (
          <rect
            key={p.d}
            x={x(i) - colW / 2}
            y={T}
            width={colW}
            height={H - T - B}
            fill="transparent"
            onMouseEnter={() => setHi(i)}
            onMouseLeave={() => setHi(null)}
          />
        ))}
      </svg>
      {hi !== null && (
        <div
          className="ad-tip"
          style={{
            left: `${(x(hi) / W) * 100}%`,
            top: `${(y(points[hi].v) / H) * 100}%`,
          }}
        >
          {points[hi].d}
          <b>{money(points[hi].v)}</b>
        </div>
      )}
    </div>
  );
}

// Donut chart of orders by status.
function Donut({ parts, total }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 140 140" className="ad-donut">
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="#efefea"
        strokeWidth="16"
      />
      {total > 0 &&
        parts
          .filter((p) => p.n > 0)
          .map((p) => {
            const len = (p.n / total) * c;
            const el = (
              <circle
                key={p.s}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={STATUS_COLOR[p.s]}
                strokeWidth="16"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-acc}
                transform="rotate(-90 70 70)"
              />
            );
            acc += len;
            return el;
          })}
      <text x="70" y="68" textAnchor="middle" className="ad-dn">
        {total}
      </text>
      <text x="70" y="87" textAnchor="middle" className="ad-dl">
        orders
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useApp();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [range, setRange] = useState(14);
  const [ready, setReady] = useState(false);
  const load = () =>
    Promise.all([productsApi.list(), ordersApi.list(), messagesApi.list()])
      .then(([p, o, m]) => {
        setProducts(p);
        setOrders(o);
        setMsgs(m);
        setReady(true);
      })
      .catch(() => setReady(true));
  useEffect(() => {
    load();
  }, []);

  const live = orders.filter((o) => o.status !== "Cancelled");
  const between = (from, to) =>
    live.filter((o) => o.date >= dayStr(from) && o.date <= dayStr(to));
  const trend = (a, b) => (b ? Math.round(((a - b) / b) * 100) : null);
  const cur = between(6, 0);
  const prev = between(13, 7);
  const revenue = sum(live);
  const week = Array.from({ length: 7 }, (_, i) =>
    live.filter((o) => o.date === dayStr(6 - i)),
  );
  const points = Array.from({ length: range }, (_, i) => {
    const d = dayStr(range - 1 - i);
    return { d, v: sum(live.filter((o) => o.date === d)) };
  });
  const todayOrders = orders.filter((o) => o.date === dayStr(0));
  const todayRevenue = sum(todayOrders.filter((o) => o.status !== "Cancelled"));
  const pending = orders.filter((o) => o.status === "Pending").length;
  const unread = msgs.filter((m) => !m.read).length;
  const low = products
    .filter((p) => p.stock < 25)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const parts = STATUSES.map((s) => ({
    s,
    n: orders.filter((o) => o.status === s).length,
  }));
  const top = useMemo(() => {
    const m = {};
    orders
      .filter((o) => o.status !== "Cancelled")
      .forEach((o) =>
        (o.items || []).forEach((i) => {
          m[i.id] = m[i.id] || { id: i.id, name: i.name, qty: 0, rev: 0 };
          m[i.id].qty += i.qty;
          m[i.id].rev += i.qty * i.price;
        }),
      );
    return Object.values(m)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);
  const topMax = Math.max(1, ...top.map((t) => t.qty));

  const h = new Date().getHours();
  const greet =
    h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const name = (user?.name || "Admin").replace(/^./, (c) => c.toUpperCase());

  const seed = async () => {
    await seedApi.run();
    toast("Demo data loaded");
    load();
  };
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

  const cards = [
    {
      label: "Total revenue",
      value: <Count to={revenue} prefix="$" decimals={2} />,
      trend: trend(sum(cur), sum(prev)),
      spark: week.map(sum),
      color: "#2e9e5b",
      tint: "#e3f5ea",
      icon: "money",
      to: "/admin/orders",
    },
    {
      label: "Orders",
      value: <Count to={orders.length} />,
      trend: trend(cur.length, prev.length),
      spark: week.map((w) => w.length),
      color: "#3b82c4",
      tint: "#e2eefa",
      icon: "orders",
      to: "/admin/orders",
    },
    {
      label: "Products",
      value: <Count to={products.length} />,
      note: `${low.length} running low on stock`,
      color: "#7a5bd1",
      tint: "#ece6fa",
      icon: "products",
      to: "/admin/products",
    },
    {
      label: "Unread messages",
      value: <Count to={unread} />,
      note: `${msgs.length} messages in total`,
      color: "#e0a526",
      tint: "#fbf0d2",
      icon: "messages",
      to: "/admin/messages",
    },
  ];

  return (
    <>
      {backend === "demo" && (
        <div className="note">
          Demo mode: changes reset when you reload the page. Add your Firebase
          keys to the <code>.env</code> file to save data permanently.
        </div>
      )}
      {backend === "firebase" && ready && !products.length && (
        <div className="note">
          Your Firebase database is empty.{" "}
          <button className="btn" onClick={seed}>
            Load demo data
          </button>
        </div>
      )}

      <div className="ad-hero">
        <div>
          <small>{greet}</small>
          <h2>Welcome back, {name} 👋</h2>
          <p>
            {todayOrders.length
              ? `${todayOrders.length} new order${todayOrders.length > 1 ? "s" : ""} came in today.`
              : "No orders yet today."}
            {pending
              ? ` ${pending} waiting to be processed.`
              : " Everything is processed."}
          </p>
          <div className="ad-actions">
            <Link to="/admin/products" className="pri">
              <Icon name="plus" size={16} /> Add product
            </Link>
            <Link to="/admin/orders">View orders</Link>
            <Link to="/admin/journal">Write article</Link>
          </div>
        </div>
        <div className="ad-hero-r">
          <div>
            <small>Today's revenue</small>
            <b>
              <Count to={todayRevenue} prefix="$" decimals={2} />
            </b>
          </div>
          <div>
            <small>Orders today</small>
            <b>
              <Count to={todayOrders.length} />
            </b>
          </div>
          <div>
            <small>Pending</small>
            <b>
              <Count to={pending} />
            </b>
          </div>
        </div>
      </div>

      <div className="ad-stats">
        {cards.map((c, i) => (
          <Link
            key={c.label}
            to={c.to}
            className="ad-stat"
            style={{
              "--c": c.color,
              "--t": c.tint,
              animationDelay: `${i * 70}ms`,
            }}
          >
            <div className="ad-stat-top">
              <span className="ad-ico">
                <Icon name={c.icon} size={20} />
              </span>
              {c.trend !== undefined && (
                <span
                  className={`ad-trend ${c.trend === null ? "" : c.trend >= 0 ? "up" : "down"}`}
                >
                  {c.trend === null
                    ? "New"
                    : `${c.trend >= 0 ? "▲" : "▼"} ${Math.abs(c.trend)}%`}
                </span>
              )}
            </div>
            <b className="ad-val">{c.value}</b>
            <span className="ad-lab">{c.label}</span>
            {c.spark ? (
              <Spark data={c.spark} color={c.color} />
            ) : (
              <small className="ad-note">{c.note}</small>
            )}
          </Link>
        ))}
      </div>

      <div className="ad-row r21">
        <div className="ad-card">
          <div className="ph">
            <div>
              <h5>Sales overview</h5>
              <p className="muted">
                {money(sum(points.map((p) => ({ total: p.v }))))} in the last{" "}
                {range} days
              </p>
            </div>
            <div className="chips">
              {[7, 14, 30].map((r) => (
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
          <AreaChart points={points} />
        </div>
        <div className="ad-card">
          <h5>Orders by status</h5>
          <div className="ad-dwrap">
            <Donut parts={parts} total={orders.length} />
            <div className="ad-leg">
              {parts.map((p) => (
                <Link to="/admin/orders" key={p.s}>
                  <i style={{ background: STATUS_COLOR[p.s] }} />
                  {p.s}
                  <b>{p.n}</b>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ad-row r21">
        <div className="ad-card">
          <div className="ph">
            <h5>Recent orders</h5>
            <Link className="link ul" to="/admin/orders">
              View all
            </Link>
          </div>
          <table className="tbl compact">
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id}>
                  <td>
                    <b>{o.id}</b>
                    <br />
                    <span className="muted">{o.date}</span>
                  </td>
                  <td>{o.customer}</td>
                  <td>
                    <b>{money(o.total)}</b>
                  </td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      style={{
                        borderColor: STATUS_COLOR[o.status],
                        color: STATUS_COLOR[o.status],
                      }}
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
          {!orders.length && <p className="muted">No orders yet.</p>}
        </div>
        <div className="ad-card">
          <div className="ph">
            <h5>Top selling products</h5>
          </div>
          {!top.length && (
            <p className="muted">
              Sales will appear here after the first order.
            </p>
          )}
          {top.map((t, i) => (
            <div className="ad-prow" key={t.id}>
              <div className="img thumb sm">
                <Img src={byId[t.id]?.image} alt="" />
              </div>
              <div>
                <b>
                  {i + 1}. {t.name}
                </b>
                <div className="ad-bar">
                  <i style={{ width: `${(t.qty / topMax) * 100}%` }} />
                </div>
              </div>
              <span className="muted">{t.qty} sold</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ad-row r11">
        <div className="ad-card">
          <div className="ph">
            <h5>Low stock</h5>
            <Link className="link ul" to="/admin/products">
              All products
            </Link>
          </div>
          {!low.length ? (
            <p className="muted">All products are well stocked.</p>
          ) : (
            low.map((p) => (
              <div className="ad-prow" key={p.id}>
                <div className="img thumb sm">
                  <Img src={p.image} alt="" />
                </div>
                <div>
                  <b>{p.name}</b>
                  <div className="ad-bar low">
                    <i
                      style={{
                        width: `${Math.min(100, (p.stock / 25) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <span>
                  <b className="warn">{p.stock}</b>{" "}
                  <button className="link ul" onClick={() => restock(p)}>
                    +10
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
        <div className="ad-card">
          <div className="ph">
            <h5>Latest messages</h5>
            <Link className="link ul" to="/admin/messages">
              Open inbox
            </Link>
          </div>
          {!msgs.length && <p className="muted">No messages yet.</p>}
          {msgs.slice(0, 4).map((m) => (
            <Link
              to="/admin/messages"
              className={`ad-msg ${m.read ? "" : "new"}`}
              key={m.id}
            >
              <span className="ad-avatar sm">{initials(m.name)}</span>
              <div>
                <b>{m.name}</b>
                <p className="muted">{m.message.slice(0, 70)}</p>
              </div>
              <small className="muted">{m.date}</small>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
