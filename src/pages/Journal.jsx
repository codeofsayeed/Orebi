import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postsApi } from "../services/api.js";
import Img from "../components/Img.jsx";

export const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function PostCard({ p }) {
  return (
    <Link to={`/journal/${p.id}`} className="post">
      <div className="img">
        <Img src={p.image} alt={p.title} />
      </div>
      <div className="meta">
        <span>{p.category}</span>
        <span>{fmt(p.date)}</span>
      </div>
      <h5>{p.title}</h5>
      <p className="muted">{p.excerpt}</p>
      <b className="more">Read more →</b>
    </Link>
  );
}

export default function Journal() {
  const [posts, setPosts] = useState([]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [n, setN] = useState(6);
  useEffect(() => {
    postsApi.list({ published: true }).then(setPosts);
  }, []);
  const cats = ["All", ...new Set(posts.map((p) => p.category))];
  const shown = posts.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (!q || (p.title + p.excerpt).toLowerCase().includes(q.toLowerCase())),
  );
  const [first, ...rest] = shown;
  return (
    <>
      <h1>Journal</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Journal</p>
      <div className="jtools">
        <div className="chips">
          {cats.map((c) => (
            <button
              key={c}
              className={cat === c ? "on" : ""}
              onClick={() => {
                setCat(c);
                setN(6);
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="search small">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setN(6);
            }}
            placeholder="Search Articles"
          />
        </div>
      </div>
      {!shown.length && <p className="muted">No articles found.</p>}
      {first && (
        <Link to={`/journal/${first.id}`} className="featured">
          <div className="img">
            <Img src={first.image} alt={first.title} />
          </div>
          <div>
            <div className="meta">
              <span>{first.category}</span>
              <span>{fmt(first.date)}</span>
            </div>
            <h2>{first.title}</h2>
            <p className="muted">{first.excerpt}</p>
            <span className="btn">Read Article</span>
          </div>
        </Link>
      )}
      <div className="grid3 posts">
        {rest.slice(0, n).map((p) => (
          <PostCard key={p.id} p={p} />
        ))}
      </div>
      {rest.length > n && (
        <div className="center">
          <button className="btn light" onClick={() => setN(n + 3)}>
            Load more
          </button>
        </div>
      )}
    </>
  );
}
