import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const TABS = [
  "Dashboard",
  "Others",
  "Downloads",
  "Addresses",
  "Account details",
];

export default function Account() {
  const { user, logout } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState("Dashboard");
  if (!user) return <Navigate to="/login" replace />;
  const out = () => {
    logout();
    nav("/");
  };
  return (
    <>
      <h1>My Account</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; My account</p>
      <div className="acct">
        <aside>
          {TABS.map((t) => (
            <button
              key={t}
              className={tab === t ? "on" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
          <button onClick={out}>Logout</button>
        </aside>
        <div>
          {tab === "Dashboard" && (
            <>
              <p>
                Hello <b>{user.name}</b> (not {user.name}?{" "}
                <button className="link ul" onClick={out}>
                  Log out
                </button>
                )
              </p>
              <p className="muted">
                From your account dashboard you can view your recent orders,
                manage your shipping and billing addresses, and edit your
                password and account details.
              </p>
              {user.role === "admin" && (
                <Link className="btn" to="/admin">
                  Open admin dashboard
                </Link>
              )}
            </>
          )}
          {tab === "Account details" && (
            <div className="form">
              <label>
                Name
                <input defaultValue={user.name} />
              </label>
              <label>
                Email
                <input defaultValue={user.email} />
              </label>
            </div>
          )}
          {!["Dashboard", "Account details"].includes(tab) && (
            <p className="muted">Nothing here yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
