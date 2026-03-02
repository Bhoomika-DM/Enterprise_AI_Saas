import apiClient from './apiClient'

/**
 * Project Health Monitor Service
 * Handles all API calls for enterprise project health monitoring
 */

/**
 * Get project health overview
 * @returns {Promise} Project health overview data
 */
export const getProjectHealthOverview = async () => {
  try {
    console.log('🔵 [ProjectHealth] Fetching overview from backend')
    const response = await apiClient.get('/api/project-health/overview')
    console.log('✅ [ProjectHealth] Overview loaded from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to fetch overview:', error)
    throw error
  }
}

/**
 * Get project health status cards
 * @returns {Promise} Status cards data
 */
export const getProjectHealthCards = async () => {
  try {
    console.log('🔵 [ProjectHealth] Fetching cards from backend')
    const response = await apiClient.get('/api/project-health/cards')
    console.log('✅ [ProjectHealth] Cards loaded from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to fetch cards:', error)
    throw error
  }
}

/**
 * Get filter options
 * @returns {Promise} Available filters
 */
export const getProjectFilters = async () => {
  try {
    console.log('🔵 [ProjectHealth] Fetching filters from backend')
    const response = await apiClient.get('/api/project-health/filters')
    console.log('✅ [ProjectHealth] Filters loaded from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to fetch filters:', error)
    throw error
  }
}

/**
 * Get filtered projects
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Filtered project list
 */
export const getFilteredProjects = async (filters) => {
  try {
    console.log('🔵 [ProjectHealth] Fetching filtered projects from backend')
    const response = await apiClient.post('/api/project-health/filter', filters)
    console.log('✅ [ProjectHealth] Filtered projects loaded from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to fetch filtered projects:', error)
    throw error
  }
}

/**
 * Run crisis simulation
 * @param {string} projectId - Project identifier
 * @returns {Promise} Simulation results
 */
export const runCrisisSimulation = async (projectId) => {
  try {
    console.log('🔵 [ProjectHealth] Running crisis simulation on backend')
    const response = await apiClient.post('/api/project-health/simulate-crisis', { projectId })
    console.log('✅ [ProjectHealth] Simulation completed on backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to run crisis simulation:', error)
    throw error
  }
}

/**
 * Send AI project query
 * @param {string} query - Natural language query
 * @returns {Promise} AI response
 */
export const sendProjectQuery = async (query) => {
  try {
    console.log('🔵 [ProjectHealth] Sending query to backend AI')
    const response = await apiClient.post('/api/project-health/query', { query })
    console.log('✅ [ProjectHealth] AI response received from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to send project query:', error)
    throw error
  }
}

/**
 * Get early warning alerts
 * @returns {Promise} Warning alerts
 */
export const getEarlyWarnings = async () => {
  try {
    console.log('🔵 [ProjectHealth] Fetching warnings from backend')
    const response = await apiClient.get('/api/project-health/warnings')
    console.log('✅ [ProjectHealth] Warnings loaded from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to fetch warnings:', error)
    throw error
  }
}

/**
 * Get project summary metrics
 * @returns {Promise} Summary metrics
 */
export const getProjectSummary = async () => {
  try {
    console.log('🔵 [ProjectHealth] Fetching summary from backend')
    const response = await apiClient.get('/api/project-health/summary')
    console.log('✅ [ProjectHealth] Summary loaded from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to fetch summary:', error)
    throw error
  }
}

/**
 * Get project list for dropdown
 * @returns {Promise} Project list
 */
export const getProjectList = async () => {
  try {
    console.log('🔵 [ProjectHealth] Fetching project list from backend')
    const response = await apiClient.get('/api/project-health/projects')
    console.log('✅ [ProjectHealth] Project list loaded from backend')
    return response.data
  } catch (error) {
    console.error('❌ [ProjectHealth] Failed to fetch project list:', error)
    throw error
  }
}
