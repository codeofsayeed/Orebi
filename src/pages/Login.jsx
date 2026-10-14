import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav(email === "admin@orebi.com" ? "/admin" : "/");
    } catch (x) {
      setErr(x.message);
    }
  };
  return (
    <>
      <h1>Login</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Login</p>
      <h2>Returning Customer</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Email address
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="company@domain.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {err && <p className="err">{err}</p>}
        <button className="btn">Log in</button>
      </form>
      <p className="muted">Demo admin: admin@orebi.com / admin123</p>
      <h2>New Customer</h2>
      <Link className="btn" to="/signup">
        Continue
      </Link>
    </>
  );
}
