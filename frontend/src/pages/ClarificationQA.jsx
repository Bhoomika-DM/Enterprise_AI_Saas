import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'
import { sendFollowupAnswers } from '../services/rulService'

export default function ClarificationQA() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  // Get the question and session data from navigation state or sessionStorage
  const userQuestion = location.state?.question || sessionStorage.getItem('userQuery') || 'Analyze equipment performance'
  const sessionId = location.state?.sessionId || sessionStorage.getItem('sessionId')

  const strategicOptions = [
    {
      id: 'opex',
      title: 'Minimize total maintenance expenditure (OPEX)',
      description: 'Focus on cost reduction and budget optimization',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accentColor: 'rgba(251, 191, 36, 0.15)'
    },
    {
      id: 'availability',
      title: 'Maximize engine operational availability and uptime',
      description: 'Prioritize reliability and continuous operation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      accentColor: 'rgba(59, 130, 246, 0.15)'
    },
    {
      id: 'risk',
      title: 'Reduce unplanned downtime and associated disruption risks',
      description: 'Minimize operational disruptions and safety concerns',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      accentColor: 'rgba(245, 158, 11, 0.15)'
    },
    {
      id: 'inventory',
      title: 'Optimize spare parts inventory and logistics',
      description: 'Improve supply chain efficiency and resource allocation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      accentColor: 'rgba(20, 184, 166, 0.15)'
    }
  ]

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId)
  }

  const handleConfigure = async () => {
    if (selectedOption && sessionId) {
      try {
        setIsSubmitting(true)
        setError(null)
        
        // Store the selected objective
        sessionStorage.setItem('strategicObjective', selectedOption)
        
        // Send follow-up answer to backend
        const answers = {
          strategic_objective: selectedOption
        }
        
        await sendFollowupAnswers(sessionId, answers)
        
        // Navigate to Enterprise Workbench
        navigate('/dashboard/enterprise-workbench', { 
          state: { 
            question: userQuestion,
            objective: selectedOption,
            sessionId: sessionId
          } 
        })
      } catch (err) {
        console.error('Failed to send answers:', err)
        setError(err.message || 'Failed to submit answers')
        setIsSubmitting(false)
      }
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
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              {/* AI Orchestrator Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.15) 0%, rgba(201, 103, 49, 0.08) 100%)',
                  border: '1px solid rgba(201, 103, 49, 0.3)',
                  boxShadow: '0 0 20px rgba(201, 103, 49, 0.2)'
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-accent-primary">AI Orchestrator</span>
              </motion.div>

              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Clarifying Context
              </h1>
              <p className="text-lg text-text-body font-normal max-w-2xl mx-auto">
                Before we run the pipeline, I need to understand the constraints.
              </p>
            </motion.div>

            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-card-bg/80 backdrop-blur-xl rounded-2xl shadow-card border border-border-subtle overflow-hidden"
            >
              {/* Vertical accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-primary to-accent-secondary" />
              
              <div className="p-10 relative">
                {/* Strategic Objective Label */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                  <p className="text-xs text-accent-primary font-semibold uppercase tracking-wider">
                    Strategic Objective
                  </p>
                </div>

                {/* Main Question */}
                <h2 className="text-2xl font-bold text-text-primary mb-6 leading-relaxed">
                  To effectively prioritize the prediction of Remaining Useful Life (RUL) across the 100 engines, what is the primary strategic objective for this analysis?
                </h2>

                {/* Helper Text */}
                <div className="bg-section-bg/50 rounded-xl p-5 mb-8 border border-border-subtle">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-text-primary mb-1">Why I'm asking:</p>
                      <p className="text-sm text-text-body leading-relaxed" style={{ opacity: 0.7 }}>
                        Understanding your objective allows the AI to tune prediction sensitivity and optimize decision outputs around cost, uptime, or risk mitigation KPIs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selection Label */}
                <p className="text-sm text-text-muted font-medium mb-4">
                  Select your answer:
                </p>

                {/* Option Cards */}
                <div className="space-y-3 mb-8">
                  {strategicOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      onClick={() => handleOptionSelect(option.id)}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full rounded-xl p-5 transition-all duration-300 flex items-center gap-4 group ${
                        selectedOption === option.id
                          ? 'bg-gradient-to-r from-accent-primary/10 to-accent-secondary/5 border-2 border-accent-primary shadow-lg'
                          : 'bg-section-bg/50 border border-border-subtle hover:border-border-hover hover:shadow-md'
                      }`}
                      style={{
                        boxShadow: selectedOption === option.id 
                          ? '0 0 30px rgba(201, 103, 49, 0.3)' 
                          : undefined
                      }}
                    >
                      {/* Selection Indicator */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        selectedOption === option.id
                          ? 'border-accent-primary bg-gradient-to-br from-accent-primary to-accent-secondary'
                          : 'border-border-subtle group-hover:border-accent-primary/50'
                      }`}>
                        {selectedOption === option.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedOption === option.id
                          ? 'bg-accent-primary/20 text-accent-primary'
                          : 'bg-section-bg text-text-muted group-hover:text-accent-primary'
                      }`}>
                        {option.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <h3 className={`text-base font-semibold mb-1 transition-colors duration-300 ${
                          selectedOption === option.id
                            ? 'text-text-primary'
                            : 'text-text-primary group-hover:text-text-primary'
                        }`}>
                          {option.title}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {option.description}
                        </p>
                      </div>

                      {/* Chevron */}
                      <svg 
                        className={`w-5 h-5 transition-all duration-300 ${
                          selectedOption === option.id
                            ? 'text-accent-primary'
                            : 'text-text-muted group-hover:text-accent-primary group-hover:translate-x-1'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  ))}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* CTA Button */}
                <div className="flex justify-end">
                  <motion.button
                    onClick={handleConfigure}
                    disabled={!selectedOption || isSubmitting}
                    whileHover={selectedOption && !isSubmitting ? { scale: 1.02, boxShadow: '0 0 40px rgba(201, 103, 49, 0.4)' } : {}}
                    whileTap={selectedOption && !isSubmitting ? { scale: 0.98 } : {}}
                    className={`px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2 ${
                      selectedOption && !isSubmitting
                        ? 'bg-accent-primary text-white shadow-lg hover:shadow-glow-primary'
                        : 'bg-section-bg text-text-muted cursor-not-allowed opacity-50'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Configure Pipeline
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Optional: Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex items-center justify-center gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-primary shadow-lg" style={{ boxShadow: '0 0 10px rgba(201, 103, 49, 0.6)' }} />
                <span className="text-xs text-text-muted font-medium">Step 1 of 3</span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs text-accent-primary font-semibold">Clarifying Objective</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
