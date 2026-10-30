import { useEffect, useState } from "react";
import { settingsApi } from "../services/api.js";
import { useToast } from "./ui.jsx";

// key = field name saved in the database, also used by the footer in Layout.jsx
const FIELDS = [
  ["facebook", "Facebook page link", "https://www.facebook.com/yourpage"],
  ["linkedin", "LinkedIn link", "https://www.linkedin.com/company/yourcompany"],
  ["instagram", "Instagram link", "https://www.instagram.com/yourname"],
];
// adds https:// if you forgot it
const clean = (u) => {
  const t = (u || "").trim();
  return !t ? "" : /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

export default function AdminSettings() {
  const toast = useToast();
  const [f, setF] = useState({ facebook: "", linkedin: "", instagram: "" });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    settingsApi.get().then((s) => {
      setF((x) => ({ ...x, ...s }));
      setLoaded(true);
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(FIELDS.map(([k]) => [k, clean(f[k])]));
    await settingsApi.save(data);
    setF(data);
    toast("Social links saved");
  };

  return (
    <>
      <h2>Settings</h2>
      <div className="ad-card">
        <h5>Footer social links</h5>
        <p className="muted">
          Paste the full address of each page. Leave a box empty to hide that
          icon in the website footer.
        </p>
        <form className="form wide" onSubmit={save}>
          {FIELDS.map(([k, label, ph]) => (
            <label key={k}>
              {label}
              <input
                value={f[k] || ""}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
                placeholder={ph}
              />
            </label>
          ))}
          <button className="btn" disabled={!loaded}>
            Save changes
          </button>
        </form>
      </div>
    </>
  );
}
