import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import DotFieldBackground from './DotFieldBackground'

export default function AnalyticsLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: 'executive-summary', label: 'Executive Summary', path: '/dashboard/executive-summary' },
    { id: 'data-intelligence', label: 'Data Intelligence', path: '/dashboard/data-intelligence' },
    { id: 'detailed-insights', label: 'Detailed Insights', path: '/dashboard/detailed-insights' },
    { id: 'analysis-mindmap', label: 'Analysis Mindmap', path: '/dashboard/analysis-mindmap' }
  ]

  const getActiveTab = () => {
    const currentPath = location.pathname
    const activeTab = tabs.find(tab => tab.path === currentPath)
    return activeTab?.id || 'executive-summary'
  }

  const handleTabClick = (tab) => {
    navigate(tab.path)
  }

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden">
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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Global Header - Premium SaaS Design */}
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
              {/* Logo - Embedded Style */}
              <div className="flex items-center h-full">
                <img 
                  src="/assets/Intellectus-logo-2D.jpeg" 
                  alt="Intellectus AI Labs" 
                  style={{ height: '72px', width: 'auto' }}
                  className="object-contain"
                />
              </div>

              {/* Global Navigation Tabs - Premium Pills */}
              <div className="flex items-center gap-3">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={`px-[18px] py-2 text-[13px] font-medium rounded-[20px] transition-all duration-300 ${
                      getActiveTab() === tab.id
                        ? 'text-[#00D4FF]'
                        : 'text-white/75 hover:bg-white/5'
                    }`}
                    style={
                      getActiveTab() === tab.id
                        ? {
                            background: '#1C1C28',
                            border: '1px solid rgba(0, 200, 255, 0.4)'
                          }
                        : {
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.08)'
                          }
                    }
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
              
              {/* System Ready Badge - Subtle Premium */}
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

        {/* Page Content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
