import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productsApi } from '../services/api.js'
import { useApp } from '../context/AppContext.jsx'
import Img from '../components/Img.jsx'
import { colorDot } from '../services/colors.js'
import NotFound from './NotFound.jsx'

const Acc = ({ title, children, start }) => {
  const [open, setOpen] = useState(!!start)
  return (<div className="acc"><button onClick={() => setOpen(!open)}>{title}<span>{open ? '−' : '+'}</span></button>{open && <div className="muted acc-body">{children}</div>}</div>)
}

export default function Product() {
  const { id } = useParams()
  const { addToCart } = useApp()
  const [p, setP] = useState(undefined)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('S')
  const [tab, setTab] = useState('desc')
  const [reviews, setReviews] = useState([{ name: 'John Ford', date: '6 months ago', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }])
  const [rf, setRf] = useState({ name: '', email: '', text: '' })
  useEffect(() => { setP(undefined); productsApi.get(id).then(setP) }, [id])
  if (p === undefined) return <p className="muted">Loading…</p>
  if (!p) return <NotFound />
  const gallery = p.gallery?.length > 1 ? p.gallery : [p.image]
  const postReview = (e) => { e.preventDefault(); if (!rf.name || !rf.text) return; setReviews([{ name: rf.name, date: 'just now', text: rf.text }, ...reviews]); setRf({ name: '', email: '', text: '' }) }

  return (
    <>
      <h1>Products</h1><p className="crumb">Home &nbsp;&gt;&nbsp; Products</p>
      <div className="detail">
        <div className="gal">{gallery.map((g, i) => <div className="img" key={i}><Img src={g} alt={p.name} /></div>)}</div>
        <div className="info-col">
          <h2 className="t">{p.name}</h2>
          <div className="stars">★★★★★ <span className="muted">{reviews.length} Review{reviews.length > 1 ? 's' : ''}</span></div>
          <div className="price">{p.oldPrice && <s>${p.oldPrice.toFixed(2)}</s>} <b>${p.price.toFixed(2)}</b></div>
          <hr />
          <div className="opt"><span>COLOR:</span><i className="sw" style={{ background: colorDot(p.color) }} /></div>
          <div className="opt"><span>SIZE:</span><select value={size} onChange={(e) => setSize(e.target.value)}>{['S', 'M', 'L', 'XL'].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="opt"><span>QUANTITY:</span><div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))}>-</button><span>{qty}</span><button onClick={() => setQty(qty + 1)}>+</button></div></div>
          <hr />
          <p><b>STATUS:</b> &nbsp; {p.stock > 0 ? 'In stock' : 'Out of stock'}</p>
          <hr />
          <div className="btns"><button className="btn light">Add to Wish List</button><button className="btn" disabled={p.stock < 1} onClick={() => addToCart(p, qty)}>Add to Cart</button></div>
          <hr />
          <Acc title="FEATURES & DETAILS" start>{p.features?.length ? <ul>{p.features.map((x) => <li key={x}>{x}</li>)}</ul> : p.description}</Acc>
          <Acc title="SHIPPING & RETURNS"><p>Free shipping on every order. Not happy with it? Return it within 30 days of delivery for a refund.</p><p>Every product comes with a two-year warranty.</p></Acc>
        </div>
      </div>

      <div className="tabs"><button className={tab === 'desc' ? 'on' : ''} onClick={() => setTab('desc')}>Description</button><button className={tab === 'rev' ? 'on' : ''} onClick={() => setTab('rev')}>Reviews ({reviews.length})</button></div>
      {tab === 'desc' ? <p className="muted">{p.description}</p> : (
        <div>
          <p className="muted">{reviews.length} review{reviews.length > 1 ? 's' : ''} for Product</p>
          {reviews.map((r, i) => (<div className="review" key={i}><div className="row"><b>{r.name}</b><span>{r.date}</span></div><p className="muted">{r.text}</p></div>))}
          <h5>Add a Review</h5>
          <form className="form" onSubmit={postReview}>
            <label>Name<input value={rf.name} onChange={(e) => setRf({ ...rf, name: e.target.value })} placeholder="Your name here" /></label>
            <label>Email<input value={rf.email} onChange={(e) => setRf({ ...rf, email: e.target.value })} placeholder="Your email here" /></label>
            <label>Review<textarea rows="4" value={rf.text} onChange={(e) => setRf({ ...rf, text: e.target.value })} placeholder="Your review here" /></label>
            <button className="btn">Post</button>
          </form>
        </div>
      )}
    </>
  )
}
