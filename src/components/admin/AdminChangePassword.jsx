import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match')
      return
    }

    try {
      setLoading(true)

      // Verify current password by re-authenticating
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) throw new Error('Could not determine current user')

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (signInError) throw new Error('Current password is incorrect')

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw new Error(updateError.message)

      setSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-form-page">
      <h2>Change Password</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="currentPassword">Current Password</label>
          <div className="admin-password-wrapper">
            <input
              id="currentPassword"
              type={showCurrentPw ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button type="button" className="admin-password-toggle" onClick={() => setShowCurrentPw((v) => !v)} aria-label={showCurrentPw ? 'Hide' : 'Show'}>
              {showCurrentPw ? '●' : '○'}
            </button>
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="newPassword">New Password</label>
          <div className="admin-password-wrapper">
            <input
              id="newPassword"
              type={showNewPw ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="button" className="admin-password-toggle" onClick={() => setShowNewPw((v) => !v)} aria-label={showNewPw ? 'Hide' : 'Show'}>
              {showNewPw ? '●' : '○'}
            </button>
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="admin-password-wrapper">
            <input
              id="confirmPassword"
              type={showConfirmPw ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="button" className="admin-password-toggle" onClick={() => setShowConfirmPw((v) => !v)} aria-label={showConfirmPw ? 'Hide' : 'Show'}>
              {showConfirmPw ? '●' : '○'}
            </button>
          </div>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}
        {success ? <p>{success}</p> : null}

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </section>
  )
}
