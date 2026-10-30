import { useState } from "react";
import { messagesApi } from "../services/api.js";

/* ================= EDIT YOUR OFFICES HERE =================
   The live map searches for `address` automatically, so just type the real address.
   If the map finds the wrong place, add a `mapQuery` to that office, e.g. mapQuery: 'Orebi Store, Dhaka'. */
const OFFICES = [
  {
    name: "Germany Office",
    address: "575 Crescent Ave. Quakertown, PA 18951",
    phone: "+432 533 12 523",
    email: "info@domain.com",
    hours: "Mon - Fri: 9am - 6pm",
  },
  {
    name: "Slovakia Office",
    address: "575 Crescent Ave. Quakertown, PA 18951",
    phone: "+432 533 12 523",
    email: "info@domain.com",
    hours: "Mon - Fri: 9am - 6pm",
  },
  {
    name: "Lithuania Office",
    address: "575 Crescent Ave. Quakertown, PA 18951",
    phone: "+432 533 12 523",
    email: "info@domain.com",
    hours: "Mon - Fri: 9am - 6pm",
  },
];
/* ========================================================== */

const mapSrc = (o) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(o.mapQuery || o.address)}&z=15&output=embed`;
const mapLink = (o) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery || o.address)}`;

export default function Contacts() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [active, setActive] = useState(2);
  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.message) return;
    try {
      await messagesApi.create(f);
      setErr("");
      setF({ name: "", email: "", message: "" });
      setSent(true);
    } catch {
      setErr("Could not send your message. Please try again.");
    }
  };
  const office = OFFICES[active];
  return (
    <>
      <h1>Contacts</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Contacts</p>
      <h2>Fill up a Form</h2>
      <form className="form wide" onSubmit={submit}>
        <label>
          Name
          <input
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            placeholder="Your name here"
          />
        </label>
        <label>
          Email
          <input
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            placeholder="Your email here"
          />
        </label>
        <label>
          Message
          <textarea
            rows="4"
            value={f.message}
            onChange={(e) => setF({ ...f, message: e.target.value })}
            placeholder="Your message here"
          />
        </label>
        <button className="btn">Post</button>
        {sent && <p className="muted">Thanks! Your message has been sent.</p>}
        {err && <p className="err">{err}</p>}
      </form>

      <div className="map">
        {/* live map: drag to move, scroll or +/- to zoom. key= reloads it when another office is picked */}
        <iframe
          key={active}
          title={`Map of ${office.name}`}
          src={mapSrc(office)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="locs">
          {OFFICES.map((o, i) => (
            <div
              key={o.name}
              className={`loc ${active === i ? "on" : ""}`}
              onClick={() => setActive(i)}
            >
              <h5>{o.name}</h5>
              {active === i && (
                <div className="muted">
                  <p>{o.address}</p>
                  <p>{o.phone}</p>
                  <p>{o.email}</p>
                  <p>{o.hours}</p>
                  <a
                    className="dir"
                    href={mapLink(o)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
