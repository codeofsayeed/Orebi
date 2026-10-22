import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { ordersApi, messagesApi } from '../services/api.js'
import { ToastProvider, useToast } from './ui.jsx'

// Shows database errors (for example "permission denied") as a red notice.
function ErrorBridge() {
  const toast = useToast()
  useEffect(() => {
    const h = (e) => toast(e.detail, 'err')
    window.addEventListener('orebi-error', h)
    return () => window.removeEventListener('orebi-error', h)
  }, [toast])
  return null
}

export default function AdminLayout() {
  const { user, logout, authReady } = useApp()
  const loc = useLocation()
  const nav = useNavigate()
  const [badges, setBadges] = useState({ orders: 0, messages: 0 })
  const isAdmin = !!user && user.role === 'admin'
  useEffect(() => {
    if (!isAdmin) return
    Promise.all([ordersApi.list(), messagesApi.list()])
      .then(([o, m]) => setBadges({ orders: o.filter((x) => x.status === 'Pending').length, messages: m.filter((x) => !x.read).length }))
      .catch(() => {})
  }, [loc.pathname, isAdmin])
  if (!authReady) return <p className="muted" style={{ padding: 40 }}>Loading…</p>
  if (!isAdmin) return <Navigate to="/login" replace />
  const item = (to, label, n, end) => (<NavLink to={to} end={end}>{label}{n > 0 && <i className="count">{n}</i>}</NavLink>)
  return (
    <ToastProvider>
      <ErrorBridge />
      <div className="admin">
        <aside>
          <Link to="/" className="logo">OREBI</Link>
          {item('/admin', 'Dashboard', 0, true)}
          {item('/admin/orders', 'Orders', badges.orders)}
          {item('/admin/products', 'Products')}
          {item('/admin/messages', 'Messages', badges.messages)}
          {item('/admin/journal', 'Journal')}
          <div className="spacer" />
          <Link to="/">← Back to shop</Link>
          <button className="link" onClick={async () => { await logout(); nav('/') }}>Logout</button>
        </aside>
        <section><Outlet /></section>
      </div>
    </ToastProvider>
  )
}
