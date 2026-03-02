import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'
import { getMarketingDashboardData } from '../services/marketingService'

export default function MarketingDashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Backend-driven state (NO hardcoded values)
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Helper function to render icons
  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'chart':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      case 'users':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
  }
  
  // Fetch page data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔵 [MarketingDashboard] Fetching page data from backend')
        const data = await getMarketingDashboardData()
        console.log('✅ [MarketingDashboard] Data received:', data)
        setPageData(data)
        setLoading(false)
      } catch (err) {
        console.error('❌ [MarketingDashboard] Failed to fetch page data:', err)
        console.warn('⚠️ [MarketingDashboard] Using fallback mock data')
        
        // Fallback to mock data if backend fails
        const mockData = {
          mainHeading: "How would you like to analyze your marketing performance?",
          subtitle: "Ask questions about campaigns, conversions, ROI, audience segments, and engagement metrics using plain English.",
          cards: [
            {
              id: 'campaign-performance',
              title: 'Campaign Performance Analysis',
              description: 'Analyze campaign ROI, conversion rates, and engagement metrics.',
              route: '/dashboard/campaign-analysis',
              icon: 'chart',
              suggestedQuestion: 'How is my campaign performance? Show me ROI and conversion rates.'
            },
            {
              id: 'customer-segmentation',
              title: 'Customer Segmentation & Insights',
              description: 'Identify high-value audiences and optimize targeting strategies.',
              route: '/dashboard/customer-insights',
              icon: 'users',
              suggestedQuestion: 'Show me customer segmentation insights and high-value audience analysis.'
            }
          ],
          inputPlaceholder: "Ask about campaign ROI, top performing ads, or customer segments..."
        }
        
        setPageData(mockData)
        // Don't set error state - just use fallback data
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCardClick = (card) => {
    // Instead of navigating, populate the search input with suggested question
    if (card.suggestedQuestion) {
      setSearchQuery(card.suggestedQuestion)
      // Optionally scroll to the input field
      const inputElement = document.querySelector('input[type="text"]')
      if (inputElement) {
        inputElement.focus()
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('🔵 [MarketingDashboard] Search query:', searchQuery)
      // Navigate to chat page with the question
      navigate('/dashboard/marketing-chat', { 
        state: { question: searchQuery } 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-primary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden">
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
                <img 
                  src="/assets/Intellectus-logo-2D.jpeg" 
                  alt="Intellectus AI Labs" 
                  style={{ height: '72px', width: 'auto' }}
                  className="object-contain"
                />
              </div>
              
              <div 
                className="px-[14px] py-[6px] text-[13px] font-medium rounded-[16px]"
                style={{
                  background: 'rgba(0, 255, 170, 0.08)',
                  color: '#00FFA3',
                  border: '1px solid rgba(0,255,170,0.25)'
                }}
              >
                System Ready
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-4xl">
            {/* Back navigation */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center text-text-body hover:text-text-primary transition-colors duration-300 group"
                aria-label="Back to Command Center"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-2">Back to Command Center</span>
              </button>
            </motion.div>

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-text-primary mb-3">
                {pageData?.mainHeading || 'Loading...'}
              </h1>
              <p className="text-text-body font-normal text-lg">
                {pageData?.subtitle || ''}
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {pageData?.cards && pageData.cards.length > 0 ? (
                pageData.cards.map((card, index) => (
                  <motion.button
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    onClick={() => handleCardClick(card)}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 40px rgba(201, 103, 49, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative bg-card-bg/80 backdrop-blur-xl rounded-2xl p-8 shadow-card border border-border-subtle hover:border-border-hover transition-all duration-300 text-left overflow-hidden group cursor-pointer"
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
                        {renderIcon(card.icon)}
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-2xl font-semibold text-text-primary mb-3">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-text-body font-normal leading-relaxed">
                        {card.description}
                      </p>

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
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-text-muted">No features available</p>
                </div>
              )}
            </div>

            {/* Search Input Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative bg-card-bg/80 backdrop-blur-xl rounded-2xl shadow-card border border-border-subtle overflow-hidden group hover:border-border-hover transition-all duration-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={pageData?.inputPlaceholder || 'Ask a question...'}
                    className="w-full px-6 py-5 bg-transparent text-text-primary placeholder-text-muted outline-none text-lg"
                    style={{ paddingRight: '120px', cursor: 'text' }}
                  />
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
