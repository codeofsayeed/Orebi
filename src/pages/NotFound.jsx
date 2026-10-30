import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function NotFound() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  return (
    <div className="nf">
      <h1 className="huge">404</h1>
      <p className="lead2">The page you were looking for could not be found.</p>
      <form
        className="nfs"
        onSubmit={(e) => {
          e.preventDefault();
          nav(`/shop?q=${encodeURIComponent(q)}`);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type to search"
        />
        <button aria-label="search">🔍</button>
      </form>
      <Link className="btn" to="/">
        Back to Home
      </Link>
    </div>
  );
}
