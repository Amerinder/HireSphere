import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContextValue.js'
import { fetchCurrentUser, logoutUser } from '../services/authService.js'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('hiresphere_token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    let active = true

    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await fetchCurrentUser()

        if (active) {
          setUser(currentUser)
        }
      } catch {
        localStorage.removeItem('hiresphere_token')

        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      active = false
    }
  }, [token])

  const signIn = useCallback((nextToken, nextUser) => {
    localStorage.setItem('hiresphere_token', nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const signOut = useCallback(async () => {
    try {
      if (token) {
        await logoutUser()
      }
    } finally {
      localStorage.removeItem('hiresphere_token')
      setToken(null)
      setUser(null)
    }
  }, [token])

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    signIn,
    signOut,
  }), [loading, signIn, signOut, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
