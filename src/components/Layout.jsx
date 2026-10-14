import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

function Header() {
  const { count, user, logout } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const search = (e) => {
    e.preventDefault();
    nav(`/shop?q=${encodeURIComponent(q)}`);
  };
  return (
    <header>
      <div className="top container">
        <Link to="/" className="logo">
          OREBI
        </Link>
        <nav className="menu">
          {[
            ["/", "Home"],
            ["/shop", "Shop"],
            ["/about", "About"],
            ["/contact", "Contacts"],
            ["/journal", "Journal"],
          ].map(([to, l]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => (isActive ? "on" : "")}
            >
              {l}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="bar">
        <div className="container bar-in">
          <Link to="/shop" className="cat">
            ☰ Shop by Category
          </Link>
          <form className="search" onSubmit={search}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Products"
            />
            <button aria-label="search">🔍</button>
          </form>
          <div className="icons">
            {user ? (
              <>
                {user.role === "admin" && <Link to="/admin">Dashboard</Link>}
                <Link to="/account">{user.name}</Link>
                <button className="link" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <Link to="/cart">🛒 {count}</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container foot">
        <div>
          <h6>MENU</h6>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/journal">Journal</Link>
        </div>
        <div>
          <h6>SHOP</h6>
          {[1, 2, 3, 4, 5].map((n) => (
            <Link key={n} to={`/shop?category=Category ${n}`}>
              Category {n}
            </Link>
          ))}
        </div>
        <div>
          <h6>HELP</h6>
          <a>Privacy Policy</a>
          <a>Terms &amp; Conditions</a>
          <a>Special E-shop</a>
          <a>Shipping</a>
          <a>Secure Payments</a>
        </div>
        <div>
          <b>
            (052) 611-5711
            <br />
            company@domain.com
          </b>
          <p>575 Crescent Ave. Quakertown, PA 18951</p>
        </div>
        <div className="logo">OREBI</div>
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
