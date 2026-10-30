import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Img from "./Img.jsx";
import { settingsApi } from "../services/api.js";

/* ---- edit these lists to change the menus ---- */
const MENU = [
  ["/", "Home"],
  ["/shop", "Shop"],
  ["/about", "About"],
  ["/contact", "Contacts"],
  ["/journal", "Journal"],
];
const CATS = [
  ["Accessories", "Accessories"],
  ["Furniture", "Furniture"],
  ["Electronics", "Electronics"],
  ["Bags", "Bags"],
  ["Home & Living", "Home & Living"],
]; // [label shown, category it opens]
const HELP = [
  "Privacy Policy",
  "Terms & Conditions",
  "Special E-shop",
  "Shipping",
  "Secure Payments",
];
const money = (v) => `$${Number(v).toFixed(2)}`;
const C = "#262626";

/* ---- icons ---- */
const MenuIcon = () => (
  <svg width="19" height="10" viewBox="0 0 19 10">
    <rect width="19" height="3" rx="1.5" fill={C} />
    <rect y="7" width="13" height="3" rx="1.5" fill={C} />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke={C}
    strokeWidth="2"
  >
    <circle cx="6.5" cy="6.5" r="5" />
    <path d="M10.5 10.5L15 15" strokeLinecap="round" />
  </svg>
);
const UserIcon = () => (
  <svg width="33" height="16" viewBox="0 0 33 16">
    <circle cx="7" cy="4" r="3.6" fill={C} />
    <path d="M0 15c0-4 3-6 7-6s7 2 7 6z" fill={C} />
    <path d="M21 6.5h8l-4 4z" fill={C} />
  </svg>
);
const CartIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill={C}>
    <path d="M0 0h3.2l.6 2H18l-2 7H5.6l.4 1.6h10v1.8H4.6L2 1.8H0z" />
    <circle cx="6" cy="14.4" r="1.6" />
    <circle cx="14" cy="14.4" r="1.6" />
  </svg>
);
const Facebook = () => (
  <svg width="9" height="16" viewBox="0 0 9 16">
    <path
      d="M6 16V9h2.3l.4-2.8H6V4.5c0-.8.3-1.3 1.4-1.3H9V.7C8.7.6 7.8.5 6.8.5 4.6.5 3.2 1.8 3.2 4.2v2H.8V9h2.4v7z"
      fill={C}
    />
  </svg>
);
const Linkedin = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={C}>
    <rect x=".5" y="5.5" width="3" height="10" />
    <circle cx="2" cy="2" r="1.8" />
    <path d="M6 5.5h2.8v1.4C9.4 5.9 10.5 5.3 12 5.3c3 0 3.5 2 3.5 4.5v5.7h-3v-5.1c0-1.2 0-2.6-1.6-2.6S9 9.1 9 10.3v5.2H6z" />
  </svg>
);
const Instagram = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke={C}
    strokeWidth="1.6"
  >
    <rect x="1" y="1" width="14" height="14" rx="4" />
    <circle cx="8" cy="8" r="3.3" />
    <circle cx="12" cy="4" r=".6" fill={C} />
  </svg>
);

// Footer social icons: [settings key, label, icon]. The links come from Admin > Settings.
const SOCIALS = [
  ["facebook", "Facebook", Facebook],
  ["linkedin", "LinkedIn", Linkedin],
  ["instagram", "Instagram", Instagram],
];
const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : ""); // only real web links, never javascript:

