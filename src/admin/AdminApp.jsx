import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Activity, CalendarDays, LayoutDashboard, LogOut, MessageSquareQuote, Plus, Trash2, Users, X } from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'

const navigation = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
  { label: 'Services', path: '/admin/services', icon: Activity },
  { label: 'Dentists', path: '/admin/dentists', icon: Users },
  { label: 'Reviews', path: '/admin/reviews', icon: MessageSquareQuote },
]

const resources = {
  '/admin/services': {
    title: 'Services',
    endpoint: '/admin/services',
    fields: [{ name: 'title', label: 'Service name', required: true }, { name: 'description', label: 'Description', type: 'textarea', required: true }, { name: 'icon', label: 'Lucide icon name' }, { name: 'image', label: 'Image URL' }],
    columns: ['title', 'description'],
  },
  '/admin/dentists': {
    title: 'Dentists',
    endpoint: '/admin/dentists',
    fields: [{ name: 'name', label: 'Name', required: true }, { name: 'role', label: 'Role', required: true }, { name: 'bio', label: 'Introduction', type: 'textarea', required: true }, { name: 'image', label: 'Image URL' }],
    columns: ['name', 'role', 'bio'],
  },
  '/admin/reviews': {
    title: 'Reviews',
    endpoint: '/admin/reviews',
    fields: [{ name: 'name', label: 'Patient display name', required: true }, { name: 'detail', label: 'Label' }, { name: 'quote', label: 'Review text', type: 'textarea', required: true }, { name: 'rating', label: 'Rating (1–5)', type: 'number' }],
    columns: ['name', 'quote', 'rating'],
  },
}

function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/admin/login', values)
      localStorage.setItem('smilecraft-admin-token', data.token)
      localStorage.setItem('smilecraft-admin-email', data.admin.email)
      navigate('/admin', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <Link className="brand" to="/"><span className="brand-mark" aria-hidden="true"><span /></span><span className="brand-name">smilecraft<span>.</span><small>DENTAL STUDIO</small></span></Link>
        <span className="eyebrow">STUDIO ADMINISTRATION</span>
        <h1>Welcome back.</h1>
        <p>Sign in to manage demo requests and practice content.</p>
        <label>Email address<input name="email" type="email" autoComplete="username" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        <small>Admin access is configured with backend environment variables.</small>
      </form>
    </main>
  )
}

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const identity = localStorage.getItem('smilecraft-admin-email') || 'Clinic administrator'

  useEffect(() => {
    if (!localStorage.getItem('smilecraft-admin-token')) navigate('/admin/login', { replace: true })
  }, [navigate])

  function signOut() {
    localStorage.removeItem('smilecraft-admin-token')
    localStorage.removeItem('smilecraft-admin-email')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" to="/"><span className="brand-mark" aria-hidden="true"><span /></span><span className="brand-name">smilecraft<span>.</span><small>ADMIN STUDIO</small></span></Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav aria-label="Admin navigation">{navigation.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} end={path === '/admin'}><Icon size={18} />{label}</NavLink>)}</nav>
        <div className="admin-sidebar-bottom"><span className="admin-avatar">{identity.slice(0, 1).toUpperCase() || 'A'}</span><span><strong>{identity || 'Administrator'}</strong><small>SmileCraft demo</small></span><button type="button" onClick={signOut} aria-label="Sign out"><LogOut size={17} /></button></div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar"><div><span className="eyebrow">SMILECRAFT DENTAL STUDIO</span><strong>{navigation.find((item) => item.path === location.pathname)?.label || 'Dashboard'}</strong></div><Link to="/" target="_blank" rel="noreferrer">View website ↗</Link></header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  )
}

