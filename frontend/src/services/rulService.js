import apiClient from './apiClient'

/**
 * RUL Service - Handles all RUL backend API calls
 * All endpoints are prefixed with /rul/api/
 */

/**
 * Step 1: Start Intent Analysis
 * Analyzes user query and determines if clarification questions are needed
 * @param {string} query - User's question
 * @returns {Promise} Response with session_id, has_questions, total_questions
 */
export const analyzeQuery = async (query) => {
  try {
    const response = await apiClient.post('/rul/api/analyze-query', {
      query
    })
    return response.data
  } catch (error) {
    console.error('Error in analyzeQuery:', error)
    throw error
  }
}

/**
 * Step 2: Poll Analysis Status
 * Checks the current status of the analysis
 * @param {string} sessionId - Session ID from analyze-query
 * @returns {Promise} Response with status, progress, etc.
 */
export const getAnalysisStatus = async (sessionId) => {
  try {
    const response = await apiClient.get('/rul/api/analysis-status', {
      params: {
        session_id: sessionId
      }
    })
    return response.data
  } catch (error) {
    console.error('Error in getAnalysisStatus:', error)
    throw error
  }
}

/**
 * Step 3: Send Follow-up Answers
 * Submits answers to clarification questions
 * @param {string} sessionId - Session ID
 * @param {object} answers - User's answers to clarification questions
 * @returns {Promise} Response confirming answers received
 */
export const sendFollowupAnswers = async (sessionId, answers) => {
  try {
    const response = await apiClient.post('/rul/api/ask-followup', {
      session_id: sessionId,
      answers
    })
    return response.data
  } catch (error) {
    console.error('Error in sendFollowupAnswers:', error)
    throw error
  }
}

/**
 * Step 4: Trigger Main RUL Computation
 * Starts the main RUL analysis computation
 * @param {string} sessionId - Session ID
 * @returns {Promise} Response confirming analysis started
 */
export const runAnalysis = async (sessionId) => {
  try {
    const response = await apiClient.post('/rul/api/run-analysis', {
      session_id: sessionId
    })
    return response.data
  } catch (error) {
    console.error('Error in runAnalysis:', error)
    throw error
  }
}

/**
 * Step 5: Fetch Generated Reports
 * Retrieves all generated files (CSV, images, artifacts)
 * @param {string} sessionId - Session ID
 * @returns {Promise} Response with file URLs and metadata
 */
export const getGeneratedFiles = async (sessionId) => {
  try {
    const response = await apiClient.get('/rul/api/get-generated-files', {
      params: {
        session_id: sessionId
      }
    })
    return response.data
  } catch (error) {
    console.error('Error in getGeneratedFiles:', error)
    throw error
  }
}

/**
 * Polling utility for analysis status
 * Polls the status endpoint until completion or failure
 * @param {string} sessionId - Session ID
 * @param {function} onUpdate - Callback for status updates
 * @param {number} interval - Polling interval in ms (default: 3000)
 * @returns {Promise} Resolves when analysis is complete
 */
export const pollAnalysisStatus = async (sessionId, onUpdate, interval = 3000) => {
  return new Promise((resolve, reject) => {
    let pollCount = 0
    const maxPolls = 200 // Maximum 10 minutes (200 * 3s)

    const poll = async () => {
      try {
        pollCount++
        
        if (pollCount > maxPolls) {
          clearInterval(pollInterval)
          reject(new Error('Analysis timeout - exceeded maximum polling time'))
          return
        }

        const status = await getAnalysisStatus(sessionId)
        
        // Call update callback
        if (onUpdate) {
          onUpdate(status)
        }

        // Check if completed or failed
        if (status.status === 'completed') {
          clearInterval(pollInterval)
          resolve(status)
        } else if (status.status === 'failed' || status.status === 'error') {
          clearInterval(pollInterval)
          reject(new Error(status.message || 'Analysis failed'))
        }
      } catch (error) {
        clearInterval(pollInterval)
        reject(error)
      }
    }

    // Start polling
    const pollInterval = setInterval(poll, interval)
    
    // Initial poll
    poll()
  })
}

export default {
  analyzeQuery,
  getAnalysisStatus,
  sendFollowupAnswers,
  runAnalysis,
  getGeneratedFiles,
  pollAnalysisStatus
}
