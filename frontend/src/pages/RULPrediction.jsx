import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'

export default function RULPrediction() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const analysisCards = [
    {
      id: 'root-cause',
      title: 'Root Cause Analysis',
      description: 'Understand why a metric changed by uncovering its strongest underlying drivers.',
      autoFillText: 'Perform Root Cause Analysis on engine degradation drivers'
    },
    {
      id: 'forecasting',
      title: 'Forecasting',
      description: 'Use historical patterns to project future performance and highlight factors affecting the trend.',
      autoFillText: 'Forecast equipment failure trends for next 6 months'
    },
    {
      id: 'classification',
      title: 'Classification',
      description: 'Predict categories or outcomes using machine learning models such as XGBoost or Random Forest.',
      autoFillText: 'Classify machine states into healthy or critical'
    },
    {
      id: 'optimization',
      title: 'Optimization',
      description: 'Compute the best possible action or configuration to maximize outcomes.',
      autoFillText: 'Optimize maintenance schedule for minimum downtime'
    }
  ]

  const handleCardClick = (autoFillText) => {
    setSearchQuery(autoFillText)
    // Store the search query for the clarifying context page
    sessionStorage.setItem('userQuery', autoFillText)
    // Navigate to clarifying context with the auto-filled question
    navigate('/dashboard/clarifying-context', { state: { question: autoFillText } })
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Store the search query for the clarifying context page
      sessionStorage.setItem('userQuery', searchQuery)
      navigate('/dashboard/clarifying-context', { state: { question: searchQuery } })
    }
  }

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      // Store the search query for the clarifying context page
      sessionStorage.setItem('userQuery', searchQuery)
      navigate('/dashboard/clarifying-context', { state: { question: searchQuery } })
    }
  }

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
              
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => navigate('/dashboard/data-scientist')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="px-[18px] py-2 text-[13px] font-medium rounded-[20px] transition-all duration-300 text-white/75 hover:bg-white/5"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  &lt;
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
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-normal text-text-primary mb-4">
              Ask anything about your business
            </h2>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-4 mb-32"
          >
            <div className="w-full max-w-3xl relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Ask Intellectus...."
                className="w-full pl-12 pr-12 py-4 bg-section-bg border border-border-subtle rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-300 font-normal"
              />
              <button 
                onClick={handleSearchClick}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Data Sources Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 border-2 border-app-bg flex items-center justify-center text-white text-xs font-bold">
                    S
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 border-2 border-app-bg flex items-center justify-center text-white text-xs font-bold">
                    G
                  </div>
                </div>
                <span className="text-sm text-text-body font-normal">2 data sources connected</span>
              </div>
              <button className="px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-semibold hover:bg-accent-primary/90 transition-all duration-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Connect more data
              </button>
            </div>
          </motion.div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analysisCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                onClick={() => handleCardClick(card.autoFillText)}
                whileHover={{ 
                  y: -6,
                  boxShadow: '0 12px 40px rgba(201, 103, 49, 0.3)'
                }}
                className="bg-card-bg/80 backdrop-blur-xl rounded-2xl p-6 shadow-card border border-border-subtle transition-all duration-300 cursor-pointer group"
              >
                <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-text-body font-normal leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
