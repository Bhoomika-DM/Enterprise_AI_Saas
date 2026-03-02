import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateRole, 
  validateTerms,
  sanitizeInput,
  getPasswordStrength 
} from '../utils/validation'
import DotFieldBackground from '../components/DotFieldBackground'

export default function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState({ google: false, twitter: false })
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  
  // Form errors
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const roles = ['Business User', 'Data Scientist']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: sanitizeInput(value)
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    const firstNameError = validateName(formData.firstName, 'First name')
    if (firstNameError) newErrors.firstName = firstNameError
    
    const lastNameError = validateName(formData.lastName, 'Last name')
    if (lastNameError) newErrors.lastName = lastNameError
    
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError
    
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError
    
    const roleError = validateRole(selectedRole)
    if (roleError) newErrors.role = roleError
    
    const termsError = validateTerms(acceptTerms)
    if (termsError) newErrors.terms = termsError
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
          termsAccepted: acceptTerms
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed')
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Store email for sign-in page
      sessionStorage.setItem('signupEmail', formData.email)
      
      // Redirect to select role page
      navigate('/select-role')
    } catch (error) {
      setServerError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    setOauthLoading({ ...oauthLoading, google: true })
    // Redirect directly to backend OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const handleXSignUp = () => {
    setOauthLoading({ ...oauthLoading, twitter: true })
    // Redirect directly to backend OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/twitter'
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden flex items-center justify-center py-12">
      {/* Animated gradient background with Minimal Dot Field */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 aurora-flow"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.08) 0%, rgba(2, 6, 23, 0) 40%, rgba(34, 211, 238, 0.06) 100%)',
            backgroundSize: '200% 200%',
          }}
        />
        
        {/* Animated Dot Field Background - Ultra Minimal */}
        <DotFieldBackground
          density={3}
          dotSize={1.5}
          linkDistance={40}
          speed={0.08}
          mode="drift"
          interaction="repel"
          tracking="global"
          dotColor="#38bdf8"
          linkColor="#0ea5e9"
          dotAlpha={0.2}
          linkAlpha={0.08}
          cursorEase={30}
          cursorRadius={150}
        />
        
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(34,211,238,0.12) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(201,103,49,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 noise-overlay opacity-[0.015] pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-6 py-8"
      >
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-text-body hover:text-text-primary transition-colors duration-300 group"
            aria-label="Go back to dashboard"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card-bg/80 backdrop-blur-xl rounded-2xl p-8 shadow-card border border-border-subtle relative overflow-hidden"
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-text-primary mb-2">Sign Up</h1>
              <p className="text-text-body font-normal">Create your account to get started.</p>
            </motion.div>

            {/* Social Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-3 mb-6"
            >
              <motion.button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={oauthLoading.google || loading}
                whileHover={!oauthLoading.google && !loading ? { scale: 1.02, boxShadow: '0 0 20px rgba(201, 103, 49, 0.2)' } : {}}
                whileTap={!oauthLoading.google && !loading ? { scale: 0.98 } : {}}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary font-medium hover:border-border-hover transition-all duration-300 ${(oauthLoading.google || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {oauthLoading.google ? (
                  <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {oauthLoading.google ? 'Connecting...' : 'Sign up with Google'}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleXSignUp}
                disabled={oauthLoading.twitter || loading}
                whileHover={!oauthLoading.twitter && !loading ? { scale: 1.02, boxShadow: '0 0 20px rgba(201, 103, 49, 0.2)' } : {}}
                whileTap={!oauthLoading.twitter && !loading ? { scale: 0.98 } : {}}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary font-medium hover:border-border-hover transition-all duration-300 ${(oauthLoading.twitter || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {oauthLoading.twitter ? (
                  <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )}
                {oauthLoading.twitter ? 'Connecting...' : 'Sign up with X'}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="flex-1 h-px bg-border-subtle"></div>
              <span className="text-text-muted text-sm font-normal">Or</span>
              <div className="flex-1 h-px bg-border-subtle"></div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              {/* Server Error */}
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <p className="text-red-400 text-sm font-medium">{serverError}</p>
                </motion.div>
              )}

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-section-bg border ${errors.firstName ? 'border-red-500' : 'border-border-subtle'} rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal`}
                    placeholder="John"
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-section-bg border ${errors.lastName ? 'border-red-500' : 'border-border-subtle'} rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal`}
                    placeholder="Doe"
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-section-bg border ${errors.email ? 'border-red-500' : 'border-border-subtle'} rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-section-bg border ${errors.password ? 'border-red-500' : 'border-border-subtle'} rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal pr-12`}
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors duration-300"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
                {formData.password && !errors.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-section-bg rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.strength <= 2 ? 'bg-red-500 w-1/3' :
                            passwordStrength.strength <= 4 ? 'bg-yellow-500 w-2/3' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Role Selection Dropdown */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
                  Role
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-4 py-3 bg-section-bg border ${errors.role ? 'border-red-500' : 'border-border-subtle'} rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal text-left flex items-center justify-between`}
                    disabled={loading}
                  >
                    <span className={selectedRole ? 'text-text-primary' : 'text-text-muted'}>
                      {selectedRole || 'Select your role'}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-20 w-full mt-2 bg-card-bg border border-border-subtle rounded-lg shadow-card overflow-hidden"
                    >
                      {roles.map((role, index) => (
                        <motion.button
                          key={role}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role)
                            setIsDropdownOpen(false)
                            if (errors.role) {
                              setErrors(prev => ({ ...prev, role: null }))
                            }
                          }}
                          whileHover={{ backgroundColor: 'rgba(201, 103, 49, 0.1)' }}
                          className={`w-full px-4 py-3 text-left font-normal transition-colors duration-300 ${
                            selectedRole === role 
                              ? 'text-accent-primary bg-accent-primary/10' 
                              : 'text-text-primary hover:text-accent-primary'
                          } ${index !== roles.length - 1 ? 'border-b border-border-subtle' : ''}`}
                        >
                          {role}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
                {errors.role && (
                  <p className="text-red-400 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked)
                        if (errors.terms) {
                          setErrors(prev => ({ ...prev, terms: null }))
                        }
                      }}
                      className="sr-only peer"
                      disabled={loading}
                    />
                    <div className={`w-5 h-5 border-2 ${errors.terms ? 'border-red-500' : 'border-border-subtle'} rounded bg-section-bg peer-checked:bg-accent-primary peer-checked:border-accent-primary transition-all duration-300 flex items-center justify-center flex-shrink-0`}>
                      {acceptTerms && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-normal text-text-body group-hover:text-text-primary transition-colors duration-300">
                    I agree to the{' '}
                    <Link to="/terms" className="text-accent-primary hover:text-accent-secondary font-medium">
                      Terms & Conditions
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-400 text-xs mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { 
                  scale: 1.02, 
                  boxShadow: '0 0 40px rgba(201, 103, 49, 0.4)'
                } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-lg hover:shadow-glow-primary ring-1 ring-white/10 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </motion.button>
            </motion.form>

            {/* Sign in link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 text-center text-sm font-normal text-text-body"
            >
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-accent-primary hover:text-accent-secondary transition-colors duration-300"
              >
                Sign in
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
