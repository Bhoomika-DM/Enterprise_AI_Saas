import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AnalyticsLayout from '../components/AnalyticsLayout'
import { getGeneratedFiles } from '../services/rulService'

export default function DataIntelligence() {
  const navigate = useNavigate()
  const [dataView, setDataView] = useState('raw') // 'raw' or 'cleaned'
  
  // Backend-driven state (NO hardcoded values)
  const [backendData, setBackendData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch backend data on mount
  useEffect(() => {
    console.log('🔵 [DataIntelligence] Component mounted')
    const sessionId = sessionStorage.getItem('sessionId')
    
    if (!sessionId) {
      console.warn('⚠️ [DataIntelligence] No session ID found')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        console.log('🔵 [DataIntelligence] Fetching data for session:', sessionId)
        const response = await getGeneratedFiles(sessionId)
        console.log('✅ [DataIntelligence] Data received:', response)
        setBackendData(response)
      } catch (err) {
        console.error('❌ [DataIntelligence] Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Extract data from backend response (NO defaults, NO fallbacks)
  const rawProfile = backendData?.data_intelligence?.raw_profile || null
  const cleanedProfile = backendData?.data_intelligence?.cleaned_profile || null
  const visualInsights = backendData?.data_intelligence?.visual_insights || null

  console.log('🔄 [DataIntelligence] Render with:', {
    loading,
    hasData: !!backendData,
    hasRawProfile: !!rawProfile,
    hasCleanedProfile: !!cleanedProfile,
    hasVisualInsights: !!visualInsights
  })

  return (
    <AnalyticsLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 w-full">

          {/* Data Profiling Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-xl font-semibold text-text-primary">Data Profiling</h2>
              </div>

              {/* Toggle Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setDataView('raw')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    dataView === 'raw'
                      ? 'text-white border'
                      : 'bg-section-bg text-text-muted hover:text-text-primary border border-border-subtle hover:border-border-hover'
                  }`}
                  style={dataView === 'raw' ? { 
                    backgroundColor: '#C96731',
                    borderColor: '#C96731'
                  } : {}}
                >
                  Raw Data
                </button>
                <button
                  onClick={() => setDataView('cleaned')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    dataView === 'cleaned'
                      ? 'text-white border'
                      : 'bg-section-bg text-text-muted hover:text-text-primary border border-border-subtle hover:border-border-hover'
                  }`}
                  style={dataView === 'cleaned' ? { 
                    backgroundColor: '#C96731',
                    borderColor: '#C96731'
                  } : {}}
                >
                  Cleaned Data
                </button>
              </div>

              {/* Show Info Button */}
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-section-bg text-text-muted hover:text-text-primary border border-border-subtle hover:border-border-hover transition-all duration-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Show Info
              </button>
            </div>

            {/* Data Container */}
            <div className="bg-card-bg/80 backdrop-blur-xl rounded-2xl p-12 shadow-card border border-border-subtle min-h-[400px] flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <p className="text-text-muted text-sm">Loading data profile from backend...</p>
                </div>
              ) : (
                <div className="text-center">
                  {dataView === 'raw' && rawProfile ? (
                    <div className="text-left w-full">
                      <pre className="text-xs text-text-primary overflow-auto">{JSON.stringify(rawProfile, null, 2)}</pre>
                    </div>
                  ) : dataView === 'cleaned' && cleanedProfile ? (
                    <div className="text-left w-full">
                      <pre className="text-xs text-text-primary overflow-auto">{JSON.stringify(cleanedProfile, null, 2)}</pre>
                    </div>
                  ) : (
                    <>
                      <p className="text-text-muted text-sm">
                        {dataView === 'raw' ? 'Raw' : 'Cleaned'} profile not available.
                      </p>
                      <p className="text-text-muted text-sm mt-1">
                        Please wait for analysis completion.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Visual Insights Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-6">Visual Insights & Commentary</h2>
            
            <div className="rounded-xl p-4 flex items-start gap-3" style={{
              backgroundColor: 'rgba(201, 103, 49, 0.1)',
              border: '1px solid rgba(201, 103, 49, 0.2)'
            }}>
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#C96731' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm leading-relaxed" style={{ color: '#C96731' }}>
                Technical visual insights and interactive plots are now moved to the{' '}
                <span className="font-semibold">Detailed Insights</span> tab for a cleaner data intelligence overview.
              </p>
            </div>
          </motion.div>
        </div>
      </AnalyticsLayout>
  )
}
