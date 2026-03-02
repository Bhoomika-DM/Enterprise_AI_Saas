import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DotFieldBackground from '../components/DotFieldBackground'

export default function SelectRole() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)

  // Check authentication on page load
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('⚠️ No auth token found on SelectRole page. Allowing access for testing...')
      // Temporarily disabled redirect for testing
      // navigate('/signin')
    }
  }, [navigate])

  const roles = [
    {
      id: 'business-user',
      title: 'Business User',
      description: 'Access insights and analytics to drive business decisions',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Build models and analyze data with advanced tools',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ]

  const handleRoleSelect = (role) => {
    console.log('========================================')
    console.log('🎯 Role Selection Started')
    console.log('========================================')
    
    // Check if user is authenticated
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    
    console.log('Token exists:', !!token)
    console.log('User exists:', !!user)
    
    if (!token) {
      console.log('⚠️ No auth token found! Allowing navigation for testing...')
      // Temporarily disabled redirect for testing
      // navigate('/signin')
      // return
    }
    
    setSelectedRole(role.id)
    setLoading(true)

    // Store role globally
    const roleSlug = role.id // 'business-user' or 'data-scientist'
    localStorage.setItem('userRole', roleSlug)
    localStorage.setItem('selectedRole', role.title)
    
    console.log('✅ Role stored:', roleSlug)
    console.log('✅ Navigating to dashboard...')
    console.log('========================================')

    // Navigate based on role
    setTimeout(() => {
      if (roleSlug === 'data-scientist') {
        navigate('/dashboard/data-scientist')
      } else {
        navigate('/dashboard')
      }
    }, 500)
  }

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
        className="relative z-10 w-full max-w-4xl px-6 py-8"
      >
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-text-body hover:text-text-primary transition-colors duration-300 group"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-3">Select Your Role</h1>
          <p className="text-text-body font-normal text-lg">Choose the role that best describes you</p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              onClick={() => !loading && handleRoleSelect(role)}
              disabled={loading}
              whileHover={!loading ? { 
                scale: 1.02,
                boxShadow: '0 0 40px rgba(201, 103, 49, 0.3)'
              } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`relative bg-card-bg/80 backdrop-blur-xl rounded-2xl p-8 shadow-card border transition-all duration-300 text-left overflow-hidden group ${
                selectedRole === role.id 
                  ? 'border-accent-primary' 
                  : 'border-border-subtle hover:border-border-hover'
              } ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="mb-6 text-accent-primary"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {role.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-text-primary mb-3">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-text-body font-normal leading-relaxed">
                  {role.description}
                </p>

                {/* Loading indicator */}
                {loading && selectedRole === role.id && (
                  <div className="mt-6 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Hover arrow */}
                <motion.div
                  className="absolute bottom-8 right-8 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
