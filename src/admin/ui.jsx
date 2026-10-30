import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const T = createContext(() => {});
export const useToast = () => useContext(T);
export const dayStr = (n) =>
  new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
export const money = (v) => `$${Number(v).toFixed(2)}`;

export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const push = useCallback((msg, type = "ok") => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, msg, type }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 2600);
  }, []);
  return (
    <T.Provider value={push}>
      {children}
      <div className="toasts">
        {list.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </T.Provider>
  );
}

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div
        className={`modal ${wide ? "wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mh">
          <h5>{title}</h5>
          <button className="link" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Confirm({ text, onYes, onNo }) {
  return (
    <Modal title="Are you sure?" onClose={onNo}>
      <p className="muted">{text}</p>
      <div className="btns">
        <button className="btn light" onClick={onNo}>
          Cancel
        </button>
        <button className="btn danger" onClick={onYes}>
          Delete
        </button>
      </div>
    </Modal>
  );
}

export const Badge = ({ status }) => (
  <span className={`badge ${status.toLowerCase()}`}>{status}</span>
);

export function Pager({ page, pages, set }) {
  if (pages <= 1) return null;
  return (
    <div className="pager admin-pager">
      <div>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "on" : ""}
            onClick={() => set(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
