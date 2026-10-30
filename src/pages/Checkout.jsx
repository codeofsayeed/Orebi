import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { ordersApi } from "../services/api.js";

const FIELDS = [
  ["firstName", "First Name *", "First Name"],
  ["lastName", "Last Name *", "Last Name"],
  ["company", "Company Name (optional)", "Company Name"],
  ["country", "Country *", "Please select"],
  ["street", "Street Address *", "House number and street name"],
  ["street2", "", "Apartment, suite, unit etc. (optional)"],
  ["city", "Town/City *", "Town/City"],
  ["county", "County (optional)", "County"],
  ["postCode", "Post Code *", "Post Code"],
  ["phone", "Phone *", "Phone"],
  ["email", "Email Address *", "Email"],
];
const empty = Object.fromEntries(FIELDS.map(([k]) => [k, ""]));

export default function Checkout() {
  const { cart, total, clearCart, user } = useApp();
  const [f, setF] = useState({ ...empty, email: user?.email || "" });
  const [notes, setNotes] = useState("");
  const [bank, setBank] = useState("Bank");
  const [done, setDone] = useState(null);
  const [err, setErr] = useState("");

  if (done)
    return (
      <>
        <h1>Checkout</h1>
        <h2>Thank you!</h2>
        <p className="muted">
          Order <b>{done.id}</b> was placed (${done.total.toFixed(2)}).
        </p>
        <Link className="btn" to="/shop">
          Continue shopping
        </Link>
      </>
    );
  if (!cart.length)
    return (
      <>
        <h1>Checkout</h1>
        <p className="muted">
          Your cart is empty. <Link to="/shop">Go shopping</Link>
        </p>
      </>
    );

  const submit = async (e) => {
    e.preventDefault();
    const missing = [
      "firstName",
      "lastName",
      "street",
      "city",
      "postCode",
      "phone",
      "email",
    ].some((k) => !f[k]);
    if (missing) return setErr("Please fill in all required (*) fields");
    let order;
    try {
      order = await ordersApi.create({
        customer: `${f.firstName} ${f.lastName}`,
        total,
        payment: bank,
        notes,
        address: f,
        items: cart.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          qty: i.qty,
          price: i.product.price,
        })),
      });
    } catch {
      return setErr("Could not place your order. Please try again.");
    }
    clearCart();
    setDone(order);
  };

  return (
    <>
      <h1>Checkout</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Checkout</p>
      <p className="muted">
        Have a coupon? <b>Click here to enter your code</b>
      </p>
      <form onSubmit={submit}>
        <h2>Billing Details</h2>
        <div className="form two">
          {FIELDS.map(([k, label, ph]) => (
            <label
              key={k}
              className={
                [
                  "company",
                  "country",
                  "street",
                  "street2",
                  "city",
                  "county",
                  "postCode",
                  "phone",
                  "email",
                ].includes(k)
                  ? "full"
                  : ""
              }
            >
              {label}
              {k === "country" ? (
                <select
                  value={f.country}
                  onChange={(e) => setF({ ...f, country: e.target.value })}
                >
                  <option value="">{ph}</option>
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
              ) : (
                <input
                  value={f[k]}
                  onChange={(e) => setF({ ...f, [k]: e.target.value })}
                  placeholder={ph}
                />
              )}
            </label>
          ))}
        </div>
        <h2>Additional Information</h2>
        <div className="form">
          <label>
            Other Notes (optional)
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes about your order, e.g. special notes for delivery"
            />
          </label>
        </div>
        <h2>Your Order</h2>
        <table className="tbl small">
          <tbody>
            <tr>
              <th>Product</th>
              <th>Total</th>
            </tr>
            {cart.map((i) => (
              <tr key={i.product.id}>
                <td>
                  {i.product.name} × {i.qty}
                </td>
                <td>${(i.product.price * i.qty).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <th>Subtotal</th>
              <td>${total.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Total</th>
              <td>
                <b>${total.toFixed(2)}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pay">
          {["Bank", "Bank 2"].map((b) => (
            <label key={b}>
              <input
                type="radio"
                name="bank"
                checked={bank === b}
                onChange={() => setBank(b)}
              />{" "}
              {b}
            </label>
          ))}
          <p className="note">
            Pay via Bank; you can pay with your credit card if you don't have a
            bank account.
          </p>
          <p className="muted">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our privacy policy.
          </p>
          {err && <p className="err">{err}</p>}
          <button className="btn">Proceed to Bank</button>
        </div>
      </form>
    </>
  );
}
