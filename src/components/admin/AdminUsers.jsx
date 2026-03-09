import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminCreateUser, adminDeleteUser, getUsers, updateUser } from '../../lib/api'

const DEFAULT_PERMISSIONS = {
  blogs: { create: false, edit: false, delete: false },
  projects: { create: false, edit: false, delete: false },
}

const FULL_PERMISSIONS = {
  blogs: { create: true, edit: true, delete: true },
  projects: { create: true, edit: true, delete: true },
}

function blankForm() {
  return {
    email: '',
    password: '',
    display_name: '',
    role: 'viewer',
    permissions: structuredClone(DEFAULT_PERMISSIONS),
  }
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null) // 'add' | 'edit' | null
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(blankForm())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      setUsers(await getUsers())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setMode('add')
    setEditId(null)
    setForm(blankForm())
    setError('')
  }

  function openEdit(u) {
    setMode('edit')
    setEditId(u.id)
    setForm({
      email: u.email ?? '',
      password: '',
      display_name: u.display_name ?? '',
      role: u.role ?? 'viewer',
      permissions: u.permissions
        ? structuredClone(u.permissions)
        : structuredClone(DEFAULT_PERMISSIONS),
    })
    setError('')
  }

  function close() {
    setMode(null)
    setEditId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const perms = form.role === 'admin' ? FULL_PERMISSIONS : form.permissions
      if (mode === 'add') {
        await adminCreateUser(
          form.email,
          form.password,
          form.display_name,
          form.role,
          perms,
        )
      } else {
        await updateUser(editId, {
          display_name: form.display_name,
          role: form.role,
          permissions: perms,
        })
      }
      close()
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return
    try {
      await adminDeleteUser(id)
      setUsers((p) => p.filter((u) => u.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  function setPerm(resource, action, val) {
    setForm((f) => ({
      ...f,
      permissions: {
        ...f.permissions,
        [resource]: { ...f.permissions[resource], [action]: val },
      },
    }))
  }

  function permPills(u, resource) {
    if (u.role === 'admin')
      return <span className="admin-perm-pill admin-perm-full">Full access</span>
    const perms = u.permissions?.[resource]
    const active = ['create', 'edit', 'delete'].filter((a) => perms?.[a])
    if (!active.length)
      return <span className="admin-perm-pill admin-perm-none">None</span>
    return active.map((a) => (
      <span key={a} className="admin-perm-pill admin-perm-on">
        {a}
      </span>
    ))
  }

  if (loading) return <p className="admin-loading-text">Loading…</p>

  return (
    <div className="admin-dashboard">
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Users ({users.length})</h2>
          {!mode && (
            <button onClick={openAdd} className="admin-btn admin-btn-primary admin-btn-sm">
              + Add User
            </button>
          )}
        </div>

        {error && <div className="admin-error">{error}</div>}

        {/* Add / Edit form */}
        {mode && (
          <div className="admin-user-form-wrap">
            <h3>{mode === 'add' ? 'Add New User' : 'Edit User'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={mode === 'edit'}
                    autoComplete='off'
                  />
                </div>
                {mode === 'add' && (
                  <div className="admin-field">
                    <label>Password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      autoComplete='off'
                    />
                  </div>
                )}
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={form.display_name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, display_name: e.target.value }))
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>

              {form.role !== 'admin' && (
                <fieldset className="admin-permissions">
                  <legend>Permissions</legend>
                  <div className="admin-permissions-grid">
                    {['blogs', 'projects'].map((res) => (
                      <div key={res} className="admin-permissions-group">
                        <span className="admin-permissions-resource">
                          {res.charAt(0).toUpperCase() + res.slice(1)}
                        </span>
                        {['create', 'edit', 'delete'].map((act) => (
                          <label key={act} className="admin-checkbox">
                            <input
                              type="checkbox"
                              checked={form.permissions?.[res]?.[act] ?? false}
                              onChange={(e) => setPerm(res, act, e.target.checked)}
                            />
                            <span>{act.charAt(0).toUpperCase() + act.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving…' : mode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Blogs</th>
                <th>Projects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-user-info">
                      <span className="admin-user-name">
                        {u.display_name || '—'}
                      </span>
                      <span className="admin-user-email">
                        {u.email || u.id.slice(0, 8) + '…'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-role-badge admin-role-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="admin-perm-pills">{permPills(u, 'blogs')}</div>
                  </td>
                  <td>
                    <div className="admin-perm-pills">{permPills(u, 'projects')}</div>
                  </td>
                  <td className="admin-actions">
                    <button
                      onClick={() => openEdit(u)}
                      className="admin-btn admin-btn-outline admin-btn-sm"
                      disabled={u.id === me?.id}
                      title={u.id === me?.id ? 'Cannot edit your own account' : ''}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      disabled={u.id === me?.id}
                      title={u.id === me?.id ? 'Cannot delete your own account' : ''}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
