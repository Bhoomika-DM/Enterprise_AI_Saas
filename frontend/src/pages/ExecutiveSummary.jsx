import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import SCurveRoadmap from '../components/SCurveRoadmap'
import AnalyticsLayout from '../components/AnalyticsLayout'
import { getGeneratedFiles } from '../services/rulService'

export default function ExecutiveSummary() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('executive-summary')
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  
  // Backend-driven state (NO hardcoded values)
  const [backendData, setBackendData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Refs for scroll-triggered animations
  const insightGridRef = useRef(null)
  const roadmapRef = useRef(null)
  const followUpRef = useRef(null)
  
  // InView hooks
  const insightGridInView = useInView(insightGridRef, { once: true, margin: "-100px" })
  const roadmapInView = useInView(roadmapRef, { once: true, margin: "-100px" })
  const followUpInView = useInView(followUpRef, { once: true, margin: "-100px" })

  const tabs = [
    { id: 'executive-summary', label: 'Executive Summary', path: '/dashboard/executive-summary' },
    { id: 'data-intelligence', label: 'Data Intelligence', path: '/dashboard/data-intelligence' },
    { id: 'detailed-insights', label: 'Detailed Insights', path: '/dashboard/detailed-insights' },
    { id: 'analysis-mindmap', label: 'Analysis Mindmap', path: '/dashboard/analysis-mindmap' }
  ]

  // Fetch backend data on mount
  useEffect(() => {
    console.log('🔵 [ExecutiveSummary] Component mounted')
    const sessionId = sessionStorage.getItem('sessionId')
    
    if (!sessionId) {
      console.warn('⚠️ [ExecutiveSummary] No session ID found')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        console.log('🔵 [ExecutiveSummary] Fetching data for session:', sessionId)
        const response = await getGeneratedFiles(sessionId)
        console.log('✅ [ExecutiveSummary] Data received:', response)
        setBackendData(response)
      } catch (err) {
        console.error('❌ [ExecutiveSummary] Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTabClick = (tab) => {
    if (tab.path) {
      navigate(tab.path)
    } else {
      setActiveTab(tab.id)
    }
  }

  // Extract data from backend response (NO defaults, NO fallbacks)
  const insightCards = backendData?.executive_summary?.insights || []
  const roadmapStages = backendData?.executive_summary?.roadmap || []
  const followUpCards = backendData?.executive_summary?.follow_up_actions || []
  const summaryTitle = backendData?.executive_summary?.title || 'Executive Summary'
  const summarySubtitle = backendData?.executive_summary?.subtitle || null

  console.log('🔄 [ExecutiveSummary] Render with:', {
    loading,
    hasData: !!backendData,
    insightsCount: insightCards.length,
    roadmapCount: roadmapStages.length,
    followUpCount: followUpCards.length
  })

  return (
    <AnalyticsLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Tab Navigation - Removed since it's now in AnalyticsLayout */}

        {/* Hero Summary Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 rounded-2xl overflow-hidden relative bg-card-bg/80 backdrop-blur-xl shadow-card border border-border-subtle"
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)'
            }} />
            
            <div className="p-12">
              <div className="flex items-start justify-between mb-6">
                <motion.div 
                  className="px-4 py-2 rounded-lg text-xs font-medium relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.15) 0%, rgba(201, 103, 49, 0.08) 100%)',
                    border: '1px solid rgba(201, 103, 49, 0.3)',
                    color: 'rgb(201, 103, 49)',
                    boxShadow: '0 0 15px rgba(201, 103, 49, 0.2)'
                  }}
                  animate={{
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)'
                  }} />
                  <span className="relative">AI ENGINE ACTIVE</span>
                </motion.div>
              </div>
              
              <h1 className="text-3xl font-normal text-text-primary mb-3">
                {summaryTitle}
              </h1>
              {summarySubtitle && (
                <p className="text-lg text-text-body font-normal">
                  {summarySubtitle}
                </p>
              )}
            </div>
          </motion.div>

          {/* SCROLLABLE KPI RAIL - PREMIUM WIDGETS */}
          <motion.div
            ref={insightGridRef}
            initial="hidden"
            animate={insightGridInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.6,
                  staggerChildren: 0.1
                }
              }
            }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-white mb-8">
              Key Insights
            </h2>
            
            {/* Horizontal Scroll Rail */}
            <div className="overflow-x-auto flex gap-6 snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide">
              {loading ? (
                // Skeleton loading cards
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[320px] snap-start rounded-2xl overflow-hidden bg-card-bg/80 backdrop-blur-xl shadow-card border border-border-subtle p-6 animate-pulse">
                      <div className="w-12 h-12 rounded-xl bg-gray-700 mb-4"></div>
                      <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded mb-4 w-5/6"></div>
                      <div className="h-8 bg-gray-700 rounded w-32"></div>
                    </div>
                  ))}
                </>
              ) : insightCards.length === 0 ? (
                <div className="w-full text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-text-primary font-medium mb-2">Analysis in Progress</p>
                  <p className="text-text-muted text-sm">Insights will appear here once analysis completes</p>
                </div>
              ) : insightCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                  }}
                  className="min-w-[320px] snap-start rounded-2xl overflow-hidden relative group cursor-pointer transform-gpu transition-all duration-500 bg-card-bg/80 backdrop-blur-xl shadow-card border border-border-subtle hover:shadow-[0_12px_40px_rgba(201,103,49,0.3)]"
                >
                  {/* Subtle Hover Gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                    style={{
                      background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.05) 0%, transparent 50%)',
                    }} 
                  />
                  
                  <div className="p-6 relative z-10">
                    {card.icon && (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-orange-500/10 border border-orange-500/20">
                        <div className="text-orange-400" dangerouslySetInnerHTML={{ __html: card.icon }} />
                      </div>
                    )}
                    
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {card.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {card.description}
                    </p>
                    
                    {card.cta && (
                      <button className="text-sm text-orange-400 font-medium transition-colors duration-200 hover:text-orange-300">
                        {card.cta}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* PREMIUM STRATEGIC ROADMAP */}
          <motion.div
            ref={roadmapRef}
            initial={{ opacity: 0 }}
            animate={roadmapInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 relative overflow-visible py-32 rounded-3xl bg-section-bg/40"
          >
            {/* Subtle Grain Texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none rounded-3xl" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            }} />
            
            <h2 className="text-4xl font-semibold text-white mb-24 text-center relative z-10 tracking-tight">
              Execution Roadmap
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-text-muted">Loading roadmap...</p>
                </div>
              </div>
            ) : roadmapStages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-4">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="text-text-primary font-medium mb-2">Roadmap Pending</p>
                <p className="text-text-muted text-sm">Strategic roadmap will be generated after analysis</p>
              </div>
            ) : (
              <SCurveRoadmap roadmapStages={roadmapStages} roadmapInView={roadmapInView} />
            )}
          </motion.div>

          {/* Follow-up Insight Cards */}
          <motion.div
            ref={followUpRef}
            initial="hidden"
            animate={followUpInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            <h2 className="text-2xl font-normal text-text-primary mb-10">
              Explore Further
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                // Skeleton loading
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl p-6 bg-card-bg/80 backdrop-blur-xl shadow-card border border-border-subtle animate-pulse">
                      <div className="h-5 bg-gray-700 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded mb-4 w-5/6"></div>
                      <div className="h-8 bg-gray-700 rounded w-24"></div>
                    </div>
                  ))}
                </>
              ) : followUpCards.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-text-muted">Additional actions will be available after analysis</p>
                </div>
              ) : followUpCards.map((card) => (
                <motion.div
                  key={card.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                  }}
                  className="rounded-xl p-6 cursor-pointer group bg-card-bg/80 backdrop-blur-xl shadow-card border border-border-subtle hover:shadow-[0_8px_24px_rgba(201,103,49,0.2)] transition-all duration-300"
                >
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-text-muted font-normal mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  
                  {card.cta && (
                    <button className="text-sm text-accent-primary font-medium transition-colors duration-200">
                      {card.cta} →
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
      </div>
    </AnalyticsLayout>
  )
}
