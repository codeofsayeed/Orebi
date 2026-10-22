import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Img from './Img.jsx'

export default function ProductCard({ p }) {
  const { addToCart } = useApp()
  return (
    <div className="card">
      <Link to={`/product/${p.id}`} className="img">
        <Img src={p.image} alt={p.name} />
        {p.tag && <span className="tag">{p.tag}</span>}
      </Link>
      <div className="hover">
        <button>Add to Wish List ♡</button>
        <button>Compare ⇄</button>
        <button className="b" onClick={() => addToCart(p)}>Add to Cart 🛒</button>
      </div>
      <div className="row"><h5>{p.name}</h5><span>${p.price.toFixed(2)}</span></div>
      <div className="muted">{p.color}</div>
    </div>
  )
}
