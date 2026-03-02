import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    console.log('========================================')
    console.log('🔍 AuthCallback Debug Info')
    console.log('========================================')
    console.log('Current URL:', window.location.href)
    console.log('Token from URL:', token ? `${token.substring(0, 20)}...` : 'NULL')
    console.log('Error from URL:', error || 'NONE')
    console.log('========================================')

    if (error) {
      // Handle OAuth error
      console.error('❌ OAuth error detected:', error)
      console.log('Redirecting to /signin with error...')
      navigate(`/signin?error=${error}`)
      return
    }

    if (token) {
      console.log('✅ Token received, decoding user data from token...')
      
      try {
        // Decode JWT token to get user data (without calling backend)
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        
        const userData = JSON.parse(jsonPayload)
        console.log('✅ User data decoded from token:', userData)
        
        // Store token and user data
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('✅ Token and user data stored in localStorage')
        
        // Redirect to role selection page
        console.log('✅ Redirecting to /select-role')
        navigate('/select-role')
        
      } catch (err) {
        console.error('❌ Failed to decode token:', err)
        console.error('Error details:', err.message)
        console.log('Redirecting to /signin with error...')
        navigate('/signin?error=auth_failed')
      }
    } else {
      console.log('❌ No token found in URL')
      console.log('Redirecting to /signin')
      navigate('/signin')
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-primary text-lg font-medium">Completing authentication...</p>
        <p className="text-text-muted text-sm mt-2">Please wait while we sign you in</p>
      </motion.div>
    </div>
  )
}
