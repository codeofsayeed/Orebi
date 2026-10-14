import { useEffect, useState } from "react";
import { messagesApi } from "../services/api.js";
import { Confirm, useToast } from "./ui.jsx";

export default function AdminMessages() {
  const toast = useToast();
  const [msgs, setMsgs] = useState([]);
  const [open, setOpen] = useState(null);
  const [del, setDel] = useState(null);
  const [only, setOnly] = useState(false);
  const load = () => messagesApi.list().then(setMsgs);
  useEffect(() => {
    load();
  }, []);
  const toggle = async (m) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.read) {
      await messagesApi.update(m.id, { read: true });
      load();
    }
  };
  const unread = async (m) => {
    await messagesApi.update(m.id, { read: false });
    toast("Marked unread");
    load();
  };
  const remove = async () => {
    await messagesApi.remove(del);
    setDel(null);
    toast("Message deleted");
    load();
  };
  const shown = msgs.filter((m) => !only || !m.read);
  return (
    <>
      <h2>Messages</h2>
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
      {shown.map((m) => (
        <div key={m.id} className={`msg ${m.read ? "" : "unread"}`}>
          <div className="row" onClick={() => toggle(m)}>
            <b>{m.name}</b>
            <span className="muted">{m.date}</span>
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
