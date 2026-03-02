import { motion } from 'framer-motion'
import AnalyticsLayout from '../components/AnalyticsLayout'
import { useState, useEffect } from 'react'
import { getGeneratedFiles } from '../services/rulService'

export default function DetailedInsights() {
  // Backend-driven state (NO hardcoded values)
  const [backendData, setBackendData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch backend data on mount
  useEffect(() => {
    console.log('🔵 [DetailedInsights] Component mounted')
    const sessionId = sessionStorage.getItem('sessionId')
    
    if (!sessionId) {
      console.warn('⚠️ [DetailedInsights] No session ID found')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        console.log('🔵 [DetailedInsights] Fetching data for session:', sessionId)
        const response = await getGeneratedFiles(sessionId)
        console.log('✅ [DetailedInsights] Data received:', response)
        setBackendData(response)
      } catch (err) {
        console.error('❌ [DetailedInsights] Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Extract data from backend response (NO defaults, NO fallbacks)
  const analysisReport = backendData?.detailed_insights?.report || null
  const artifacts = backendData?.detailed_insights?.artifacts || []

  console.log('🔄 [DetailedInsights] Render with:', {
    loading,
    hasData: !!backendData,
    hasReport: !!analysisReport,
    artifactsCount: artifacts.length
  })
  return (
    <AnalyticsLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Analysis Report (70%) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-card-bg/80 backdrop-blur-xl rounded-xl p-8 shadow-card border border-border-subtle transition-all duration-300 hover:shadow-[0_12px_40px_rgba(201,103,49,0.3)]">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Analysis Report</h2>
              {loading ? (
                <p className="text-sm text-text-muted">Loading report from backend...</p>
              ) : analysisReport ? (
                <div className="text-sm text-text-primary whitespace-pre-wrap">{analysisReport}</div>
              ) : (
                <p className="text-sm text-text-muted">
                  No analysis report available yet. Please complete analysis first.
                </p>
              )}
            </div>
          </motion.div>

          {/* Right Panel - Artifacts (30%) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-card-bg/80 backdrop-blur-xl rounded-xl p-8 shadow-card border border-border-subtle transition-all duration-300 hover:shadow-[0_12px_40px_rgba(201,103,49,0.3)]">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Artifacts</h2>
              {loading ? (
                <p className="text-sm text-text-muted mb-6">Loading artifacts from backend...</p>
              ) : artifacts.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {artifacts.map((artifact, index) => (
                    <div key={index} className="p-3 bg-section-bg rounded-lg border border-border-subtle">
                      <p className="text-sm text-text-primary font-medium">{artifact.name || artifact.filename}</p>
                      {artifact.url && (
                        <a href={artifact.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300">
                          Download →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted mb-6">
                  No generated artifacts available yet.
                </p>
              )}

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full px-6 py-4 rounded-xl font-semibold text-base text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                }}
              >
                <div className="mb-1">Deeper Analysis?</div>
                <div className="text-xs font-normal opacity-90">
                  Ask our AI Analyst technical details about these findings.
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnalyticsLayout>
  )
}
