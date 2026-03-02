import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import AnalyticsLayout from '../components/AnalyticsLayout'
import { getGeneratedFiles } from '../services/rulService'

export default function AnalysisMindmap() {
  const [expandedNodes, setExpandedNodes] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [leftWidth, setLeftWidth] = useState(60) // Percentage width for left panel
  const [isDragging, setIsDragging] = useState(false)
  
  // Backend-driven state (NO hardcoded values)
  const [backendData, setBackendData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch backend data on mount
  useEffect(() => {
    console.log('🔵 [AnalysisMindmap] Component mounted')
    const sessionId = sessionStorage.getItem('sessionId')
    
    if (!sessionId) {
      console.warn('⚠️ [AnalysisMindmap] No session ID found')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        console.log('🔵 [AnalysisMindmap] Fetching data for session:', sessionId)
        const response = await getGeneratedFiles(sessionId)
        console.log('✅ [AnalysisMindmap] Data received:', response)
        setBackendData(response)
      } catch (err) {
        console.error('❌ [AnalysisMindmap] Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Extract data from backend response (NO defaults, NO fallbacks)
  const systemHealth = backendData?.mindmap?.system_health || null
  const treeStructure = backendData?.mindmap?.tree_structure || null

  console.log('🔄 [AnalysisMindmap] Render with:', {
    loading,
    hasData: !!backendData,
    hasSystemHealth: !!systemHealth,
    hasTreeStructure: !!treeStructure
  })

  // Handle divider drag
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const newWidth = (e.clientX / window.innerWidth) * 100
    if (newWidth > 30 && newWidth < 80) {
      setLeftWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Hierarchical tree data structure - NOW FROM BACKEND
  // This was previously hardcoded with 200+ lines of static data
  // Now it's loaded dynamically from backend response

  const toggleNode = (nodeId) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter(id => id !== nodeId))
    } else {
      setExpandedNodes([...expandedNodes, nodeId])
    }
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node)
    toggleNode(node.id)
  }

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'complete': return 'bg-green-500/20 text-green-400'
      case 'active': return 'bg-blue-500/20 text-blue-400'
      case 'pending': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Recursive tree renderer with horizontal layout
  const renderTree = (node, depth = 0) => {
    const isExpanded = expandedNodes.includes(node.id)
    const isSelected = selectedNode?.id === node.id
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className="flex flex-row items-start gap-6 relative">
        {/* Node Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: depth * 0.05 }}
          className="flex-shrink-0 relative z-10"
        >
          <motion.button
            onClick={() => handleNodeClick(node)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-[200px] bg-gradient-to-br from-section-bg to-card-bg backdrop-blur-xl rounded-xl p-4 border cursor-pointer text-left shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 ${
              isSelected 
                ? 'border-orange-500 shadow-[0_8px_32px_rgba(201,103,49,0.5)]' 
                : 'border-border-subtle hover:border-orange-500/50'
            }`}
          >
            <div className={`text-[9px] px-2 py-0.5 rounded-full inline-block mb-2 ${getStatusColor(node.status)}`}>
              {node.status.toUpperCase()}
            </div>

            <div className="text-sm font-bold text-text-primary mb-2">{node.label}</div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-text-muted">Health</span>
                <span className="text-xs font-bold text-orange-400">{node.health}%</span>
              </div>
              <div className="h-1 bg-section-bg rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${node.health}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <div className="text-[10px] text-text-primary font-semibold mb-2">
              {node.keyMetric}
            </div>

            <div className={`text-[8px] px-2 py-1 rounded border ${getRiskColor(node.risk)} inline-block`}>
              Risk: {node.risk.toUpperCase()}
            </div>

            {hasChildren && (
              <div className="mt-2 flex items-center justify-center gap-1 text-[8px] text-orange-400">
                <motion.svg 
                  className="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
                {isExpanded ? 'Collapse' : `Expand (${node.children.length})`}
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Children with Branch Lines (Horizontal Expansion) */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 pt-2 relative"
            >
              {/* SVG Branch Connector Lines */}
              <svg 
                className="absolute left-[-24px] top-0 pointer-events-none" 
                style={{ 
                  width: '24px', 
                  height: '100%',
                  zIndex: 1
                }}
              >
                <defs>
                  {/* Gradient for branch lines */}
                  <linearGradient id={`branchGradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FFA94D" stopOpacity="0.7" />
                  </linearGradient>
                  
                  {/* Glow filter */}
                  <filter id={`branchGlow-${node.id}`} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feFlood floodColor="#FF8C42" floodOpacity="0.7" />
                    <feComposite in2="blur" operator="in" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Vertical main branch connecting all children */}
                {node.children.length > 1 && (
                  <motion.line
                    x1="0"
                    y1="60"
                    x2="0"
                    y2={(node.children.length - 1) * 120 + 60}
                    stroke={`url(#branchGradient-${node.id})`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter={`url(#branchGlow-${node.id})`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}
                
                {/* Horizontal branches to each child */}
                {node.children.map((child, index) => (
                  <motion.line
                    key={child.id}
                    x1="0"
                    y1={index * 120 + 60}
                    x2="24"
                    y2={index * 120 + 60}
                    stroke={`url(#branchGradient-${node.id})`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter={`url(#branchGlow-${node.id})`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                  />
                ))}
              </svg>
              
              {/* Child Nodes */}
              {node.children.map(child => renderTree(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <AnalyticsLayout>
      {/* Fixed Header with KPIs */}
      <div className="sticky top-0 z-20 bg-app-bg/95 backdrop-blur-xl border-b border-border-subtle">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-full mx-auto px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 tracking-wide" style={{ fontWeight: 700 }}>Intelligence Mindmap</h2>
              <p className="text-sm text-slate-300 font-semibold">Explore and expand AI intelligence branches dynamically</p>
            </div>
            
            {loading ? (
              <div className="text-center">
                <div className="text-xs text-text-muted">Loading system metrics...</div>
              </div>
            ) : systemHealth ? (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-[10px] text-text-muted mb-1">Pipeline Health</div>
                  <div className="text-xl font-bold text-green-400">{systemHealth.overall}%</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-text-muted mb-1">Projected ROI</div>
                  <div className="text-xl font-bold text-orange-400">{systemHealth.projectedROI}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-text-muted mb-1">Deployment</div>
                  <div className="text-xl font-bold text-cyan-400">{systemHealth.deploymentReadiness}%</div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-xs text-text-muted">No system metrics available</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Main Container: Split Layout with Resizable Divider */}
      <div className="flex h-[calc(100vh-200px)] overflow-hidden">
        {/* LEFT: Tree Canvas (Horizontal Scroll) */}
        <div 
          className="overflow-x-auto overflow-y-auto bg-card-bg/80 backdrop-blur-xl relative"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="p-8 min-w-max">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-muted">Loading intelligence tree from backend...</p>
              </div>
            ) : treeStructure ? (
              renderTree(treeStructure)
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted">No intelligence tree data available yet.</p>
                <p className="text-text-muted text-sm mt-2">Please complete analysis first.</p>
              </div>
            )}
          </div>
        </div>

        {/* DRAGGABLE DIVIDER */}
        <div
          className="w-[6px] cursor-col-resize bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 hover:w-[8px] transition-all duration-200 relative group flex-shrink-0"
          onMouseDown={handleMouseDown}
          style={{ 
            boxShadow: isDragging ? '0 0 20px rgba(255, 140, 66, 0.6)' : '0 0 10px rgba(255, 140, 66, 0.3)'
          }}
        >
          {/* Drag indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* RIGHT: Detail Panel (Vertical Scroll) */}
        <div 
          className="overflow-y-auto bg-section-bg/90 backdrop-blur-xl"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="p-6">
            {selectedNode ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-full mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-xs font-bold text-orange-400">NODE DETAILS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">{selectedNode.label}</h3>
                  <p className="text-sm text-text-muted">Detailed operational breakdown and business impact</p>
                </div>

                {selectedNode.details && (
                  <div className="space-y-4">
                    {/* Business Impact */}
                    <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        <h4 className="text-xs font-bold text-orange-400 uppercase">Business Impact</h4>
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed">{selectedNode.details.businessImpact}</p>
                    </div>

                    {/* Description */}
                    {selectedNode.details.description && (
                      <div className="p-4 bg-card-bg/50 rounded-lg border border-border-subtle">
                        <h4 className="text-xs font-semibold text-cyan-400 mb-2 uppercase">Description</h4>
                        <p className="text-sm text-text-muted leading-relaxed">{selectedNode.details.description}</p>
                      </div>
                    )}

                    {/* Metrics */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full" />
                        <h4 className="text-xs font-bold text-cyan-400 uppercase">Key Metrics</h4>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(selectedNode.details.metrics).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:border-cyan-500/30 transition-all">
                            <span className="text-xs text-slate-400 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm font-bold text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="w-16 h-16 text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-text-muted text-sm">Select a node to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnalyticsLayout>
  )
}
