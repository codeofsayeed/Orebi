import { useEffect, useState } from "react";
import { ordersApi, STATUSES } from "../services/api.js";
import { Badge, Confirm, Modal, Pager, money, useToast } from "./ui.jsx";

const PER = 8;
export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [del, setDel] = useState(null);
  const load = () => ordersApi.list().then(setOrders);
  useEffect(() => {
    load();
  }, []);

  const shown = orders.filter(
    (o) =>
      (tab === "All" || o.status === tab) &&
      (!q || `${o.id} ${o.customer}`.toLowerCase().includes(q.toLowerCase())),
  );
  const pages = Math.max(1, Math.ceil(shown.length / PER));
  const slice = shown.slice((page - 1) * PER, page * PER);
  const current = open && orders.find((o) => o.id === open);
  const setStatus = async (id, status) => {
    await ordersApi.update(id, { status });
    toast(`${id} marked ${status}`);
    load();
  };
  const remove = async () => {
    await ordersApi.remove(del);
    setDel(null);
    setOpen(null);
    toast("Order deleted");
    load();
  };

  return (
    <>
      <h2>Orders</h2>
      <div className="toolbar">
        <div className="chips">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              className={tab === s ? "on" : ""}
              onClick={() => {
                setTab(s);
                setPage(1);
              }}
            >
              {s}{" "}
              <i>
                {s === "All"
                  ? orders.length
                  : orders.filter((o) => o.status === s).length}
              </i>
            </button>
          ))}
        </div>
        <input
          className="find"
          placeholder="Search order or customer"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((o) => (
            <tr key={o.id} className="click" onClick={() => setOpen(o.id)}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.date}</td>
              <td>{money(o.total)}</td>
              <td>
                <Badge status={o.status} />
              </td>
            </tr>
          ))}
          {!slice.length && (
            <tr>
              <td colSpan="5" className="muted">
                No orders match.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pager page={page} pages={pages} set={setPage} />

      {current && (
        <Modal title={`Order ${current.id}`} onClose={() => setOpen(null)} wide>
          <p className="muted">
            {current.customer} · {current.date} · Payment:{" "}
            {current.payment || "—"}
          </p>
          <table className="tbl small">
            <tbody>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
              {(current.items || []).map((i, k) => (
                <tr key={k}>
                  <td>{i.name}</td>
                  <td>{i.qty}</td>
                  <td>{money(i.price * i.qty)}</td>
                </tr>
              ))}
              <tr>
                <th>Total</th>
                <td />
                <td>
                  <b>{money(current.total)}</b>
                </td>
              </tr>
            </tbody>
          </table>
          {current.notes && <p className="muted">Notes: {current.notes}</p>}
          <div className="btns">
            <select
              value={current.status}
              onChange={(e) => setStatus(current.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="btn danger" onClick={() => setDel(current.id)}>
              Delete order
            </button>
          </div>
        </Modal>
      )}
      {del && (
        <Confirm
          text={`Delete order ${del}? This cannot be undone.`}
          onYes={remove}
          onNo={() => setDel(null)}
        />
      )}
    </>
  );
}
