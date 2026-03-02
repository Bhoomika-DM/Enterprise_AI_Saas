import apiClient from './apiClient'

/**
 * Marketing Analytics Service
 * Handles all API calls for marketing analytics features
 */

/**
 * Get page configuration for Marketing Chat
 * @returns {Promise} Page configuration data
 */
export const getMarketingChatConfig = async () => {
  try {
    const response = await apiClient.get('/api/marketing/chat/config')
    return response.data
  } catch (error) {
    console.error('Failed to fetch marketing chat config:', error)
    throw error
  }
}

/**
 * Send a message to the marketing analytics AI
 * @param {string} question - User's question
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @returns {Promise} AI response
 */
export const sendMarketingQuery = async (question, sessionId = null) => {
  try {
    const payload = {
      question,
      ...(sessionId && { session_id: sessionId })
    }
    
    const response = await apiClient.post('/api/marketing/chat', payload)
    return response.data
  } catch (error) {
    console.error('Failed to send marketing query:', error)
    throw error
  }
}

/**
 * Get dashboard data for Marketing Analytics page
 * @returns {Promise} Dashboard configuration and data
 */
export const getMarketingDashboardData = async () => {
  try {
    const response = await apiClient.get('/api/marketing/dashboard')
    return response.data
  } catch (error) {
    console.error('Failed to fetch marketing dashboard data:', error)
    throw error
  }
}

/**
 * Connect additional data sources
 * @returns {Promise} Connection status
 */
export const connectMarketingDataSources = async () => {
  try {
    const response = await apiClient.post('/api/marketing/connect-sources')
    return response.data
  } catch (error) {
    console.error('Failed to connect data sources:', error)
    throw error
  }
}
