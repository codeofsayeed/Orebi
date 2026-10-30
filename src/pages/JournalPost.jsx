import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { postsApi } from "../services/api.js";
import Img from "../components/Img.jsx";
import NotFound from "./NotFound.jsx";
import { PostCard, fmt } from "./Journal.jsx";

export default function JournalPost() {
  const { id } = useParams();
  const [post, setPost] = useState(undefined);
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setPost(undefined);
    postsApi.get(id).then(setPost);
    postsApi
      .list({ published: true })
      .then((l) => setRelated(l.filter((p) => p.id !== id)));
  }, [id]);
  if (post === undefined) return <p className="muted">Loading…</p>;
  if (!post || !post.published) return <NotFound />;
  const more = [
    ...related.filter((p) => p.category === post.category),
    ...related.filter((p) => p.category !== post.category),
  ].slice(0, 3);
  const share = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <>
      <p className="crumb top">
        Home &nbsp;&gt;&nbsp; <Link to="/journal">Journal</Link>{" "}
        &nbsp;&gt;&nbsp; {post.category}
      </p>
      <article className="article">
        <div className="meta">
          <span>{post.category}</span>
          <span>{fmt(post.date)}</span>
        </div>
        <h1>{post.title}</h1>
        <div className="img wide">
          <Img src={post.image} alt={post.title} />
        </div>
        <div className="prose">
          {post.body.split("\n\n").map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
        <div className="share">
          <button className="btn light" onClick={share}>
            {copied ? "Link copied ✓" : "Share this article"}
          </button>
          <Link className="link ul" to="/journal">
            ← Back to Journal
          </Link>
        </div>
      </article>
      {!!more.length && (
        <>
          <h2>More from the Journal</h2>
          <div className="grid3 posts">
            {more.map((p) => (
              <PostCard key={p.id} p={p} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
