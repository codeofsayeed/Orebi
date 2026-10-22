import { Link } from 'react-router-dom'

export default function About() {
  const block = (t) => (<div><h5 className="h36">{t}</h5><p className="muted">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p></div>)
  return (
    <>
      <h1>About</h1><p className="crumb">Home &nbsp;&gt;&nbsp; About</p>
      <div className="cta">
        <div className="cta-img" style={{ backgroundImage: 'url(/images/basket.png)' }}><Link className="btn white" to="/shop">Our Brands</Link></div>
        <div className="cta-img" style={{ backgroundImage: 'url(/images/desk-clock.png)' }}><Link className="btn white" to="/contact">Our Stores</Link></div>
      </div>
      <h3 className="lead">Orebi is one of the world's leading ecommerce brands and is internationally recognized for celebrating the essence of classic Worldwide cool looking.</h3>
      <div className="three">{block('Our Vision')}{block('Our Story')}{block('Our Brands')}</div>
    </>
  )
}
