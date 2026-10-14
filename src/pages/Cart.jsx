import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Img from "../components/Img.jsx";

export default function Cart() {
  const { cart, setQty, removeFromCart, clearCart, total } = useApp();
  return (
    <>
      <h1>Cart</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Cart</p>
      {!cart.length ? (
        <p className="muted">
          Your cart is empty. <Link to="/shop">Go shopping</Link>
        </p>
      ) : (
        <>
          <table className="tbl">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(({ product: p, qty }) => (
                <tr key={p.id}>
                  <td className="prod">
                    <button
                      className="link"
                      onClick={() => removeFromCart(p.id)}
                    >
                      ✕
                    </button>
                    <div className="img thumb">
                      <Img src={p.image} alt={p.name} />
                    </div>
                    <Link to={`/product/${p.id}`}>
                      <b>{p.name}</b>
                    </Link>
                  </td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <div className="qty">
                      <button onClick={() => setQty(p.id, qty - 1)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => setQty(p.id, qty + 1)}>+</button>
                    </div>
                  </td>
                  <td>${(p.price * qty).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="foot-row">
                <td colSpan="4">
                  <div className="coupon">
                    <input placeholder="Coupon code" />
                    <button className="link">Apply coupon</button>
                  </div>
                  <button className="link right" onClick={clearCart}>
                    Clear cart
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="totals">
            <h5>Cart totals</h5>
            <div>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div>
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>
            <Link className="btn" to="/checkout">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </>
  );
}
