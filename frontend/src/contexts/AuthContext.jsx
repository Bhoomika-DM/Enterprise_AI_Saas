import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check for existing session on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          localStorage.removeItem('authToken')
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed')
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token)
      setUser(data.user)
      
      return { success: true, user: data.user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password, keepLoggedIn = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, keepLoggedIn })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed')
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token)
      if (keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'true')
      }
      setUser(data.user)
      
      return { success: true, user: data.user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('keepLoggedIn')
      setUser(null)
      navigate('/')
    }
  }

  const initiateOAuth = (provider) => {
    // Store current location for redirect after OAuth
    sessionStorage.setItem('oauthRedirect', window.location.pathname)
    
    // Redirect to OAuth endpoint
    window.location.href = `/api/auth/${provider}`
  }

  const handleOAuthCallback = async (provider, code) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/auth/${provider}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'OAuth authentication failed')
      }

      localStorage.setItem('authToken', data.token)
      setUser(data.user)
      
      // Redirect to stored location or dashboard
      const redirectTo = sessionStorage.getItem('oauthRedirect') || '/dashboard'
      sessionStorage.removeItem('oauthRedirect')
      navigate(redirectTo)
      
      return { success: true, user: data.user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    initiateOAuth,
    handleOAuthCallback,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