function AdminWorkspace() {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [summary, setSummary] = useState(null)
  const [loadedPath, setLoadedPath] = useState('')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const pathname = location.pathname === '/admin/' ? '/admin' : location.pathname
  const config = resources[pathname]
  const isAppointments = pathname === '/admin/appointments'
  const isOverview = pathname === '/admin'
  const endpoint = config?.endpoint

  const load = useCallback(async () => {
    try {
      const { data: response } = await api.get(isOverview ? '/admin/dashboard' : isAppointments ? '/admin/appointments' : endpoint)
      if (isOverview) setSummary(response)
      else setData(response)
      setError('')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      if (requestError.response?.status === 401) {
        localStorage.removeItem('smilecraft-admin-token')
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoadedPath(pathname)
    }
  }, [endpoint, isAppointments, isOverview, navigate, pathname])

  useEffect(() => {
    const timer = window.setTimeout(() => { load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function removeRecord(id) {
    if (!window.confirm('Delete this record? This cannot be undone.')) return
    try {
      await api.delete(`${isAppointments ? '/admin/appointments' : config.endpoint}/${id}`)
      await load()
    } catch (requestError) { setError(getErrorMessage(requestError)) }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/admin/appointments/${id}`, { status })
      await load()
    } catch (requestError) { setError(getErrorMessage(requestError)) }
  }

  async function saveRecord(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    if (values.rating) values.rating = Number(values.rating)
    if (config.title === 'Reviews') values.published = form.elements.published.checked
    if (editing.uploadedImage) values.image = editing.image
    setSaving(true)
    setFormError('')
    try {
      const url = `${config.endpoint}${editing?._id ? `/${editing._id}` : ''}`
      await api[editing?._id ? 'put' : 'post'](url, values)
      setEditing(null)
      await load()
    } catch (requestError) { setFormError(getErrorMessage(requestError)) }
    finally { setSaving(false) }
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const body = new FormData()
    body.append('image', file)
    try {
      const { data: result } = await api.post('/admin/uploads', body)
      const base = (api.defaults.baseURL || '/api').replace(/\/api\/?$/, '')
      const imageUrl = result.url.startsWith('http') ? result.url : `${base}${result.url}`
      setEditing((current) => ({ ...current, image: imageUrl, uploadedImage: true }))
    } catch (requestError) { setFormError(getErrorMessage(requestError)) }
  }

  if (loadedPath !== pathname) return <div className="admin-loading"><span className="loading-spinner" /> Loading workspace…</div>

  return (
    <>
      <div className="admin-page-heading"><div><span className="eyebrow">YOUR PRACTICE, AT A GLANCE</span><h1>{isOverview ? 'Good morning.' : isAppointments ? 'Appointment requests' : config?.title}</h1><p>{isOverview ? 'Manage requests and keep your practice information current.' : 'Review and update your website content.'}</p></div>{config && <button className="button button-primary" type="button" onClick={() => { setFormError(''); setEditing({ rating: 5, published: true }) }}><Plus size={17} /> Add {config.title.slice(0, -1)}</button>}</div>
      {error && <div className="admin-error" role="alert">{error}<button type="button" onClick={load}>Try again</button></div>}
      {isOverview && summary && <><div className="admin-stats">{[['All requests', summary.totalAppointments], ['Pending', summary.pendingAppointments], ['Confirmed', summary.confirmedAppointments]].map(([label, count]) => <article key={label}><span>{label}</span><strong>{count}</strong><small>Appointment inquiries</small></article>)}</div><section className="admin-panel"><div className="admin-panel-heading"><h2>Recent appointment requests</h2><Link to="/admin/appointments">View all →</Link></div><AppointmentTable rows={summary.recentAppointments} onStatus={updateStatus} onDelete={removeRecord} /></section></>}
      {isAppointments && <section className="admin-panel"><AppointmentTable rows={data} onStatus={updateStatus} onDelete={removeRecord} emptyText="No appointment requests yet." /></section>}
      {config && <section className="admin-panel"><div className="admin-panel-heading"><h2>{data.length} {config.title.toLowerCase()}</h2></div>{data.length === 0 ? <div className="admin-empty">Nothing here yet. Use “Add” to create your first item.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{config.columns.map((field) => <th key={field}>{field}</th>)}<th>Actions</th></tr></thead><tbody>{data.map((row) => <tr key={row._id}>{config.columns.map((field) => <td key={field}>{String(row[field] ?? '').slice(0, 110)}</td>)}<td><div className="admin-row-actions"><button type="button" onClick={() => { setFormError(''); setEditing({ ...row }) }}>Edit</button><button type="button" aria-label="Delete record" onClick={() => removeRecord(row._id)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}</section>}
      {editing && config && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null) }}><form className="admin-edit-modal" onSubmit={saveRecord}><button className="admin-modal-close" type="button" onClick={() => setEditing(null)} aria-label="Close"><X size={20} /></button><span className="eyebrow">{editing._id ? 'UPDATE' : 'CREATE'} {config.title.toUpperCase()}</span><h2>{editing._id ? 'Edit record' : `Add ${config.title.slice(0, -1).toLowerCase()}`}</h2>{config.fields.map((field) => <label key={field.name}>{field.label}{field.type === 'textarea' ? <textarea name={field.name} defaultValue={editing[field.name] || ''} required={field.required} rows="4" maxLength="1500" /> : <input name={field.name} type={field.type || 'text'} defaultValue={editing[field.name] ?? (field.name === 'rating' ? 5 : '')} required={field.required} min={field.type === 'number' ? 1 : undefined} max={field.type === 'number' ? 5 : undefined} />}</label>)}{config.title === 'Reviews' && <label className="admin-checkbox"><input type="checkbox" name="published" defaultChecked={editing.published !== false} /> Show this sample review on the website</label>}{['Services', 'Dentists'].includes(config.title) && <label>Upload a JPG, PNG, or WebP image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} /></label>}{formError && <p className="form-error" role="alert">{formError}</p>}<div className="admin-modal-actions"><button type="button" onClick={() => setEditing(null)}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div></form></div>}
    </>
  )
}

function AppointmentTable({ rows = [], onStatus, onDelete, emptyText = 'No recent appointment requests.' }) {
  if (!rows.length) return <div className="admin-empty">{emptyText}</div>
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Patient</th><th>Service</th><th>Preferred date</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row._id}><td><strong>{row.name}</strong><small>{row.email}<br />{row.phone}</small></td><td>{row.service}</td><td>{new Date(row.preferredDate).toLocaleDateString()}</td><td>{new Date(row.createdAt).toLocaleDateString()}</td><td><select className={`status-select status-${row.status}`} value={row.status} onChange={(event) => onStatus(row._id, event.target.value)} aria-label={`Set status for ${row.name}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td><td><button className="admin-delete-button" type="button" onClick={() => onDelete(row._id)} aria-label={`Delete request from ${row.name}`}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={localStorage.getItem('smilecraft-admin-token') ? <Navigate to="/admin" replace /> : <AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route index element={<AdminWorkspace />} />
        <Route path="appointments" element={<AdminWorkspace />} />
        <Route path="services" element={<AdminWorkspace />} />
        <Route path="dentists" element={<AdminWorkspace />} />
        <Route path="reviews" element={<AdminWorkspace />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
