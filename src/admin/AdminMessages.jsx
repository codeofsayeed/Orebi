// AdminMessages.jsx: the admin Messages page: a live inbox of messages sent from the contact form.
import { useState } from "react";
import { messagesApi } from "../services/api.js";
import { Confirm, useToast } from "./ui.jsx";
import { useLive } from "./useLive.js";

// Date and time of a message, for example 2026-11-03 · 14:05 (older demo messages only have the date)
const when = (m) =>
  m.createdAt
    ? `${m.date} · ${new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : m.date;

export default function AdminMessages() {
  const toast = useToast();
  // msgs = every message. This list is LIVE: a message sent from the contact form appears here by itself.
  // fresh = ids of messages that just arrived (their box flashes yellow for a few seconds)
  const [msgs, , fresh] = useLive(messagesApi.subscribe);
  // open = id of the message that is expanded
  const [open, setOpen] = useState(null);
  // del = id of the message waiting for delete confirmation
  const [del, setDel] = useState(null);
  // only = true to show unread messages only
  const [only, setOnly] = useState(false);
  // Open or close a message. Opening it marks it as read.
  const toggle = async (m) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.read) await messagesApi.update(m.id, { read: true });
  };
  // Mark a message as unread again
  const unread = async (m) => {
    await messagesApi.update(m.id, { read: false });
    toast("Marked unread");
  };
  const remove = async () => {
    await messagesApi.remove(del);
    setDel(null);
    toast("Message deleted");
  };
  // All messages, or only the unread ones
  const shown = msgs.filter((m) => !only || !m.read);
  return (
    <>
      <h2>
        Messages <span className="live">Live</span>
      </h2>
      {/* All / Unread buttons (the numbers change by themselves) */}
      <div className="toolbar">
        <div className="chips">
          <button className={!only ? "on" : ""} onClick={() => setOnly(false)}>
            All <i>{msgs.length}</i>
          </button>
          <button className={only ? "on" : ""} onClick={() => setOnly(true)}>
            Unread <i>{msgs.filter((m) => !m.read).length}</i>
          </button>
        </div>
      </div>
      {!shown.length && <p className="muted">No messages.</p>}
      {/* One box for each message, newest first. New messages flash yellow. */}
      {shown.map((m) => (
        <div
          key={m.id}
          className={`msg ${m.read ? "" : "unread"} ${fresh.includes(m.id) ? "fresh" : ""}`}
        >
          <div className="row" onClick={() => toggle(m)}>
            <b>{m.name}</b>
            <span className="muted">{when(m)}</span>
          </div>
          <p className="muted clip" onClick={() => toggle(m)}>
            {open === m.id ? m.message : m.message.slice(0, 90)}
          </p>
          {open === m.id && (
            <div className="acts">
              <a
                className="btn light"
                href={`mailto:${m.email}?subject=Re: your message`}
              >
                Reply to {m.email}
              </a>
              <button className="link ul" onClick={() => unread(m)}>
                Mark unread
              </button>
              <button className="link" onClick={() => setDel(m.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {/* Asks for confirmation before deleting */}
      {del && (
        <Confirm
          text="Delete this message?"
          onYes={remove}
          onNo={() => setDel(null)}
        />
      )}
    </>
  );
}
