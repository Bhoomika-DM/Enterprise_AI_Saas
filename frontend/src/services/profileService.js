import apiClient from './apiClient'

/**
 * Profile Service
 * Handles all API calls for user profile management
 */

/**
 * Get user profile data
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/api/profile')
    return response.data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    throw error
  }
}

/**
 * Update user profile data
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/api/profile', profileData)
    return response.data
  } catch (error) {
    console.error('Failed to update user profile:', error)
    throw error
  }
}

/**
 * Get user settings
 * @returns {Promise} User settings
 */
export const getUserSettings = async () => {
  try {
    const response = await apiClient.get('/api/profile/settings')
    return response.data
  } catch (error) {
    console.error('Failed to fetch user settings:', error)
    throw error
  }
}

/**
 * Update user settings
 * @param {Object} settings - Updated settings
 * @returns {Promise} Updated settings
 */
export const updateUserSettings = async (settings) => {
  try {
    const response = await apiClient.put('/api/profile/settings', settings)
    return response.data
  } catch (error) {
    console.error('Failed to update user settings:', error)
    throw error
  }
}

/**
 * Get user activity history
 * @returns {Promise} Activity history
 */
export const getUserActivity = async () => {
  try {
    const response = await apiClient.get('/api/profile/activity')
    return response.data
  } catch (error) {
    console.error('Failed to fetch user activity:', error)
    throw error
  }
}

/**
 * Get user integrations
 * @returns {Promise} Integration status
 */
export const getUserIntegrations = async () => {
  try {
    const response = await apiClient.get('/api/profile/integrations')
    return response.data
  } catch (error) {
    console.error('Failed to fetch user integrations:', error)
    throw error
  }
}

/**
 * Connect integration
 * @param {string} integrationId - Integration identifier
 * @returns {Promise} Connection status
 */
export const connectIntegration = async (integrationId) => {
  try {
    const response = await apiClient.post(`/api/profile/integrations/${integrationId}/connect`)
    return response.data
  } catch (error) {
    console.error(`Failed to connect integration ${integrationId}:`, error)
    throw error
  }
}

/**
 * Disconnect integration
 * @param {string} integrationId - Integration identifier
 * @returns {Promise} Disconnection status
 */
export const disconnectIntegration = async (integrationId) => {
  try {
    const response = await apiClient.post(`/api/profile/integrations/${integrationId}/disconnect`)
    return response.data
  } catch (error) {
    console.error(`Failed to disconnect integration ${integrationId}:`, error)
    throw error
  }
}

/**
 * Change password
 * @param {Object} passwordData - Current and new password
 * @returns {Promise} Success status
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/api/profile/change-password', passwordData)
    return response.data
  } catch (error) {
    console.error('Failed to change password:', error)
    throw error
  }
}

/**
 * Upload profile image
 * @param {File} imageFile - Profile image file
 * @returns {Promise} Image URL
 */
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await apiClient.post('/api/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Failed to upload profile image:', error)
    throw error
  }
}
