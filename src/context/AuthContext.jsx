import { createContext, useContext, useEffect, useState } from 'react'
import { ensureMyProfile, getMyProfile } from '../lib/api'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)     // 'admin' | 'editor' | 'viewer' | null
  const [loading, setLoading] = useState(true)

  /**
   * Fetch profile role using the access token directly (no extra getSession call).
   * @param {object|null} sessionUser
   * @param {string|null} accessToken
   */
  async function syncRole(sessionUser, accessToken) {
    if (!sessionUser || !accessToken) {
      setRole(null)
      return
    }
    try {
      let profile = null
      try {
        profile = await getMyProfile(accessToken)
      } catch (e) {
        if (e?.code === 'PGRST116') {
          profile = await ensureMyProfile(accessToken)
        } else {
          throw e
        }
      }
      setRole(profile?.role ?? 'viewer')
    } catch {
      setRole('viewer')
    }
  }

  useEffect(() => {
    // Hydrate from existing session (getSession reads localStorage — fast, no network)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      await syncRole(u, session?.access_token ?? null)
      setLoading(false)
    })

    // Keep state in sync across tabs / token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      await syncRole(u, session?.access_token ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  /** Sign in with email + password (Supabase Auth). */
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    // Pass access_token directly — avoids calling getSession() again inside api.js
    await syncRole(data.user, data.session?.access_token ?? null)
    return data
  }

  async function logout() {
    await supabase.auth.signOut()
    setRole(null)
  }

  /**
   * Authenticated fetch helper — attaches the Supabase JWT so any
   * remaining Express routes (server-side) can still validate the token.
   */
  async function authFetch(url, options = {}) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token ?? ''}`,
        ...options.headers,
      },
    })
  }

  // `token` kept for backward compat with any component still reading it
  const token = null

  return (
    <AuthContext.Provider value={{ token, user, role, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

