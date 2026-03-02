import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'
import { getMarketingChatConfig, sendMarketingQuery } from '../services/marketingService'

export default function MarketingChat() {
  const navigate = useNavigate()
  const location = useLocation()
  const messagesEndRef = useRef(null)
  const initializedRef = useRef(false)
  
  const [messages, setMessages] = useState([])
  const [inputQuery, setInputQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [pageConfig, setPageConfig] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [error, setError] = useState(null)
  
  // Get initial question from navigation state
  const initialQuestion = location.state?.question || ''

  // Fetch page configuration from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log('🔵 [MarketingChat] Fetching page config from backend')
        const data = await getMarketingChatConfig()
        console.log('✅ [MarketingChat] Config received:', data)
        setPageConfig(data)
      } catch (error) {
        console.error('❌ [MarketingChat] Failed to fetch config:', error)
        // Fallback to default config if backend fails
        setPageConfig({
          title: 'Marketing Analytics Assistant',
          subtitle: 'Natural Language Analytics Platform',
          inputPlaceholder: 'Type your question here...'
        })
      }
    }
    
    fetchConfig()
  }, [])

  useEffect(() => {
    // If there's an initial question, add it to messages and get response
    // Use ref to prevent double execution in React StrictMode
    if (initialQuestion && !initializedRef.current) {
      initializedRef.current = true
      handleSendMessage(initialQuestion)
    }
  }, [initialQuestion])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (messageText) => {
    const textToSend = messageText || inputQuery
    if (!textToSend.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputQuery('')
    setIsTyping(true)
    setError(null)

    try {
      console.log('🔵 [MarketingChat] Sending message to backend:', textToSend)
      
      // Call backend API
      const response = await sendMarketingQuery(textToSend, sessionId)
      
      console.log('✅ [MarketingChat] Response received:', response)
      
      // Store session ID if provided
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id)
        console.log('✅ [MarketingChat] Session ID stored:', response.session_id)
      }
      
      // Add AI response message
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.response || response.answer || response.message,
        timestamp: response.timestamp || new Date().toISOString()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
      
    } catch (error) {
      console.error('❌ [MarketingChat] Failed to get response:', error)
      
      // Show error message to user
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
      setError(error.message)
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendMessage()
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
        {/* Header */}
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
              <div className="flex items-center gap-4 h-full">
                <img 
                  src="/assets/Intellectus-logo-2D.jpeg" 
                  alt="Intellectus AI Labs" 
                  style={{ height: '72px', width: 'auto' }}
                  className="object-contain"
                />
                {pageConfig && (
                  <div>
                    <h1 className="text-white text-lg font-medium">{pageConfig.title}</h1>
                    <p className="text-text-muted text-xs">{pageConfig.subtitle}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => navigate('/dashboard/marketing-analytics')}
                className="text-text-body hover:text-text-primary transition-colors duration-300 text-sm"
              >
                ← Back to Command Center
              </button>
            </div>
          </div>
        </header>

        {/* Chat Messages Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`mb-6 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-6 ${
                      message.type === 'user'
                        ? 'bg-accent-primary text-white'
                        : 'bg-card-bg/80 backdrop-blur-xl border border-border-subtle text-text-primary'
                    }`}
                    style={{
                      boxShadow: message.type === 'user' 
                        ? '0 4px 20px rgba(201, 103, 49, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <p className="text-base leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-text-muted'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex justify-start"
              >
                <div className="bg-card-bg/80 backdrop-blur-xl border border-border-subtle rounded-2xl p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area - Fixed at Bottom */}
        <div 
          className="sticky bottom-0 z-50 px-6 py-6"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #020617 20%)',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative bg-card-bg/80 backdrop-blur-xl rounded-2xl shadow-card border border-border-subtle overflow-hidden group hover:border-border-hover transition-all duration-300">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={pageConfig?.inputPlaceholder || 'Type your question...'}
                  className="w-full px-6 py-5 bg-transparent text-text-primary placeholder-text-muted outline-none text-lg"
                  style={{ paddingRight: '120px', cursor: 'text' }}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