function Header() {
  const { cart, count, total, user, logout, removeFromCart } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const ref = useRef(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null); // 'cat' | 'user' | 'cart' | null

  useEffect(() => setOpen(null), [loc.pathname, loc.search]);
  useEffect(() => {
    const away = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);
  const toggle = (k) => setOpen((o) => (o === k ? null : k));
  const search = (e) => {
    e.preventDefault();
    nav(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="hd" ref={ref}>
      <div className="hd-top">
        <div className="container hd-top-in">
          <Link to="/" className="hd-logo">
            OREBI
          </Link>
          <nav className="hd-menu">
            {MENU.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => (isActive ? "on" : "")}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="hd-bar">
        <div className="container hd-bar-in">
          <button className="hd-cat" onClick={() => toggle("cat")}>
            <MenuIcon />
            <span>Shop by Category</span>
          </button>

          <form className="hd-search" onSubmit={search}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Products"
            />
            <button aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          <div className="hd-right">
            <button
              className="hd-ic"
              aria-label="My account"
              onClick={() => toggle("user")}
            >
              <UserIcon />
            </button>
            <button
              className="hd-ic"
              aria-label="Cart"
              onClick={() => toggle("cart")}
            >
              <CartIcon />
              {count > 0 && <i>{count}</i>}
            </button>
          </div>

          {open === "cat" && (
            <div className="hd-pop hd-cats">
              {CATS.map(([label, c]) => (
                <Link
                  key={label}
                  to={c ? `/shop?category=${encodeURIComponent(c)}` : "/shop"}
                >
                  <span>{label}</span>
                  <i>›</i>
                </Link>
              ))}
            </div>
          )}

          {open === "user" && (
            <div className="hd-pop hd-acct">
              {user ? (
                <>
                  <Link className="dark" to="/account">
                    My Account
                  </Link>
                  {user.role === "admin" && <Link to="/admin">Dashboard</Link>}
                  <button
                    onClick={() => {
                      logout();
                      setOpen(null);
                      nav("/");
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link className="dark" to="/login">
                    Login
                  </Link>
                  <Link to="/signup">Sign up</Link>
                </>
              )}
            </div>
          )}

          {open === "cart" && (
            <div className="hd-pop hd-cart">
              <div className="hd-cart-top">
                {cart.length ? (
                  cart.map(({ product: p, qty }) => (
                    <div className="hd-ci" key={p.id}>
                      <div className="hd-ciimg">
                        <Img src={p.image} alt="" />
                      </div>
                      <div>
                        <b>{p.name}</b>
                        <b>
                          {money(p.price)}
                          {qty > 1 ? ` × ${qty}` : ""}
                        </b>
                      </div>
                      <button
                        onClick={() => removeFromCart(p.id)}
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="hd-empty">Your cart is empty</p>
                )}
              </div>
              <div className="hd-cart-bot">
                <p>
                  Subtotal: <b>{money(total)}</b>
                </p>
                <div className="hd-btns">
                  <Link className="hd-b out" to="/cart">
                    View Cart
                  </Link>
                  <Link className="hd-b" to="/checkout">
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const [social, setSocial] = useState({});
  useEffect(() => {
    settingsApi.get().then(setSocial);
  }, []);
  return (
    <footer className="ft">
      <div className="container">
        <div className="ft-cols">
          <div>
            <h6>MENU</h6>
            {[
              ["/", "Home"],
              ["/shop", "Shop"],
              ["/about", "About"],
              ["/contact", "Contact"],
              ["/journal", "Journal"],
            ].map(([to, l]) => (
              <Link key={l} to={to}>
                {l}
              </Link>
            ))}
          </div>
          <div>
            <h6>SHOP</h6>
            {CATS.map(([label, c]) => (
              <Link key={label} to={`/shop?category=${encodeURIComponent(c)}`}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h6>HELP</h6>
            {HELP.map((t) => (
              <a key={t}>{t}</a>
            ))}
          </div>
          <div className="ft-contact">
            <b>
              (052) 611-5711
              <br />
              company@domain.com
            </b>
            <p>575 Crescent Ave. Quakertown, PA 18951</p>
          </div>
          <div>
            <Link to="/" className="ft-logo">
              OREBI
            </Link>
          </div>
        </div>
        <div className="ft-bottom">
          <div className="ft-social">
            {SOCIALS.map(
              ([k, label, Icon]) =>
                safeUrl(social[k]) && (
                  <a
                    key={k}
                    href={safeUrl(social[k])}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ),
            )}
          </div>
          <span>2026 Orebi Minimal eCommerce Figma Template by Adveits</span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container page">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
