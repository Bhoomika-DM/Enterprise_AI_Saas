import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'
import {
  getProjectHealthOverview,
  getProjectHealthCards,
  getProjectFilters,
  getFilteredProjects,
  runCrisisSimulation,
  sendProjectQuery,
  getEarlyWarnings,
  getProjectSummary,
  getProjectList
} from '../services/projectHealthService'

export default function ProjectHealthMonitor() {
  const navigate = useNavigate()
  
  // State management
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)
  const [summary, setSummary] = useState(null)
  const [statusCards, setStatusCards] = useState([])
  const [filters, setFilters] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({
    businessUnit: '',
    manager: '',
    priority: ''
  })
  const [projects, setProjects] = useState([])
  const [warnings, setWarnings] = useState([])
  const [projectList, setProjectList] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [simulationResult, setSimulationResult] = useState(null)
  const [simulationLoading, setSimulationLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [queryLoading, setQueryLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch initial data
  useEffect(() => {
    fetchInitialData()
  }, [])

  // Fetch filtered projects when filters change
  useEffect(() => {
    if (selectedFilters.businessUnit || selectedFilters.manager || selectedFilters.priority) {
      fetchFilteredProjects()
    }
  }, [selectedFilters])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔵 [ProjectHealth] Fetching initial data')
      
      const [overviewData, summaryData, cardsData, filtersData, warningsData, projectsData] = await Promise.all([
        getProjectHealthOverview(),
        getProjectSummary(),
        getProjectHealthCards(),
        getProjectFilters(),
        getEarlyWarnings(),
        getProjectList()
      ])
      
      console.log('✅ [ProjectHealth] Data loaded successfully')
      setOverview(overviewData)
      setSummary(summaryData)
      setStatusCards(cardsData.cards || [])
      setFilters(filtersData)
      setWarnings(warningsData.warnings || [])
      setProjectList(projectsData.projects || [])
      setLoading(false)
    } catch (error) {
      console.error('❌ [ProjectHealth] Failed to load data:', error)
      setError('Unable to connect to backend. Please ensure the backend server is running.')
      setLoading(false)
    }
  }

  const fetchFilteredProjects = async () => {
    try {
      console.log('🔵 [ProjectHealth] Fetching filtered projects')
      const data = await getFilteredProjects(selectedFilters)
      setProjects(data.projects || [])
    } catch (error) {
      console.error('❌ [ProjectHealth] Failed to fetch filtered projects:', error)
    }
  }

  const handleSimulation = async () => {
    if (!selectedProject) return
    
    try {
      setSimulationLoading(true)
      console.log('🔵 [ProjectHealth] Running crisis simulation')
      const result = await runCrisisSimulation(selectedProject)
      setSimulationResult(result)
      setSimulationLoading(false)
    } catch (error) {
      console.error('❌ [ProjectHealth] Simulation failed:', error)
      setSimulationLoading(false)
    }
  }

  const handleQuery = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    
    try {
      setQueryLoading(true)
      console.log('🔵 [ProjectHealth] Sending AI query')
      const result = await sendProjectQuery(query)
      setQueryResult(result)
      setQueryLoading(false)
    } catch (error) {
      console.error('❌ [ProjectHealth] Query failed:', error)
      setQueryLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      critical: '#EF4444',
      'at-risk': '#F59E0B',
      healthy: '#10B981',
      info: '#3B82F6'
    }
    return colors[status] || '#6B7280'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-primary">Loading Project Health Monitor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app-bg relative overflow-hidden">
        <Sidebar />
        <div className="relative z-10 min-h-screen flex flex-col ml-20">
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
                <div className="flex items-center h-full gap-4">
                  <motion.img 
                    src="/assets/Intellectus-logo-2D.jpeg" 
                    alt="Intellectus AI Labs" 
                    style={{ height: '72px', width: 'auto' }}
                    className="object-contain cursor-pointer"
                    onClick={() => navigate('/dashboard/data-scientist')}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div>
                    <h1 className="text-2xl font-semibold text-text-primary">
                      Project Health Monitor
                    </h1>
                    <p className="text-sm text-text-muted">
                      Backend Connection Required
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="px-[18px] py-2 text-[13px] font-medium rounded-[20px] transition-all duration-300 text-white/75 hover:bg-white/5"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  ← Back to Dashboard
                </motion.button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center px-8">
            <div className="text-center max-w-2xl">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Backend Connection Error
              </h2>
              <p className="text-text-body mb-6">
                {error}
              </p>
              <motion.button
                onClick={fetchInitialData}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold transition-all duration-300"
              >
                Retry Connection
              </motion.button>
            </div>
          </main>
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

        {/* Floating ambient shapes - same as Dashboard page */}
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

      {/* Main Content */}
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
              <div className="flex items-center h-full gap-4">
                <motion.img 
                  src="/assets/Intellectus-logo-2D.jpeg" 
                  alt="Intellectus AI Labs" 
                  style={{ height: '72px', width: 'auto' }}
                  className="object-contain cursor-pointer"
                  onClick={() => navigate('/dashboard/data-scientist')}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary">
                    {overview?.title || 'Active Project Oversight'}
                  </h1>
                  <p className="text-sm text-text-muted">
                    {overview?.subtitle || 'Powered by System Analytics Engine'}
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="px-[18px] py-2 text-[13px] font-medium rounded-[20px] transition-all duration-300 text-white/75 hover:bg-white/5"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                ← Back to Dashboard
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Summary Cards Row */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                {[
                  { label: 'Total Projects', value: summary.totalProjects, color: '#3B82F6' },
                  { label: 'Critical Attention', value: summary.criticalAttention, color: '#EF4444' },
                  { label: 'At Risk', value: summary.atRisk, color: '#F59E0B' },
                  { label: 'Stable Performance', value: summary.stablePerformance, color: '#10B981' }
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="p-6 rounded-xl"
                    style={{
                      background: '#111C34',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <p className="text-sm mb-2" style={{ color: '#7C879B' }}>{card.label}</p>
                    <p className="text-3xl font-semibold" style={{ color: card.color }}>{card.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Filter Controls */}
            {filters && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="p-6 rounded-xl"
                style={{
                  background: '#111C34',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>Filter Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={selectedFilters.businessUnit}
                    onChange={(e) => setSelectedFilters({...selectedFilters, businessUnit: e.target.value})}
                    className="px-4 py-3 rounded-lg outline-none transition-all duration-200"
                    style={{
                      background: '#0A1224',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="">All Business Units</option>
                    {filters.businessUnits?.map((unit, i) => (
                      <option key={i} value={unit}>{unit}</option>
                    ))}
                  </select>

                  <select
                    value={selectedFilters.manager}
                    onChange={(e) => setSelectedFilters({...selectedFilters, manager: e.target.value})}
                    className="px-4 py-3 rounded-lg outline-none transition-all duration-200"
                    style={{
                      background: '#0A1224',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="">All Managers</option>
                    {filters.managers?.map((manager, i) => (
                      <option key={i} value={manager}>{manager}</option>
                    ))}
                  </select>

                  <select
                    value={selectedFilters.priority}
                    onChange={(e) => setSelectedFilters({...selectedFilters, priority: e.target.value})}
                    className="px-4 py-3 rounded-lg outline-none transition-all duration-200"
                    style={{
                      background: '#0A1224',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="">All Priorities</option>
                    {filters.priorities?.map((priority, i) => (
                      <option key={i} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Project Health Status Cards */}
            {statusCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {statusCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -2, borderColor: '#F47C2C' }}
                    transition={{ duration: 0.15 }}
                    className="p-6 rounded-xl"
                    style={{
                      background: '#111C34',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>{card.title}</h3>
                    <p className="text-sm mb-4" style={{ color: '#AAB4C5' }}>{card.description}</p>
                    {card.metrics && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(card.metrics).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs" style={{ color: '#7C879B' }}>{key}</p>
                            <p className="text-2xl font-semibold" style={{ color: getStatusColor(card.status) }}>{value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* AI Query Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="p-6 rounded-xl"
              style={{
                background: '#111C34',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>AI Project Query</h2>
              <form onSubmit={handleQuery} className="flex gap-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about a specific project (e.g., Status of Project 123)"
                  className="flex-1 px-4 py-3 rounded-lg outline-none transition-all duration-200"
                  style={{
                    background: '#0A1224',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#FFFFFF'
                  }}
                />
                <button
                  type="submit"
                  disabled={queryLoading || !query.trim()}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: '#F47C2C',
                    color: '#FFFFFF'
                  }}
                >
                  {queryLoading ? 'Analyzing...' : 'Ask AI'}
                </button>
              </form>
              {queryResult && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: '#0A1224', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: '#FFFFFF' }}>{queryResult.answer}</p>
                </div>
              )}
            </motion.div>

            {/* Crisis Simulator & Early Warnings Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crisis Simulator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="p-6 rounded-xl"
                style={{
                  background: '#111C34',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>Crisis Simulator</h2>
                <div className="space-y-4">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg outline-none"
                    style={{
                      background: '#0A1224',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="">Select Project</option>
                    {projectList.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSimulation}
                    disabled={simulationLoading || !selectedProject}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: '#F47C2C',
                      color: '#FFFFFF'
                    }}
                  >
                    {simulationLoading ? 'Simulating...' : 'Run Simulation'}
                  </button>
                  {simulationResult && (
                    <div className="p-4 rounded-lg" style={{ background: '#0A1224' }}>
                      <p className="text-sm mb-2" style={{ color: '#7C879B' }}>Impact Score</p>
                      <p className="text-2xl font-semibold" style={{ color: '#EF4444' }}>
                        {simulationResult.simulationResults?.impactScore}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Early Warning Board */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.5 }}
                className="p-6 rounded-xl"
                style={{
                  background: '#111C34',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>Early Warning Board</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {warnings.length === 0 ? (
                    <p style={{ color: '#7C879B' }}>No warnings at this time</p>
                  ) : (
                    warnings.map((warning) => (
                      <div
                        key={warning.id}
                        className="p-3 rounded-lg"
                        style={{
                          background: '#0A1224',
                          borderLeft: `3px solid ${getStatusColor(warning.type)}`
                        }}
                      >
                        <p className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{warning.message}</p>
                        <p className="text-xs mt-1" style={{ color: '#7C879B' }}>
                          {new Date(warning.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
