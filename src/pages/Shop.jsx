import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { COLORS } from "../services/colors.js";

/* ============ EDIT THE FILTER LISTS HERE ============ */
const CATEGORIES = [
  "Category 1",
  "Category 2",
  "Category 3",
  "Category 4",
  "Category 5",
];
// Categories listed here get a "+" button that opens sub-categories (products need a matching `sub` value).
const SUBCATS = {
  "Category 1": ["Type A", "Type B"],
  "Category 3": ["Type A", "Type B"],
};
// Colours: edit src/services/colors.js
const BRANDS = ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"];
const PRICES = [
  [0, 9.99],
  [10, 19.99],
  [20, 29.99],
  [30, 39.99],
  [40, 69.99],
]; // [from, to]
/* ===================================================== */

const Plus = ({ open }) => (
  <svg width="10" height="10" viewBox="0 0 10 10">
    <path
      d={open ? "M0 5h10" : "M5 0v10M0 5h10"}
      stroke="#767676"
      strokeWidth="1.3"
    />
  </svg>
);
const usd = (n) => `$${n.toFixed(2)}`;

export default function Shop() {
  const [all, setAll] = useState([]);
  const [sp] = useSearchParams();
  const [f, setF] = useState({
    category: sp.get("category") || "",
    sub: "",
    color: "",
    brand: "",
    price: null,
  });
  const [open, setOpen] = useState({ color: true, brand: true }); // which collapsible groups are open
  const [subOpen, setSubOpen] = useState({});
  const [sort, setSort] = useState("featured");
  const [per, setPer] = useState(12);
  const [page, setPage] = useState(1);
  const q = (sp.get("q") || "").toLowerCase();

  useEffect(() => {
    productsApi.list().then(setAll);
  }, []);
  useEffect(() => {
    setF((s) => ({ ...s, category: sp.get("category") || "", sub: "" }));
    setPage(1);
  }, [sp]);

  const shown = useMemo(() => {
    let r = all.filter(
      (p) =>
        (!f.category || p.category === f.category) &&
        (!f.sub || p.sub === f.sub) &&
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
  const any = f.category || f.sub || f.color || f.brand || f.price;

  const pick = (k, v) => {
    setF((s) => ({ ...s, [k]: s[k] === v ? (k === "price" ? null : "") : v }));
    setPage(1);
  };
  const pickCat = (c) => {
    setF((s) => ({ ...s, category: s.category === c ? "" : c, sub: "" }));
    setPage(1);
  };
  const pickSub = (c, sub) => {
    setF((s) => ({
      ...s,
      category: c,
      sub: s.sub === sub && s.category === c ? "" : sub,
    }));
    setPage(1);
  };
  const clear = () => {
    setF({ category: "", sub: "", color: "", brand: "", price: null });
    setPage(1);
  };

  const Title = ({ text, k }) =>
    k ? (
      <button
        className={`flt-title ${open[k] ? "" : "closed"}`}
        onClick={() => setOpen({ ...open, [k]: !open[k] })}
        aria-expanded={open[k]}
      >
        {text}
        <i className="flt-caret" />
      </button>
    ) : (
      <h5 className="flt-title">{text}</h5>
    );

  return (
    <>
      <h1>Products</h1>
      <p className="crumb">Home &nbsp;&gt;&nbsp; Products</p>
      <div className="shop">
        <aside className="flt">
          {any && (
            <button className="link ul flt-clear" onClick={clear}>
              Clear all filters
            </button>
          )}

          <div className="flt-group">
            <Title text="Shop by Category" />
            <div className="flt-list">
              {CATEGORIES.map((c) => (
                <div key={c}>
                  <div
                    className={`flt-row ${f.category === c && !f.sub ? "on" : ""}`}
                  >
                    <button className="flt-label" onClick={() => pickCat(c)}>
                      {c}
                    </button>
                    {SUBCATS[c] && (
                      <button
                        className="flt-plus"
                        aria-label={`Show ${c} sub-categories`}
                        onClick={() =>
                          setSubOpen({ ...subOpen, [c]: !subOpen[c] })
                        }
                      >
                        <Plus open={subOpen[c]} />
                      </button>
                    )}
                  </div>
                  {SUBCATS[c] && subOpen[c] && (
                    <div className="flt-sub">
                      {SUBCATS[c].map((s) => (
                        <button
                          key={s}
                          className={
                            f.category === c && f.sub === s ? "on" : ""
                          }
                          onClick={() => pickSub(c, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flt-group">
            <Title text="Shop by Color" k="color" />
            {open.color && (
              <div className="flt-list">
                {COLORS.map((c) => (
                  <div
                    key={c.name}
                    className={`flt-row ${f.color === c.name ? "on" : ""}`}
                  >
                    <button
                      className="flt-label"
                      onClick={() => pick("color", c.name)}
                    >
                      <i className="flt-dot" style={{ background: c.dot }} />
                      {c.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flt-group">
            <Title text="Shop by Brand" k="brand" />
            {open.brand && (
              <div className="flt-list">
                {BRANDS.map((b) => (
                  <div
                    key={b}
                    className={`flt-row ${f.brand === b ? "on" : ""}`}
                  >
                    <button
                      className="flt-label"
                      onClick={() => pick("brand", b)}
                    >
                      {b}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flt-group">
            <Title text="Shop by Price" />
            <div className="flt-list">
              {PRICES.map((r) => (
                <div
                  key={r[0]}
                  className={`flt-row ${f.price === r ? "on" : ""}`}
                >
                  <button
                    className="flt-label"
                    onClick={() => pick("price", r)}
                  >
                    {usd(r[0])} - {usd(r[1])}
                  </button>
                </div>
              ))}
            </div>
          </div>
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
          {!slice.length && (
            <p className="muted">No products match these filters.</p>
          )}
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
