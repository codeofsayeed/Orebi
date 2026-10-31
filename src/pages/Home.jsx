import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";

const pick = (items, names) =>
  names
    .map((n) => items.find((p) => p.image.endsWith(`/${n}.png`)))
    .filter(Boolean);
const Section = ({ title, items }) => (
  <section>
    <h2>{title}</h2>
    <div className="grid4">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  </section>
);

export default function Home() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    productsApi.list().then(setItems);
  }, []);
  return (
    <>
      <div
        className="hero"
        style={{ backgroundImage: "url(/images/hero.png)" }}
      >
        <div>
          <h1>
            Final
            <br />
            Offer
          </h1>
          <p className="muted">
            Up to <b className="big">50%</b> Sale for All Furniture Items!
          </p>
          <Link className="btn" to="/shop">
            Shop Now
          </Link>
        </div>
      </div>
      <div className="info">
        <span>✓ Two Years Warranty</span>
        <span>🚚 Free Shipping</span>
        <span>↺ Return Policy in 30 Days</span>
      </div>

      <div className="ads">
        <Link
          to="/shop"
          className="ad a1"
          style={{ backgroundImage: "url(/images/ad-1.png)" }}
          aria-label="Phones Sale"
        />
        <Link
          to="/shop"
          className="ad a2"
          style={{ backgroundImage: "url(/images/ad-2.png)" }}
          aria-label="Electronics Sale"
        />
        <Link
          to="/shop"
          className="ad a3"
          style={{ backgroundImage: "url(/images/ad-3.png)" }}
          aria-label="Furniture Offer"
        />
      </div>

      <Section
        title="New Arrivals"
        items={pick(items, [
          "desk-clock",
          "product-19",
          "product-16",
          "product-31",
        ])}
      />
      <Section
        title="Our Bestsellers"
        items={pick(items, ["product-27", "product-12", "bowl", "backpack"])}
      />

      <div className="banner">
        <div
          className="ph"
          style={{ backgroundImage: "url(/images/clock.png)" }}
        />
        <div>
          <h2>Clock of The Year</h2>
          <p className="muted">The Best Selling Clock in Our Shop Right Now.</p>
          <Link className="btn" to="/shop">
            Shop Now
          </Link>
        </div>
      </div>

      <Section
        title="Special Offers"
        items={pick(items, ["cap", "table", "headphones", "sunglasses"])}
      />
    </>
  );
}
