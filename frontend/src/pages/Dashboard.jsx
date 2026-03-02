import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const searchPlaceholders = [
    "Why did sales drop last month?",
    "Predict churn for Q2",
    "Optimize pricing strategy"
  ]

  // Rotate placeholder every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    
    if (!token) {
      console.log('⚠️ No auth token found on Dashboard. Allowing access for testing...')
      // Temporarily disabled redirect for testing
      // navigate('/signin')
      // return
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      // Set a dummy user for testing
      setUser({
        first_name: 'Test',
        email: 'test@example.com'
      })
    }
    
    if (role) {
      setUserRole(role)
    }
  }, [navigate])

  const handleSignOut = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('selectedRole')
    localStorage.removeItem('userRole')
    navigate('/')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Store the search query for the clarifying context page
      sessionStorage.setItem('userQuery', searchQuery)
      navigate('/dashboard/clarifying-context')
    }
  }

  const handleCardClick = (moduleId) => {
    if (moduleId === 'project-health') {
      navigate('/dashboard/project-health')
    } else if (moduleId === 'rul-prediction') {
      navigate('/dashboard/rul-prediction')
    } else if (moduleId === 'marketing-analytics') {
      navigate('/dashboard/marketing-analytics')
    }
  }

  const analysisModules = [
    {
      id: 'project-health',
      title: 'Project Health Monitor',
      description: 'Track project timelines, resource allocation, and identify bottlenecks before they impact delivery.',
      roleLabel: 'Data Scientist',
      cta: 'View Insights →',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'rul-prediction',
      title: 'RUL Prediction',
      description: 'Predict equipment failure timelines and optimize maintenance schedules using machine learning.',
      roleLabel: 'Data Scientist',
      cta: 'Predict Failures →',
      recommended: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'marketing-analytics',
      title: 'Marketing Analytics',
      description: 'Measure campaign performance, customer acquisition costs, and ROI across all channels.',
      roleLabel: 'Data Scientist',
      cta: 'Analyze Campaigns →',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

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

        {/* Floating ambient shapes - same as Landing page */}
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
      <div className="relative z-10 min-h-screen flex flex-col ml-20">
        {/* Header - Premium SaaS Design */}
        <header 
          className="sticky top-0 z-50"
          style={{
            background: 'linear-gradient(90deg, #0B0B0F 0%, #111118 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            height: '72px'
          }}
        >
          <div className="max-w-full mx-auto px-8 h-full">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center h-full">
                <motion.img 
                  src="/assets/Intellectus-logo-2D.jpeg" 
                  alt="Intellectus AI Labs" 
                  style={{ height: '72px', width: 'auto' }}
                  className="object-contain cursor-pointer"
                  onClick={() => navigate('/dashboard/data-scientist')}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="flex items-center gap-4">
                {user && (
                  <div 
                    className="px-[14px] py-[6px] text-[13px] font-medium rounded-[16px]"
                    style={{
                      background: 'rgba(0, 255, 170, 0.08)',
                      color: '#00FFA3',
                      border: '1px solid rgba(0,255,170,0.25)'
                    }}
                  >
                    Hi {user.first_name || user.email?.split('@')[0]} 👋
                  </div>
                )}
                <motion.button
                  onClick={handleSignOut}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="px-[18px] py-2 text-[13px] font-medium rounded-[20px] transition-all duration-300 text-white/75 hover:bg-white/5"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  Sign Out
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-normal text-text-primary mb-4">
              What do you want to understand today?
            </h2>
            <p className="text-xl text-text-body font-normal max-w-3xl mx-auto">
              Project health, machine reliability, or business performance — powered by AI.
            </p>
          </motion.div>

          {/* Quick Start CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-3 mb-32"
          >
            <motion.input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              placeholder={searchPlaceholders[placeholderIndex]}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full max-w-2xl px-8 py-4 bg-accent-primary text-white rounded-xl font-semibold text-lg shadow-lg ring-1 ring-white/10 transition-all duration-300 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 40px rgba(201, 103, 49, 0.4)' }}
            />
            <p className="text-sm text-text-muted font-normal">
              Upload data or ask a question. AI routes you automatically.
            </p>
          </motion.div>

          {/* Module Cards Section Header */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-text-muted font-medium uppercase tracking-wide mb-4 text-center"
          >
            Recommended workflows
          </motion.p>

          {/* Module Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            animate={{ opacity: searchFocused ? 0.4 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {analysisModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                onClick={() => handleCardClick(module.id)}
                whileHover={{ 
                  y: -6,
                  scale: module.recommended ? 1.03 : 1.02,
                  boxShadow: module.recommended 
                    ? '0 12px 60px rgba(201, 103, 49, 0.5)' 
                    : '0 12px 40px rgba(201, 103, 49, 0.3)'
                }}
                className={`relative bg-card-bg/80 backdrop-blur-xl rounded-2xl p-6 shadow-card border transition-all duration-300 cursor-pointer group ${
                  module.recommended 
                    ? 'border-accent-primary ring-2 ring-accent-primary/20' 
                    : 'border-border-subtle hover:border-border-hover'
                }`}
              >
                {/* Recommended Badge */}
                {module.recommended && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-primary text-white text-xs font-semibold rounded-full flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Recommended
                  </motion.div>
                )}

                {/* Card Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.08, 
                      rotate: [0, -3, 3, 0],
                      y: -4
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="mb-5 inline-flex items-center justify-center text-accent-primary filter drop-shadow-lg"
                  >
                    {module.icon}
                  </motion.div>

                  {/* Role Label */}
                  <p className="text-xs text-text-muted font-medium mb-2 uppercase tracking-wide">
                    {module.roleLabel}
                  </p>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:font-extrabold transition-all duration-300">
                    {module.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-text-body font-normal leading-relaxed mb-5 group-hover:opacity-70 transition-opacity duration-300">
                    {module.description}
                  </p>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-accent-primary font-semibold group-hover:text-accent-secondary transition-colors duration-300"
                  >
                    {module.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
