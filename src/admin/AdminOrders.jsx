// AdminOrders.jsx: the admin Orders page: a live list, status tabs, details window, change status and delete.
import { useState } from "react";
import { ordersApi, STATUSES } from "../services/api.js";
import { Badge, Confirm, Modal, Pager, money, useToast } from "./ui.jsx";
import { useLive } from "./useLive.js";

// orders shown per page
const PER = 8;
export default function AdminOrders() {
  const toast = useToast();
  // orders = every order. This list is LIVE: a new order appears here by itself, and the tab numbers change with it.
  // fresh = ids of orders that just arrived (their row flashes yellow for a few seconds)
  const [orders, , fresh] = useLive(ordersApi.subscribe);
  // tab = the selected status tab (All or one status)
  const [tab, setTab] = useState("All");
  // q = words typed in the search box
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  // open = id of the order whose details window is open
  const [open, setOpen] = useState(null);
  // del = id of the order waiting for delete confirmation
  const [del, setDel] = useState(null);

  // Orders that match the selected tab and the search words
  const shown = orders.filter(
    (o) =>
      (tab === "All" || o.status === tab) &&
      (!q || `${o.id} ${o.customer}`.toLowerCase().includes(q.toLowerCase())),
  );
  const pages = Math.max(1, Math.ceil(shown.length / PER));
  // The orders on the current page
  const slice = shown.slice((page - 1) * PER, page * PER);
  // The order shown in the details window
  const current = open && orders.find((o) => o.id === open);
  // Change the status of an order (the live list updates by itself afterwards)
  const setStatus = async (id, status) => {
    await ordersApi.update(id, { status });
    toast(`${id} marked ${status}`);
  };
  const remove = async () => {
    await ordersApi.remove(del);
    setDel(null);
    setOpen(null);
    toast("Order deleted");
  };

  return (
    <>
      <h2>
        Orders <span className="live">Live</span>
      </h2>
      {/* Status tabs with counts, and the search box */}
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
      {/* Orders table. Click a row to see its details. New orders flash yellow. */}
      <table className="tbl">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((o) => (
            <tr
              key={o.id}
              className={`click ${fresh.includes(o.id) ? "fresh" : ""}`}
              onClick={() => setOpen(o.id)}
            >
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.date}</td>
              <td>{o.payment || "—"}</td>
              <td>{money(o.total)}</td>
              <td>
                <Badge status={o.status} />
              </td>
            </tr>
          ))}
          {!slice.length && (
            <tr>
              <td colSpan="6" className="muted">
                No orders match.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pager page={page} pages={pages} set={setPage} />

      {/* Details window */}
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
      {/* Asks for confirmation before deleting */}
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
