import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, role, loading, logout } = useAuth()
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  if (role !== 'admin') {
    const uuid = user.id
    const sql = `INSERT INTO public.profiles (id, role)\nVALUES ('${uuid}', 'admin')\nON CONFLICT (id) DO UPDATE SET role = 'admin';`

    function copySQL() {
      navigator.clipboard.writeText(sql).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }

    return (
      <div className="admin-loading" style={{ padding: '2rem', maxWidth: 600, margin: '4rem auto', lineHeight: 1.6 }}>
        <h2 style={{ marginBottom: '1rem' }}>Admin role required</h2>
        <p style={{ marginBottom: '0.5rem' }}>You are logged in as <strong>{user.email}</strong> but your account does not have the <code>admin</code> role yet.</p>
        <p style={{ marginBottom: '1rem' }}>Run the following SQL in your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Supabase SQL Editor</a>, then refresh this page:</p>
        <pre style={{ background: 'var(--bg-secondary, #111)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', fontSize: '0.85rem', overflowX: 'auto', marginBottom: '1rem' }}>{sql}</pre>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-primary" onClick={copySQL}>
            {copied ? 'Copied!' : 'Copy SQL'}
          </button>
          <button className="admin-btn admin-btn-outline" onClick={() => window.location.reload()}>
            Refresh
          </button>
          <button className="admin-btn admin-btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-inner">
          <a href="/admin/dashboard" className="admin-logo">
            Portfolio Admin
          </a>
          <nav className="admin-nav">
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/users">Users</a>
            <a href="/admin/change-password">Change Password</a>
            <button onClick={logout} className="admin-btn admin-btn-outline admin-btn-sm">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
