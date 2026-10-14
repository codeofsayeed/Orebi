import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const F = ({ label, k, f, set, type = "text", ph = "" }) => (
  <label>
    {label}
    <input
      type={type}
      value={f[k]}
      onChange={(e) => set({ ...f, [k]: e.target.value })}
      placeholder={ph}
    />
  </label>
);

export default function Signup() {
  const { signup } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postCode: "",
    country: "",
    region: "",
    password: "",
    repeat: "",
    agree: false,
    newsletter: "yes",
  });
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!f.agree) return setErr("Please accept the Privacy Policy");
    try {
      await signup(f);
      nav("/");
    } catch (x) {
      setErr(x.message);
    }
  };
  return (
    <>
      <h1>Sign up</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Sign up</p>
      <p className="muted info-text">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s.
      </p>
      <form onSubmit={submit}>
        <h2>Your Personal Details</h2>
        <div className="form two">
          <F
            label="First Name"
            k="firstName"
            f={f}
            set={setF}
            ph="First Name"
          />
          <F label="Last Name" k="lastName" f={f} set={setF} ph="Last Name" />
          <F
            label="Email address"
            k="email"
            f={f}
            set={setF}
            ph="company@domain.com"
          />
          <F
            label="Telephone"
            k="phone"
            f={f}
            set={setF}
            ph="Your phone number"
          />
        </div>
        <h2>New Customer</h2>
        <div className="form two">
          <F
            label="Address 1"
            k="address1"
            f={f}
            set={setF}
            ph="4279 Zboncak Port Suite 6212"
          />
          <F label="Address 2" k="address2" f={f} set={setF} ph="—" />
          <F label="City" k="city" f={f} set={setF} ph="Your city" />
          <F label="Post Code" k="postCode" f={f} set={setF} ph="05228" />
          <label>
            Country
            <select
              value={f.country}
              onChange={(e) => setF({ ...f, country: e.target.value })}
            >
              <option value="">Please select</option>
              {[
                "Bangladesh",
                "Germany",
                "Slovakia",
                "Lithuania",
                "United States",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Region/State
            <select
              value={f.region}
              onChange={(e) => setF({ ...f, region: e.target.value })}
            >
              <option value="">Please select</option>
              {["Region 1", "Region 2", "Region 3"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <h2>Your Password</h2>
        <div className="form two">
          <F label="Password" k="password" f={f} set={setF} type="password" />
          <F
            label="Repeat Password"
            k="repeat"
            f={f}
            set={setF}
            type="password"
          />
        </div>
        <hr className="line" />
        <label className="chk">
          <input
            type="checkbox"
            checked={f.agree}
            onChange={(e) => setF({ ...f, agree: e.target.checked })}
          />{" "}
          I have read and agree to the Privacy Policy
        </label>
        <div className="chk">
          Subscribe Newsletter &nbsp;
          {["yes", "no"].map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="nl"
                checked={f.newsletter === v}
                onChange={() => setF({ ...f, newsletter: v })}
              />{" "}
              {v === "yes" ? "Yes" : "No"} &nbsp;
            </label>
          ))}
        </div>
        {err && <p className="err">{err}</p>}
        <button className="btn">Log in</button>
      </form>
    </>
  );
}
