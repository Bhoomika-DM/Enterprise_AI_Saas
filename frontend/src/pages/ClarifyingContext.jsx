import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { analyzeQuery } from '../services/rulService'

export default function ClarifyingContext() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState(null)
  
  // Get the question from navigation state or sessionStorage
  const userQuestion = location.state?.question || sessionStorage.getItem('userQuery') || 'Analyze equipment performance'

  // Call backend to analyze query on mount
  useEffect(() => {
    const initializeAnalysis = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('🔵 [ClarifyingContext] Calling analyze-query...')
        console.log('🔵 [ClarifyingContext] Query:', userQuestion)
        console.log('🔵 [ClarifyingContext] Timestamp:', new Date().toISOString())
        
        const response = await analyzeQuery(userQuestion)
        
        console.log('✅ [ClarifyingContext] ========== ANALYZE-QUERY RESPONSE ==========')
        console.log('✅ [ClarifyingContext] Full response:', JSON.stringify(response, null, 2))
        console.log('✅ [ClarifyingContext] Session ID:', response.session_id)
        console.log('✅ [ClarifyingContext] Has questions:', response.has_questions)
        console.log('✅ [ClarifyingContext] Total questions:', response.total_questions)
        console.log('✅ [ClarifyingContext] Status field:', response.status)
        console.log('✅ [ClarifyingContext] Progress field:', response.progress)
        console.log('✅ [ClarifyingContext] All keys:', Object.keys(response))
        console.log('✅ [ClarifyingContext] ================================================')
        
        // Store session data
        setAnalysisData(response)
        sessionStorage.setItem('sessionId', response.session_id)
        sessionStorage.setItem('hasQuestions', response.has_questions)
        
        setIsLoading(false)
      } catch (err) {
        console.error('❌ [ClarifyingContext] Failed to analyze query:', err)
        console.error('❌ [ClarifyingContext] Error details:', JSON.stringify(err, null, 2))
        setError(err.message || 'Failed to analyze query')
        setIsLoading(false)
      }
    }

    initializeAnalysis()
  }, [userQuestion])

  const handleProceed = async () => {
    setIsLoading(true)
    
    // Get session ID from state or storage
    const sessionId = analysisData?.session_id || sessionStorage.getItem('sessionId')
    
    // Navigate to Enterprise Workbench with session data
    setTimeout(() => {
      navigate('/dashboard/enterprise-workbench', { 
        state: { 
          question: userQuestion,
          sessionId: sessionId,
          hasQuestions: analysisData?.has_questions || false
        } 
      })
    }, 800)
  }

  const handleNeedClarification = () => {
    // Navigate to the new Q&A clarification page with session data
    const sessionId = analysisData?.session_id || sessionStorage.getItem('sessionId')
    
    navigate('/dashboard/clarification-qa', { 
      state: { 
        question: userQuestion,
        sessionId: sessionId,
        totalQuestions: analysisData?.total_questions || 0
      } 
    })
  }

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 aurora-flow"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.08) 0%, rgba(2, 6, 23, 0) 40%, rgba(34, 211, 238, 0.06) 100%)',
            backgroundSize: '200% 200%',
          }}
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
          <div className="w-full max-w-3xl">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h1 className="text-3xl font-normal text-text-primary mb-6">
                Clarifying Context
              </h1>
              <p className="text-base text-text-body font-normal">
                Before we run the pipeline, I need to understand the constraints.
              </p>
            </motion.div>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-card-bg/80 backdrop-blur-xl rounded-2xl shadow-card border border-border-subtle overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-10 pb-8">
                <div className="flex items-start gap-5">
                  {/* Icon Container */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-primary/70 rounded-xl flex items-center justify-center shadow-glow-primary">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  
                  {/* Title Block */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-text-primary mb-2">
                    Clarification Context
                    </h2>
                    <p className="text-sm text-text-muted font-normal">
                      Review & Confirm
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="px-10">
                <div className="h-px bg-border-subtle" />
              </div>

              {/* Review Section */}
              <div className="p-10 pt-8 space-y-8">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Section Title */}
                <div className="flex items-center gap-3 text-text-primary">
                  <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-base font-semibold">
                    Review Your Parameters
                  </h3>
                </div>

                {/* Parameters Display */}
                <div className="bg-section-bg/50 rounded-xl p-6 border border-border-subtle">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">
                        Your Question
                      </p>
                      <p className="text-sm text-text-primary font-normal">
                        {userQuestion}
                      </p>
                    </div>
                    <div className="h-px bg-border-subtle" />
                    <div>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-2">
                        Analysis Type
                      </p>
                      <p className="text-sm text-text-primary font-normal">
                        AI-Driven Workflow
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Confirmation Strip */}
                <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-xl p-5 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary font-normal leading-relaxed">
                      Final check: Would you like to proceed to analysis or do you need to adjust your requirements?
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <motion.button
                    onClick={handleProceed}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-4 bg-accent-primary text-white rounded-xl font-semibold text-base hover:bg-accent-primary/90 transition-all duration-300 shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Analysis'}
                  </motion.button>
                  
                  <motion.button
                    onClick={handleNeedClarification}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-4 bg-section-bg border border-border-subtle text-text-primary rounded-xl font-medium text-base hover:border-border-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Need more clarification
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
