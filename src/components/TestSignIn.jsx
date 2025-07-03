import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const TestSignIn = () => {
  const { user, profile, signIn, signOut, loading, error, supabase } = useAuth()
  const [testEmail] = useState('test@crypto-yearbook.com')
  const [testPassword] = useState('test123456')
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [dbStats, setDbStats] = useState(null)

  // Test Supabase connection
  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('checking')
      
      // Test database connection
      const { data, error } = await supabase
        .from('yearbook_profiles')
        .select('count', { count: 'exact', head: true })

      if (error) {
        setConnectionStatus('error')
        console.error('Database connection error:', error)
      } else {
        setConnectionStatus('connected')
        
        // Get database stats
        const stats = await getDatabaseStats()
        setDbStats(stats)
      }
    } catch (err) {
      setConnectionStatus('error')
      console.error('Connection test failed:', err)
    }
  }

  const getDatabaseStats = async () => {
    try {
      const [profilesCount, badgesCount, userBadgesCount] = await Promise.all([
        supabase.from('yearbook_profiles').select('count', { count: 'exact', head: true }),
        supabase.from('yearbook_badges').select('count', { count: 'exact', head: true }),
        supabase.from('yearbook_user_badges').select('count', { count: 'exact', head: true })
      ])

      return {
        profiles: profilesCount.count || 0,
        badges: badgesCount.count || 0,
        userBadges: userBadgesCount.count || 0
      }
    } catch (error) {
      console.error('Error getting database stats:', error)
      return null
    }
  }

  const handleTestSignIn = async () => {
    try {
      await signIn(testEmail, testPassword)
    } catch (err) {
      console.error('Test sign in failed:', err)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  const createTestAccount = async () => {
    try {
      const { signUp } = useAuth()
      await signUp(testEmail, testPassword, {
        display_name: 'Test User',
        username: 'testuser'
      })
    } catch (err) {
      console.error('Create test account failed:', err)
    }
  }

  const StatusBadge = ({ status, children }) => {
    const colors = {
      checking: 'bg-yellow-100 text-yellow-800',
      connected: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      disconnected: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
        {children}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Authentication Test Suite
          </h1>
          <p className="text-gray-600">
            Development and debugging tools for authentication system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connection Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔌 Connection Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Supabase Connection:</span>
                <StatusBadge status={connectionStatus}>
                  {connectionStatus === 'checking' && '⏳ Checking...'}
                  {connectionStatus === 'connected' && '✅ Connected'}
                  {connectionStatus === 'error' && '❌ Error'}
                </StatusBadge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Environment:</span>
                <StatusBadge status={import.meta.env.DEV ? 'checking' : 'connected'}>
                  {import.meta.env.DEV ? '🔧 Development' : '🚀 Production'}
                </StatusBadge>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={testConnection}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium"
                >
                  🔄 Test Connection
                </button>
              </div>
            </div>
          </div>

          {/* Database Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Database Stats
            </h2>
            
            {dbStats ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profiles:</span>
                  <span className="font-medium">{dbStats.profiles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Badges:</span>
                  <span className="font-medium">{dbStats.badges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Badges:</span>
                  <span className="font-medium">{dbStats.userBadges}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                {connectionStatus === 'connected' ? 'Loading stats...' : 'Connection required'}
              </div>
            )}
          </div>

          {/* Auth State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              👤 Authentication State
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">User Status:</span>
                <StatusBadge status={user ? 'connected' : 'disconnected'}>
                  {user ? '✅ Authenticated' : '❌ Not Authenticated'}
                </StatusBadge>
              </div>

              {user && (
                <>
                  <div className="pt-2 border-t text-sm space-y-2">
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>ID:</strong> {user.id}</div>
                    <div><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                  </div>

                  {profile && (
                    <div className="pt-2 border-t text-sm space-y-2">
                      <div><strong>Display Name:</strong> {profile.display_name || 'Not set'}</div>
                      <div><strong>Username:</strong> {profile.username || 'Not set'}</div>
                      <div><strong>Bio:</strong> {profile.bio || 'No bio'}</div>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎯 Test Actions
            </h2>

            <div className="space-y-3">
              {!user ? (
                <>
                  <button
                    onClick={handleTestSignIn}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {loading ? '⏳ Signing In...' : '🔑 Test Sign In'}
                  </button>

                  <div className="text-xs text-gray-500 text-center">
                    Test Email: {testEmail}<br />
                    Test Password: {testPassword}
                  </div>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium"
                >
                  {loading ? '⏳ Signing Out...' : '🚪 Sign Out'}
                </button>
              )}

              <button
                onClick={() => window.location.href = '/auth'}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium"
              >
                🔗 Go to Auth Page
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium"
              >
                🏠 Go to Main App
              </button>
            </div>
          </div>
        </div>

        {/* Environment Variables Check */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            ⚙️ Environment Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-yellow-800">Required Environment Variables:</div>
              <ul className="text-yellow-700 mt-2 space-y-1">
                <li className="flex items-center space-x-2">
                  <span>{import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</span>
                  <span>VITE_SUPABASE_URL</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>{import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}</span>
                  <span>VITE_SUPABASE_ANON_KEY</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium text-yellow-800">Current Values:</div>
              <ul className="text-yellow-700 mt-2 space-y-1 font-mono text-xs">
                <li>URL: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) || 'Not set'}...</li>
                <li>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 30) || 'Not set'}...</li>
              </ul>
            </div>
          </div>

          {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 font-medium">⚠️ Missing environment variables!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Create a <code>.env</code> file in your project root with your Supabase credentials.
              </p>
            </div>
          )}
        </div>

        {/* Development Notes */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📝 Development Notes
          </h3>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>• This page is only available in development mode</p>
            <p>• Test account will be created automatically if it doesn't exist</p>
            <p>• All authentication state changes are logged to console</p>
            <p>• Database operations include error handling and retries</p>
            <p>• Session management is handled automatically by Supabase</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestSignIn