import { useEffect, useState } from "react";
import { postsApi, JOURNAL_IMAGES } from "../services/api.js";
import Img from "../components/Img.jsx";
import { Confirm, Modal, useToast } from "./ui.jsx";

const blank = {
  title: "",
  category: "Style",
  image: JOURNAL_IMAGES[0].value,
  excerpt: "",
  body: "",
  published: true,
};

export default function AdminJournal() {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(null); // null = closed
  const [del, setDel] = useState(null);
  const load = () => postsApi.list().then(setPosts);
  useEffect(() => {
    load();
  }, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body)
      return toast("Title and article text are required", "err");
    if (form.id) {
      await postsApi.update(form.id, form);
      toast("Article updated");
    } else {
      await postsApi.create(form);
      toast("Article created");
    }
    setForm(null);
    load();
  };
  const togglePub = async (p) => {
    await postsApi.update(p.id, { published: !p.published });
    toast(p.published ? "Moved to drafts" : "Published");
    load();
  };
  const remove = async () => {
    await postsApi.remove(del.id);
    setDel(null);
    toast("Article deleted");
    load();
  };
  return (
    <>
      <div className="ph">
        <h2>Journal</h2>
        <button className="btn" onClick={() => setForm(blank)}>
          + New article
        </button>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th />
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="img thumb sm">
                  <Img src={p.image} alt="" />
                </div>
              </td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.date}</td>
              <td>
                <button
                  className={`badge ${p.published ? "delivered" : "pending"} btn-badge`}
                  onClick={() => togglePub(p)}
                  title="Click to toggle"
                >
                  {p.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="acts">
                <button className="link ul" onClick={() => setForm(p)}>
                  Edit
                </button>
                <button className="link" onClick={() => setDel(p)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {form && (
        <Modal
          title={form.id ? "Edit article" : "New article"}
          onClose={() => setForm(null)}
          wide
        >
          <form className="form two" onSubmit={save}>
            <label className="full">
              Title
              <input value={form.title} onChange={set("title")} />
            </label>
            <label>
              Category
              <select value={form.category} onChange={set("category")}>
                {["Style", "Home", "Tech", "Guides"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Image
              <select value={form.image} onChange={set("image")}>
                {JOURNAL_IMAGES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="full">
              Short summary
              <input value={form.excerpt} onChange={set("excerpt")} />
            </label>
            <label className="full">
              Article text (blank line between paragraphs)
              <textarea rows="7" value={form.body} onChange={set("body")} />
            </label>
            <div className="full preview">
              <div className="img thumb">
                <Img src={form.image} alt="" />
              </div>
              <label className="chk">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm({ ...form, published: e.target.checked })
                  }
                />{" "}
                Published
              </label>
              <button className="btn">
                {form.id ? "Save changes" : "Create article"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {del && (
        <Confirm
          text={`Delete "${del.title}"?`}
          onYes={remove}
          onNo={() => setDel(null)}
        />
      )}
    </>
  );
}
