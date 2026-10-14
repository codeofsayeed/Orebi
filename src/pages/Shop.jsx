import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";

const PRICES = [
  [0, 9.99],
  [10, 19.99],
  [20, 29.99],
  [30, 39.99],
  [40, 69.99],
];

export default function Shop() {
  const [all, setAll] = useState([]);
  const [sp] = useSearchParams();
  const [f, setF] = useState({
    category: sp.get("category") || "",
    color: "",
    brand: "",
    price: null,
  });
  const [sort, setSort] = useState("featured");
  const [per, setPer] = useState(12);
  const [page, setPage] = useState(1);
  const q = (sp.get("q") || "").toLowerCase();

  useEffect(() => {
    productsApi.list().then(setAll);
  }, []);
  const uniq = (k) => [...new Set(all.map((p) => p[k]))];

  const shown = useMemo(() => {
    let r = all.filter(
      (p) =>
        (!f.category || p.category === f.category) &&
        (!f.color || p.color === f.color) &&
        (!f.brand || p.brand === f.brand) &&
        (!f.price || (p.price >= f.price[0] && p.price <= f.price[1])) &&
        (!q || p.name.toLowerCase().includes(q)),
    );
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [all, f, sort, q]);

  const pages = Math.max(1, Math.ceil(shown.length / per));
  const slice = shown.slice((page - 1) * per, page * per);
  const set = (k, v) => {
    setF((s) => ({ ...s, [k]: s[k] === v ? (k === "price" ? null : "") : v }));
    setPage(1);
  };

  const Group = ({ title, k, vals }) => (
    <div className="fgroup">
      <h5>{title}</h5>
      {vals.map((v) => (
        <button
          key={String(v)}
          className={f[k] === v ? "on" : ""}
          onClick={() => set(k, v)}
        >
          {k === "price" ? `$${v[0].toFixed(2)} - $${v[1].toFixed(2)}` : v}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <h1>Products</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Products</p>
      <div className="shop">
        <aside>
          <Group
            title="Shop by Category"
            k="category"
            vals={uniq("category")}
          />
          <Group title="Shop by Color" k="color" vals={uniq("color")} />
          <Group title="Shop by Brand" k="brand" vals={uniq("brand")} />
          <Group title="Shop by Price" k="price" vals={PRICES} />
        </aside>
        <div>
          <div className="tools">
            <label>
              Sort by:{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
            <label>
              Show:{" "}
              <select
                value={per}
                onChange={(e) => {
                  setPer(+e.target.value);
                  setPage(1);
                }}
              >
                {[12, 24, 36].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid3">
            {slice.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          {!slice.length && <p className="muted">No products match.</p>}
          <div className="pager">
            <div>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  className={page === i + 1 ? "on" : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <span className="muted">
              Products from {shown.length ? (page - 1) * per + 1 : 0} to{" "}
              {Math.min(page * per, shown.length)} of {shown.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
