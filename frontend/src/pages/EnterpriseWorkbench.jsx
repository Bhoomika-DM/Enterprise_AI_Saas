import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'
import { runAnalysis, pollAnalysisStatus, getGeneratedFiles } from '../services/rulService'

export default function EnterpriseWorkbench() {
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredCard, setHoveredCard] = useState(null)
  
  // Backend-driven state (NO hardcoded values)
  const [backendData, setBackendData] = useState(null)
  const [error, setError] = useState(null)
  const pollIntervalRef = useRef(null)
  
  // Get session data from navigation state or sessionStorage
  const sessionId = location.state?.sessionId || sessionStorage.getItem('sessionId')
  const userQuestion = location.state?.question || sessionStorage.getItem('userQuery')

  // Start analysis and poll for status
  useEffect(() => {
    console.log('🔵 [EnterpriseWorkbench] Component mounted')
    console.log('🔵 [EnterpriseWorkbench] Session ID:', sessionId)
    console.log('🔵 [EnterpriseWorkbench] User Question:', userQuestion)
    
    if (!sessionId) {
      setError('No session ID found. Please start from the beginning.')
      console.error('❌ [EnterpriseWorkbench] No session ID')
      return
    }

    const startAnalysis = async () => {
      try {
        setError(null)
        console.log('🔵 [EnterpriseWorkbench] Starting analysis...')
        console.log('🔵 [EnterpriseWorkbench] Current timestamp:', new Date().toISOString())
        
        // 🧪 TEST 1: Check if we should skip run-analysis
        // Uncomment ONE of the following options to test:
        
        // OPTION A: Call run-analysis (ORIGINAL)
        console.log('🧪 [TEST] Calling run-analysis...')
        const runResponse = await runAnalysis(sessionId)
        console.log('✅ [EnterpriseWorkbench] run-analysis response:', JSON.stringify(runResponse, null, 2))
        
        // OPTION B: Skip run-analysis (TEST)
        // console.log('🧪 [TEST] Skipping run-analysis, polling directly')
        
        console.log('🔵 [EnterpriseWorkbench] Starting polling...')
        console.log('🔵 [EnterpriseWorkbench] Poll interval: 3000ms')
        
        // Start polling for status
        pollAnalysisStatus(
          sessionId,
          (statusData) => {
            // Update callback - ONLY use backend data
            console.log('📊 [EnterpriseWorkbench] ========== STATUS UPDATE ==========')
            console.log('📊 [EnterpriseWorkbench] Timestamp:', new Date().toISOString())
            console.log('📊 [EnterpriseWorkbench] Full response:', JSON.stringify(statusData, null, 2))
            console.log('📊 [EnterpriseWorkbench] Status:', statusData.status)
            console.log('📊 [EnterpriseWorkbench] Progress:', statusData.progress)
            console.log('📊 [EnterpriseWorkbench] Phase:', statusData.current_phase || statusData.phase)
            console.log('📊 [EnterpriseWorkbench] ===================================')
            setBackendData(statusData)
            console.log('✅ [EnterpriseWorkbench] State updated with backend data')
          },
          3000 // Poll every 3 seconds
        )
          .then(async (finalStatus) => {
            console.log('✅ [EnterpriseWorkbench] Analysis completed:', finalStatus)
            setBackendData(finalStatus)
            
            // Fetch generated files
            try {
              const files = await getGeneratedFiles(sessionId)
              console.log('✅ [EnterpriseWorkbench] Generated files:', files)
              setBackendData(prev => ({ ...prev, generated_files: files }))
            } catch (err) {
              console.error('❌ [EnterpriseWorkbench] Failed to fetch files:', err)
            }
          })
          .catch((err) => {
            console.error('❌ [EnterpriseWorkbench] Analysis failed:', err)
            setError(err.message || 'Analysis failed')
            setBackendData(prev => ({ ...prev, status: 'failed', error: err.message }))
          })
      } catch (err) {
        console.error('❌ [EnterpriseWorkbench] Failed to start analysis:', err)
        setError(err.message || 'Failed to start analysis')
      }
    }

    startAnalysis()

    // Cleanup on unmount
    return () => {
      console.log('🔵 [EnterpriseWorkbench] Cleaning up polling')
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [sessionId])

  // Extract data from backend response (NO defaults, NO fallbacks)
  const status = backendData?.status || 'initializing'
  const progress = backendData?.progress || 0
  const currentPhase = backendData?.current_phase || backendData?.phase || null
  const logs = backendData?.logs || []
  const metrics = backendData?.metrics || null
  const predictions = backendData?.predictions || null
  const recommendations = backendData?.recommendations || null
  const reportContent = backendData?.report_content || null
  const generatedFiles = backendData?.generated_files || null
  
  // Convert technical_details to pipeline stages if pipeline_stages not provided
  const pipelineStages = backendData?.pipeline_stages || []
  const technicalDetails = backendData?.technical_details || null
  
  // If no pipeline_stages but we have technical_details, create stages from it
  const displayStages = pipelineStages.length > 0 ? pipelineStages : (
    technicalDetails ? [
      {
        id: 'ingestion',
        title: 'Data Ingestion',
        status: technicalDetails.ingestion?.length > 0 ? 'processing' : 'pending',
        details: technicalDetails.ingestion || []
      },
      {
        id: 'processing',
        title: 'Data Processing',
        status: technicalDetails.processing?.length > 0 ? 'processing' : 'pending',
        details: technicalDetails.processing || []
      },
      {
        id: 'modeling',
        title: 'ML Modeling',
        status: technicalDetails.modeling?.length > 0 ? 'processing' : 'pending',
        details: technicalDetails.modeling || []
      },
      {
        id: 'analytics',
        title: 'Strategic Analytics',
        status: technicalDetails.analytics?.length > 0 ? 'processing' : 'pending',
        details: technicalDetails.analytics || []
      }
    ] : []
  )

  console.log('🔄 [EnterpriseWorkbench] Render with:', {
    status,
    progress,
    currentPhase,
    stagesCount: displayStages.length,
    logsCount: logs.length,
    hasMetrics: !!metrics,
    hasPredictions: !!predictions,
    hasRecommendations: !!recommendations,
    hasReportContent: !!reportContent,
    hasFiles: !!generatedFiles,
    hasTechnicalDetails: !!technicalDetails
  })

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
                System Active
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-normal text-text-primary mb-3">
              Pipeline Execution Monitor
            </h2>
            <p className="text-base text-text-body font-normal">
              Real-time intelligence processing and decision workflow
            </p>
          </motion.div>

          {/* Pipeline Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {displayStages.length > 0 ? (
              displayStages.map((stage, index) => (
                <motion.div
                  key={stage.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(stage.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative rounded-2xl overflow-hidden bg-card-bg/80 backdrop-blur-xl shadow-card border border-border-subtle transition-all duration-300 cursor-pointer group"
                  style={{
                    boxShadow: hoveredCard === stage.id 
                      ? '0 12px 40px rgba(201, 103, 49, 0.3)'
                      : undefined
                  }}
                >
                  {/* Top light gradient */}
                  <div className="absolute top-0 left-0 right-0 h-px" style={{
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)'
                  }} />

                  {/* Hover light sweep */}
                  {hoveredCard === stage.id && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)'
                      }}
                    />
                  )}

                  <div className="p-8 relative z-10">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <motion.div 
                        className="px-3 py-1 rounded-full text-xs font-medium relative overflow-hidden"
                        style={{
                          background: stage.status === 'completed' 
                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)'
                            : stage.status === 'processing'
                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)'
                            : 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(107, 114, 128, 0.08) 100%)',
                          border: stage.status === 'completed'
                            ? '1px solid rgba(34, 197, 94, 0.3)'
                            : stage.status === 'processing'
                            ? '1px solid rgba(59, 130, 246, 0.3)'
                            : '1px solid rgba(107, 114, 128, 0.2)',
                          color: stage.status === 'completed'
                            ? 'rgb(34, 197, 94)'
                            : stage.status === 'processing'
                            ? 'rgb(59, 130, 246)'
                            : 'rgb(156, 163, 175)',
                          boxShadow: stage.status === 'processing'
                            ? '0 0 15px rgba(59, 130, 246, 0.2)'
                            : 'none'
                        }}
                        animate={stage.status === 'processing' ? {
                          boxShadow: [
                            '0 0 15px rgba(59, 130, 246, 0.2)',
                            '0 0 20px rgba(59, 130, 246, 0.35)',
                            '0 0 15px rgba(59, 130, 246, 0.2)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{
                          filter: 'brightness(1.2)',
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="absolute inset-0" style={{
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)'
                        }} />
                        <span className="relative capitalize">{stage.status || 'pending'}</span>
                      </motion.div>
                    </div>

                    {/* Icon */}
                    <div className="mb-5">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}
                      >
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-text-primary mb-2 transition-all duration-300" style={{
                      filter: hoveredCard === stage.id ? 'brightness(1.2)' : 'brightness(1)'
                    }}>
                      {stage.title || stage.name || 'Processing...'}
                    </h3>

                    {/* Subtitle */}
                    {stage.subtitle && (
                      <p className="text-xs text-text-muted mb-5 leading-relaxed">
                        {stage.subtitle}
                      </p>
                    )}

                    {/* Details with bullet points */}
                    {stage.details && stage.details.length > 0 && (
                      <div className="space-y-2.5">
                        {stage.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span className="text-text-body leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp if available */}
                    {stage.timestamp && (
                      <div className="mt-4 text-xs text-text-muted">
                        {stage.timestamp}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-text-muted">Waiting for pipeline data from backend...</p>
              </div>
            )}
          </div>

          {/* Connector Lines with Flow Animation */}
          <div className="relative h-20 mb-12">
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(59, 130, 246, 0)', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: 'rgba(59, 130, 246, 0.6)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(59, 130, 246, 0)', stopOpacity: 0 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <line
                    x1={`${(i * 25) + 12.5}%`}
                    y1="0"
                    x2={`${(i * 25) + 12.5}%`}
                    y2="100%"
                    stroke="rgba(59, 130, 246, 0.2)"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  <motion.line
                    x1={`${(i * 25) + 12.5}%`}
                    y1="0"
                    x2={`${(i * 25) + 12.5}%`}
                    y2="100%"
                    stroke="url(#flowGradient)"
                    strokeWidth="3"
                    initial={{ y1: "-20%", y2: "0%" }}
                    animate={{ y1: "100%", y2: "120%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.3
                    }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Console Window */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative rounded-2xl overflow-hidden bg-card-bg/80 backdrop-blur-xl shadow-card border border-border-subtle"
          >
            {/* Top light gradient */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)'
            }} />

            {/* Scanline effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(59, 130, 246, 0.02) 0px, transparent 2px, transparent 4px)',
                opacity: 0.3
              }}
              animate={{ y: [0, 4] }}
              transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
            />

            {/* Console Header */}
            <div className="px-6 py-3 border-b border-border-subtle bg-section-bg/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.6)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234, 179, 8, 0.6)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.6)' }} />
                  </div>
                  <span className="text-sm text-text-muted font-medium">System Console</span>
                </div>
                <span className="text-xs text-text-muted font-mono">Live Feed</span>
              </div>
              
              {/* Progress Bar */}
              {status === 'running' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-primary font-medium">{currentPhase || 'Processing...'}</span>
                    <span className="text-accent-primary font-bold">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-section-bg rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Console Content */}
            <div className="p-8 font-mono text-sm space-y-3 relative bg-section-bg/30 max-h-[400px] overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, index) => {
                  // Handle both string and object log formats
                  const logText = typeof log === 'string' ? log : log.message
                  const logTime = typeof log === 'object' ? (log.time || log.timestamp) : null
                  const logLevel = typeof log === 'object' ? log.level : null
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 1) }}
                      className="text-text-primary leading-relaxed"
                    >
                      {logTime && (
                        <span className="text-text-muted mr-2">{logTime}</span>
                      )}
                      {logLevel && (
                        <span 
                          className="font-semibold mr-2"
                          style={{
                            color: logLevel === 'SUCCESS' || logLevel === 'success'
                              ? 'rgb(34, 197, 94)'
                              : logLevel === 'PROCESSING' || logLevel === 'processing'
                              ? 'rgb(59, 130, 246)'
                              : logLevel === 'ERROR' || logLevel === 'error'
                              ? 'rgb(239, 68, 68)'
                              : 'rgb(156, 163, 175)'
                          }}
                        >
                          [{logLevel.toUpperCase()}]
                        </span>
                      )}
                      <span>{logText}</span>
                    </motion.div>
                  )
                })
              ) : (
                <div className="text-text-muted">
                  <span>[{new Date().toLocaleTimeString()}] [INFO] Waiting for backend logs...</span>
                </div>
              )}
              
              {/* Blinking Cursor - Only show if processing */}
              {status === 'processing' && (
                <motion.div
                  className="flex items-center gap-4"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-text-muted">{new Date().toLocaleTimeString()}</span>
                  <span className="text-text-muted">[INFO]</span>
                  <span className="text-text-primary">
                    {currentPhase || 'Processing'}...
                    <span 
                      className="inline-block w-2 h-4 ml-1 align-middle"
                      style={{ 
                        background: 'rgba(59, 130, 246, 0.8)',
                        boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
                      }}
                    />
                  </span>
                </motion.div>
              )}
            </div>

            {/* View Results Buttons */}
            <div className="px-8 pb-8 flex gap-4">
              <motion.button
                onClick={() => navigate('/dashboard/executive-summary')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-4 rounded-xl font-semibold text-base bg-accent-primary text-white hover:bg-accent-primary/90 transition-all duration-300"
              >
                View Executive Summary →
              </motion.button>
              <motion.button
                onClick={() => navigate('/dashboard/data-intelligence')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-4 rounded-xl font-semibold text-base bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all duration-300"
              >
                View Data Intelligence →
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
