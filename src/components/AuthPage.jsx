import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {
  const { signIn, signUp, resetPassword, error, loading, clearError } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin') // 'signin', 'signup', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: ''
  })
  const [localError, setLocalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (localError) setLocalError('')
    if (error) clearError()
  }

  const validateForm = () => {
    const { email, password, confirmPassword, displayName, username } = formData

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address')
      return false
    }

    if (mode === 'signin') {
      if (!password) {
        setLocalError('Please enter your password')
        return false
      }
    }

    if (mode === 'signup') {
      if (!password || password.length < 6) {
        setLocalError('Password must be at least 6 characters long')
        return false
      }

      if (password !== confirmPassword) {
        setLocalError('Passwords do not match')
        return false
      }

      if (!displayName || displayName.length < 2) {
        setLocalError('Display name must be at least 2 characters long')
        return false
      }

      if (!username || username.length < 3) {
        setLocalError('Username must be at least 3 characters long')
        return false
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setLocalError('Username can only contain letters, numbers, and underscores')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLocalError('')
      setSuccessMessage('')

      if (mode === 'signin') {
        const { data, error } = await signIn(formData.email, formData.password)
        if (!error && data?.user) {
          navigate('/')
        }
      } else if (mode === 'signup') {
        const { data, error } = await signUp(formData.email, formData.password, {
          display_name: formData.displayName,
          username: formData.username
        })
        if (!error) {
          setSuccessMessage('Account created! Please check your email to verify your account.')
          setMode('signin')
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(formData.email)
        if (!error) {
          setSuccessMessage('Password reset email sent! Check your inbox.')
          setMode('signin')
        }
      }
    } catch (err) {
      setLocalError(err.message || 'An unexpected error occurred')
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setLocalError('')
    setSuccessMessage('')
    clearError()
    setFormData({
      email: formData.email, // Keep email when switching modes
      password: '',
      confirmPassword: '',
      displayName: '',
      username: ''
    })
  }

  const currentError = localError || error

  return (
    <div className="min-h-screen bg-gradient-to-br from-yearbook-cream via-pepe-50 to-yearbook-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pepe-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🐸</span>
          </div>
          <h1 className="text-3xl font-bold text-pepe-700 mb-2 font-handwriting">
            Crypto Yearbook
          </h1>
          <p className="text-gray-600">
            {mode === 'signin' && 'Welcome back to the Class of 2025'}
            {mode === 'signup' && 'Join the Class of 2025 - The Crypto Natives'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {/* Mode Tabs */}
          {mode !== 'reset' && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => switchMode('signin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-pepe-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-pepe-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span className="text-green-700">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {currentError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <span className="text-red-700">{currentError}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="yearbook-input"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password (Sign In & Sign Up) */}
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="yearbook-input"
                  placeholder="Enter your password"
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </div>
            )}

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="yearbook-input"
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* Display Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="yearbook-input"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            {/* Username (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="yearbook-input"
                  placeholder="crypto_username"
                  required
                  autoComplete="username"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Letters, numbers, and underscores only
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`yearbook-button w-full py-3 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin">⏳</span>
                  <span>
                    {mode === 'signin' && 'Signing In...'}
                    {mode === 'signup' && 'Creating Account...'}
                    {mode === 'reset' && 'Sending Reset Email...'}
                  </span>
                </span>
              ) : (
                <>
                  {mode === 'signin' && '🔑 Sign In'}
                  {mode === 'signup' && '🚀 Create Account'}
                  {mode === 'reset' && '📧 Send Reset Email'}
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <button
                onClick={() => switchMode('reset')}
                className="text-sm text-pepe-600 hover:text-pepe-700 font-medium"
              >
                Forgot your password?
              </button>
            )}

            {mode === 'reset' && (
              <button
                onClick={() => switchMode('signin')}
                className="text-sm text-pepe-600 hover:text-pepe-700 font-medium"
              >
                ← Back to Sign In
              </button>
            )}
          </div>

          {/* Terms & Privacy (Sign Up only) */}
          {mode === 'signup' && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-pepe-600 hover:text-pepe-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-pepe-600 hover:text-pepe-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Development Info */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <p className="font-medium text-yellow-800 mb-2">Development Mode</p>
            <p className="text-yellow-700">
              Make sure to set up your <code>.env</code> file with Supabase credentials:
            </p>
            <ul className="text-yellow-700 mt-2 space-y-1">
              <li>• <code>VITE_SUPABASE_URL</code></li>
              <li>• <code>VITE_SUPABASE_ANON_KEY</code></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage