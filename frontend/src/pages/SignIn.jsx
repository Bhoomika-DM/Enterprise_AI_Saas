import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignInClick = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Sign in failed')
      }

      // Store real authentication token and user data
      localStorage.setItem('authToken', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Navigate to role selection
      navigate('/select-role')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    console.log('========================================')
    console.log('🚀 Google Sign In Initiated')
    console.log('========================================')
    console.log('Redirecting to: http://localhost:5000/api/auth/google')
    console.log('Expected flow:')
    console.log('1. Backend redirects to Google OAuth')
    console.log('2. Google redirects back to backend callback')
    console.log('3. Backend redirects to /auth/callback?token=...')
    console.log('4. Frontend stores token and redirects to /select-role')
    console.log('========================================')
    
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const handleXSignIn = () => {
    console.log('X Sign In clicked')
    // TODO: Implement X (Twitter) OAuth flow
    // window.location.href = 'http://localhost:5000/api/auth/twitter'
  }

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 aurora-flow" style={{ background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.08) 0%, rgba(2, 6, 23, 0) 40%, rgba(34, 211, 238, 0.06) 100%)', backgroundSize: '200% 200%' }} />
        <motion.div className="absolute inset-0 opacity-40" animate={{ background: ['radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)', 'radial-gradient(circle at 80% 50%, rgba(34,211,238,0.12) 0%, transparent 50%)', 'radial-gradient(circle at 50% 80%, rgba(201,103,49,0.08) 0%, transparent 50%)', 'radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)'] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" animate={{ y: [0, 50, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" animate={{ y: [0, -40, 0], x: [0, -20, 0], scale: [1, 1.15, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      </div>
      <div className="absolute inset-0 noise-overlay opacity-[0.015] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-md px-6 py-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-8">
          <button onClick={() => navigate('/')} className="inline-flex items-center text-text-body hover:text-text-primary transition-colors duration-300 group" aria-label="Go back to dashboard">
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="bg-card-bg/80 backdrop-blur-xl rounded-2xl p-8 shadow-card border border-border-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Sign In</h1>
              <p className="text-text-body font-normal">Welcome back! Please enter your details.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-3 mb-6">
              <motion.button type="button" onClick={handleGoogleSignIn} whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201, 103, 49, 0.2)' }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary font-medium hover:border-border-hover transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign in with Google
              </motion.button>
              <motion.button type="button" onClick={handleXSignIn} whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201, 103, 49, 0.2)' }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary font-medium hover:border-border-hover transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Sign in with X
              </motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border-subtle"></div>
              <span className="text-text-muted text-sm font-normal">Or</span>
              <div className="flex-1 h-px bg-border-subtle"></div>
            </motion.div>
            <motion.form 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.6, delay: 0.6 }} 
              className="space-y-5"
              onSubmit={handleSignInClick}
            >
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal" 
                  placeholder="Enter your email" 
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal pr-12" 
                    placeholder="Enter your password" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors duration-300">
                    {showPassword ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} className="sr-only peer" />
                    <div className="w-5 h-5 border-2 border-border-subtle rounded bg-section-bg peer-checked:bg-accent-primary peer-checked:border-accent-primary transition-all duration-300 flex items-center justify-center">
                      {keepLoggedIn && (<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>)}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-text-body group-hover:text-text-primary transition-colors duration-300">Keep me logged in</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-accent-primary hover:text-accent-secondary transition-colors duration-300">Forgot password?</Link>
              </div>
              <motion.button 
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 40px rgba(201, 103, 49, 0.4)' } : {}} 
                whileTap={!loading ? { scale: 0.98 } : {}} 
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} 
                className="w-full px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-lg hover:shadow-glow-primary ring-1 ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </motion.form>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-6 text-center text-sm font-normal text-text-body">
              Don't have an account? <Link to="/signup" className="font-medium text-accent-primary hover:text-accent-secondary transition-colors duration-300">Sign up</Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
