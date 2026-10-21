import { useEffect, useState } from "react";
import { productsApi, IMAGE_OPTIONS } from "../services/api.js";
import Img from "../components/Img.jsx";
import { COLORS } from "../services/colors.js";
import { CATEGORIES, SUBCATS } from "../services/categories.js";
import { Confirm, Modal, Pager, money, useToast } from "./ui.jsx";

const PER = 8;
const blank = {
  name: "",
  price: "",
  stock: "",
  category: CATEGORIES[0],
  sub: "",
  color: "Black",
  brand: "Brand 1",
  tag: "",
  image: IMAGE_OPTIONS[0].value,
  description: "",
};

export default function AdminProducts() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(null); // { id, name, price, stock }
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blank);
  const [del, setDel] = useState(null);
  const load = () => productsApi.list().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const cats = [...new Set(items.map((p) => p.category))];
  let shown = items.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!q || p.name.toLowerCase().includes(q.toLowerCase())),
  );
  if (sort === "stock") shown = [...shown].sort((a, b) => a.stock - b.stock);
  if (sort === "low") shown = [...shown].sort((a, b) => a.price - b.price);
  if (sort === "high") shown = [...shown].sort((a, b) => b.price - a.price);
  const pages = Math.max(1, Math.ceil(shown.length / PER));
  const slice = shown.slice((page - 1) * PER, page * PER);

  const save = async () => {
    await productsApi.update(edit.id, {
      name: edit.name,
      price: +edit.price,
      stock: +edit.stock,
    });
    setEdit(null);
    toast("Product updated");
    load();
  };
  const add = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price)
      return toast("Name and price are required", "err");
    await productsApi.create({
      ...form,
      price: +form.price,
      stock: +form.stock || 0,
    });
    setAdding(false);
    setForm(blank);
    toast("Product added");
    load();
  };
  const remove = async () => {
    await productsApi.remove(del.id);
    setDel(null);
    toast("Product deleted");
    load();
  };
  const bump = async (p, n) => {
    await productsApi.update(p.id, { stock: Math.max(0, p.stock + n) });
    load();
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <div className="ph">
        <h2>Products</h2>
        <button className="btn" onClick={() => setAdding(true)}>
          + Add product
        </button>
      </div>
      <div className="toolbar">
        <input
          className="find"
          placeholder="Search products"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="stock">Stock: low first</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {slice.map((p) => {
            const ed = edit?.id === p.id;
            return (
              <tr key={p.id}>
                <td>
                  <div className="img thumb sm">
                    <Img src={p.image} alt="" />
                  </div>
                </td>
                <td>
                  {ed ? (
                    <input
                      value={edit.name}
                      onChange={(e) =>
                        setEdit({ ...edit, name: e.target.value })
                      }
                    />
                  ) : (
                    <>
                      {p.name}{" "}
                      {p.tag && <span className="badge pending">{p.tag}</span>}
                    </>
                  )}
                </td>
                <td>{p.category}</td>
                <td>
                  {ed ? (
                    <input
                      className="num"
                      type="number"
                      value={edit.price}
                      onChange={(e) =>
                        setEdit({ ...edit, price: e.target.value })
                      }
                    />
                  ) : (
                    money(p.price)
                  )}
                </td>
                <td>
                  {ed ? (
                    <input
                      className="num"
                      type="number"
                      value={edit.stock}
                      onChange={(e) =>
                        setEdit({ ...edit, stock: e.target.value })
                      }
                    />
                  ) : (
                    <span className="stepper">
                      <button onClick={() => bump(p, -1)}>-</button>
                      <b className={p.stock < 25 ? "warn" : ""}>{p.stock}</b>
                      <button onClick={() => bump(p, 1)}>+</button>
                    </span>
                  )}
                </td>
                <td className="acts">
                  {ed ? (
                    <>
                      <button className="link ul" onClick={save}>
                        Save
                      </button>
                      <button className="link" onClick={() => setEdit(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="link ul"
                        onClick={() =>
                          setEdit({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            stock: p.stock,
                          })
                        }
                      >
                        Edit
                      </button>
                      <button className="link" onClick={() => setDel(p)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {!slice.length && (
            <tr>
              <td colSpan="6" className="muted">
                No products match.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pager page={page} pages={pages} set={setPage} />

      {adding && (
        <Modal title="Add product" onClose={() => setAdding(false)} wide>
          <form className="form two" onSubmit={add}>
            <label>
              Name
              <input value={form.name} onChange={set("name")} />
            </label>
            <label>
              Price
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={set("price")}
              />
            </label>
            <label>
              Stock
              <input type="number" value={form.stock} onChange={set("stock")} />
            </label>
            <label>
              Tag
              <select value={form.tag} onChange={set("tag")}>
                <option value="">None</option>
                <option>New</option>
                <option>-10%</option>
                <option>-15%</option>
              </select>
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value, sub: "" })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Sub-category
              <select value={form.sub} onChange={set("sub")}>
                <option value="">None</option>
                {(SUBCATS[form.category] || []).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Color
              <select value={form.color} onChange={set("color")}>
                {COLORS.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              Brand
              <select value={form.brand} onChange={set("brand")}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>Brand {n}</option>
                ))}
              </select>
            </label>
            <label>
              Image
              <select value={form.image} onChange={set("image")}>
                {IMAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="full">
              Description
              <textarea
                rows="3"
                value={form.description}
                onChange={set("description")}
                placeholder="Short description shown on the product page"
              />
            </label>
            <div className="full preview">
              <div className="img thumb">
                <Img src={form.image} alt="" />
              </div>
              <button className="btn">Add product</button>
            </div>
          </form>
        </Modal>
      )}
      {del && (
        <Confirm
          text={`Delete "${del.name}"?`}
          onYes={remove}
          onNo={() => setDel(null)}
        />
      )}
    </>
  );
}
