import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Layout = ({ children }) => {
  const { user, profile, signOut, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/classmates', label: 'Classmates', icon: '👥' },
    { path: '/badges', label: 'Badges', icon: '🏆' },
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yearbook-cream via-pepe-50 to-yearbook-cream">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-pepe-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and main navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-pepe-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">🐸</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-pepe-700 font-handwriting">
                    Crypto Yearbook
                  </h1>
                  <p className="text-xs text-pepe-600">Class of 2025</p>
                </div>
              </Link>

              {/* Desktop navigation */}
              <div className="hidden md:flex space-x-8 ml-10">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveRoute(item.path)
                        ? 'bg-pepe-100 text-pepe-700'
                        : 'text-gray-600 hover:text-pepe-600 hover:bg-pepe-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-pepe-600 rounded-full hover:bg-pepe-50 transition-colors">
                <span className="sr-only">Notifications</span>
                🔔
              </button>

              {/* User profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-pepe-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-pepe-200 rounded-full flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">
                        {profile?.display_name?.[0] || user?.email?.[0] || '👤'}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {profile?.display_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profile?.username ? `@${profile.username}` : 'Set username'}
                    </p>
                  </div>
                  <span className="text-gray-400">▼</span>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        {profile?.display_name || 'Welcome!'}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pepe-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      👤 Edit Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pepe-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    
                    <div className="border-t border-gray-200 mt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          handleSignOut()
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        disabled={loading}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-pepe-600 rounded-md"
              >
                <span className="sr-only">Open menu</span>
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile navigation menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActiveRoute(item.path)
                        ? 'bg-pepe-100 text-pepe-700'
                        : 'text-gray-600 hover:text-pepe-600 hover:bg-pepe-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-pepe-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-pepe-500 rounded-full flex items-center justify-center">
                <span>🐸</span>
              </div>
              <span className="text-lg font-bold text-pepe-700 font-handwriting">
                Crypto Yearbook
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Celebrating the Class of 2025 - The Crypto Natives
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-pepe-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-pepe-600 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-pepe-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Click outside handler for dropdowns */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsMenuOpen(false)
            setIsUserMenuOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default Layout