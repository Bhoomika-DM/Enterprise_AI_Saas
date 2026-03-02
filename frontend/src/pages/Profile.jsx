import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import DotFieldBackground from '../components/DotFieldBackground'
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserSettings, 
  updateUserSettings,
  getUserActivity,
  getUserIntegrations,
  connectIntegration,
  disconnectIntegration
} from '../services/profileService'

export default function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // User data state
  const [userData, setUserData] = useState(null)

  // Settings state
  const [settings, setSettings] = useState(null)
  
  // Activity state
  const [activities, setActivities] = useState([])
  
  // Integrations state
  const [integrations, setIntegrations] = useState([])
  
  // Helper function to render activity icons
  const renderActivityIcon = (iconType) => {
    const iconMap = {
      'analysis': (
        <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'settings': (
        <svg className="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'export': (
        <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      'share': (
        <svg className="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      'connect': (
        <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    }
    return iconMap[iconType] || iconMap['analysis']
  }
  
  // Helper function to render integration icons
  const renderIntegrationIcon = (iconType, isConnected) => {
    const color = isConnected ? 'text-accent-primary' : 'text-text-muted'
    const iconMap = {
      'analytics': (
        <svg className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'chat': (
        <svg className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      'code': (
        <svg className={`w-8 h-8 ${isConnected ? 'text-accent-secondary' : color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      'cloud': (
        <svg className={`w-8 h-8 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    }
    return iconMap[iconType] || iconMap['analytics']
  }

  const tabs = [
    { 
      id: 'personal', 
      label: 'Personal Info', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    { 
      id: 'preferences', 
      label: 'Preferences', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'activity', 
      label: 'Activity', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    }
  ]

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfileData()
  }, [])
  
  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'activity' && activities.length === 0) {
      fetchActivity()
    } else if (activeTab === 'integrations' && integrations.length === 0) {
      fetchIntegrations()
    }
  }, [activeTab])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      console.log('🔵 [Profile] Fetching profile data from backend')
      
      const [profileData, settingsData] = await Promise.all([
        getUserProfile(),
        getUserSettings()
      ])
      
      console.log('✅ [Profile] Data received:', { profileData, settingsData })
      setUserData(profileData)
      setSettings(settingsData)
      setLoading(false)
    } catch (err) {
      console.error('❌ [Profile] Failed to fetch profile data:', err)
      setError('Failed to load profile data')
      setLoading(false)
    }
  }

  const fetchActivity = async () => {
    try {
      console.log('🔵 [Profile] Fetching activity data')
      const activityData = await getUserActivity()
      console.log('✅ [Profile] Activity data received:', activityData)
      setActivities(activityData.activities || [])
    } catch (err) {
      console.error('❌ [Profile] Failed to fetch activity:', err)
    }
  }

  const fetchIntegrations = async () => {
    try {
      console.log('🔵 [Profile] Fetching integrations data')
      const integrationsData = await getUserIntegrations()
      console.log('✅ [Profile] Integrations data received:', integrationsData)
      setIntegrations(integrationsData.integrations || [])
    } catch (err) {
      console.error('❌ [Profile] Failed to fetch integrations:', err)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      console.log('🔵 [Profile] Saving profile data')
      
      const updatedData = await updateUserProfile(userData)
      console.log('✅ [Profile] Profile updated successfully')
      
      setUserData(updatedData)
      setIsSaving(false)
      setIsEditing(false)
    } catch (err) {
      console.error('❌ [Profile] Failed to save profile:', err)
      setError('Failed to save profile')
      setIsSaving(false)
    }
  }

  const handleSettingsChange = async (newSettings) => {
    try {
      console.log('🔵 [Profile] Updating settings')
      setSettings(newSettings)
      
      const updatedSettings = await updateUserSettings(newSettings)
      console.log('✅ [Profile] Settings updated successfully')
      setSettings(updatedSettings)
    } catch (err) {
      console.error('❌ [Profile] Failed to update settings:', err)
    }
  }

  const handleIntegrationToggle = async (integrationId, currentStatus) => {
    try {
      console.log(`🔵 [Profile] Toggling integration: ${integrationId}`)
      
      if (currentStatus === 'Connected') {
        await disconnectIntegration(integrationId)
        console.log(`✅ [Profile] Disconnected: ${integrationId}`)
      } else {
        await connectIntegration(integrationId)
        console.log(`✅ [Profile] Connected: ${integrationId}`)
      }
      
      // Refresh integrations
      fetchIntegrations()
    } catch (err) {
      console.error(`❌ [Profile] Failed to toggle integration ${integrationId}:`, err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-primary">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userData || !settings) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden">
      <Sidebar />

      {/* Animated Background */}
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
      </div>

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
              <div className="flex items-center h-full">
                <img 
                  src="/assets/Intellectus-logo-2D.jpeg" 
                  alt="Intellectus AI Labs" 
                  style={{ height: '72px', width: 'auto' }}
                  className="object-contain"
                />
              </div>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="text-text-body hover:text-text-primary transition-colors duration-300 text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-text-primary mb-2">Profile Settings</h1>
              <p className="text-text-body">Manage your account settings and preferences</p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex gap-2 mb-8 overflow-x-auto pb-2"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-accent-primary text-white'
                      : 'bg-card-bg/80 text-text-body hover:bg-section-bg hover:text-text-primary'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card-bg/80 backdrop-blur-xl rounded-2xl p-8 border border-border-subtle"
            >
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-text-primary">Personal Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-all"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-section-bg text-text-body rounded-lg hover:bg-border-subtle transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-all disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Profile Image */}
                  <div className="flex items-center gap-6 pb-6 border-b border-border-subtle">
                    <div className="w-24 h-24 rounded-full bg-accent-primary/20 flex items-center justify-center text-4xl">
                      {userData.profileImage ? (
                        <img src={userData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>{userData.firstName[0]}{userData.lastName[0]}</span>
                      )}
                    </div>
                    {isEditing && (
                      <button className="px-4 py-2 bg-section-bg text-text-primary rounded-lg hover:bg-border-subtle transition-all">
                        Change Photo
                      </button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">First Name</label>
                      <input
                        type="text"
                        value={userData.firstName}
                        onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Last Name</label>
                      <input
                        type="text"
                        value={userData.lastName}
                        onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Phone</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Job Title</label>
                      <input
                        type="text"
                        value={userData.jobTitle}
                        onChange={(e) => setUserData({...userData, jobTitle: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Department</label>
                      <input
                        type="text"
                        value={userData.department}
                        onChange={(e) => setUserData({...userData, department: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-body mb-2">Location</label>
                      <input
                        type="text"
                        value={userData.location}
                        onChange={(e) => setUserData({...userData, location: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-body mb-2">Bio</label>
                      <textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 bg-section-bg border border-border-subtle rounded-lg text-text-primary disabled:opacity-50 focus:outline-none focus:border-accent-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-text-primary mb-6">Security Settings</h2>
                  
                  {/* Change Password */}
                  <div className="p-6 bg-section-bg rounded-lg border border-border-subtle">
                    <h3 className="text-lg font-medium text-text-primary mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-body mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-body mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-body mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-all"
                        />
                      </div>
                      <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-6 bg-section-bg rounded-lg border border-border-subtle">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-text-body">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingsChange({...settings, twoFactorAuth: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-section-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                      </label>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-6 bg-section-bg rounded-lg border border-border-subtle">
                    <h3 className="text-lg font-medium text-text-primary mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-app-bg rounded-lg">
                        <div>
                          <p className="text-text-primary font-medium">Current Session</p>
                          <p className="text-sm text-text-body">Chrome on Windows • San Francisco, CA</p>
                        </div>
                        <span className="text-xs text-green-500">Active Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-text-primary mb-6">Preferences</h2>
                  
                  {/* Notifications */}
                  <div className="p-6 bg-section-bg rounded-lg border border-border-subtle space-y-4">
                    <h3 className="text-lg font-medium text-text-primary mb-4">Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-primary font-medium">Email Notifications</p>
                        <p className="text-sm text-text-body">Receive email updates about your activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingsChange({...settings, emailNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-app-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-primary font-medium">Weekly Report</p>
                        <p className="text-sm text-text-body">Get a weekly summary of your analytics</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.weeklyReport}
                          onChange={(e) => handleSettingsChange({...settings, weeklyReport: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-app-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                      </label>
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div className="p-6 bg-section-bg rounded-lg border border-border-subtle space-y-4">
                    <h3 className="text-lg font-medium text-text-primary mb-4">Display</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Theme</label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleSettingsChange({...settings, theme: e.target.value})}
                        className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-all"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingsChange({...settings, language: e.target.value})}
                        className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-all"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-body mb-2">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingsChange({...settings, timezone: e.target.value})}
                        className="w-full px-4 py-3 bg-app-bg border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-all"
                      >
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-text-primary mb-6">Recent Activity</h2>
                  
                  {activities.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-text-muted">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-section-bg rounded-lg border border-border-subtle">
                          {renderActivityIcon(item.iconType)}
                          <div className="flex-1">
                            <p className="text-text-primary font-medium">{item.action}</p>
                            <p className="text-sm text-text-body">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-text-primary mb-6">Integrations</h2>
                  
                  {integrations.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-text-muted">No integrations available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {integrations.map((integration, index) => (
                        <div key={index} className="p-6 bg-section-bg rounded-lg border border-border-subtle">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {renderIntegrationIcon(integration.iconType, integration.status === 'Connected')}
                              <div>
                                <h3 className="text-lg font-medium text-text-primary">{integration.name}</h3>
                                <p className={`text-sm ${integration.status === 'Connected' ? 'text-green-500' : 'text-text-body'}`}>
                                  {integration.status}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleIntegrationToggle(integration.id, integration.status)}
                            className={`w-full px-4 py-2 rounded-lg transition-all ${
                              integration.status === 'Connected'
                                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                : 'bg-accent-primary text-white hover:bg-accent-primary/90'
                            }`}
                          >
                            {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 bg-red-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30"
            >
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Danger Zone</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary font-medium mb-1">Log Out</p>
                  <p className="text-sm text-text-body">Sign out of your account</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
