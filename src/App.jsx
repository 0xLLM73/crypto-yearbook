import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import YearbookPage from './components/YearbookPage'
import AuthPage from './components/AuthPage'
import TestSignIn from './components/TestSignIn'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yearbook-cream via-pepe-50 to-yearbook-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pepe-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-2xl">🐸</span>
          </div>
          <p className="text-lg font-handwriting text-pepe-700">Loading your yearbook...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

// Public Route Component (redirects to home if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yearbook-cream via-pepe-50 to-yearbook-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pepe-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-2xl">🐸</span>
          </div>
          <p className="text-lg font-handwriting text-pepe-700">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (user) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Direct Bypass Component
const DirectBypass = () => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen bg-pepe-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🐸</div>
        <div className="text-xl">Loading...</div>
      </div>
    </div>
  }
  
  // If user is already authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yearbook-cream via-pepe-50 to-yearbook-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🐸</div>
        <h1 className="text-3xl font-bold text-pepe-700 mb-4">Crypto Yearbook</h1>
        <p className="text-gray-600 mb-6">Development Bypass Portal</p>
        
        <button
          onClick={async () => {
            // Force redirect to main app - bypass authentication entirely
            window.location.href = '/yearbook'
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
        >
          🚀 Enter Yearbook (Bypass Auth)
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          This bypasses authentication for development
        </p>
      </div>
    </div>
  )
}

// Bypass Home Component - Shows yearbook without auth
const BypassHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yearbook-cream via-pepe-50 to-yearbook-cream">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐸</div>
          <h1 className="text-4xl font-bold text-pepe-700 mb-2">Crypto Yearbook</h1>
          <p className="text-xl text-pepe-600">Class of 2025 - The Natives</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
            <strong>Development Mode:</strong> Authentication bypassed
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <YearbookPage pageNumber={1} totalPages={5} />
        </div>
        
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/auth'}
            className="bg-pepe-500 hover:bg-pepe-600 text-white font-bold py-2 px-4 rounded"
          >
            Go to Real Auth
          </button>
        </div>
      </div>
    </div>
  )
}

// Home Page Component
const HomePage = () => {
  return (
    <Layout>
      <YearbookPage pageNumber={1} totalPages={5} />
    </Layout>
  )
}

// Classmates Page Component
const ClassmatesPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-yearbook font-bold text-pepe-700 mb-4">
            All Classmates
          </h1>
          <p className="text-lg text-gray-600 font-handwriting">
            Browse through all the crypto natives in our yearbook
          </p>
        </div>
        <YearbookPage pageNumber={1} totalPages={5} />
      </div>
    </Layout>
  )
}

// Badges Page Component
const BadgesPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-yearbook font-bold text-pepe-700 mb-4">
            Achievement Badges
          </h1>
          <p className="text-lg text-gray-600 font-handwriting">
            Earn badges for your crypto achievements and milestones
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock badges */}
          {[
            { name: 'Diamond Hands', description: 'Held through major market downturns', icon: '💎', rarity: 'epic' },
            { name: 'Whale', description: 'Holds significant amounts of cryptocurrency', icon: '🐳', rarity: 'legendary' },
            { name: 'DeFi Farmer', description: 'Active in decentralized finance protocols', icon: '🌾', rarity: 'rare' },
            { name: 'NFT Collector', description: 'Owns multiple NFTs', icon: '🖼️', rarity: 'common' },
            { name: 'Meme Lord', description: 'Creates quality crypto memes', icon: '😂', rarity: 'common' },
            { name: 'Early Adopter', description: 'Got into crypto before it was cool', icon: '🚀', rarity: 'epic' },
          ].map((badge, index) => (
            <div key={index} className="bg-white rounded-lg shadow-yearbook p-6 border-2 border-pepe-300 hover:border-pepe-500 transition-colors">
              <div className="text-center">
                <div className="text-4xl mb-4">{badge.icon}</div>
                <h3 className="text-xl font-yearbook font-bold text-pepe-700 mb-2">{badge.name}</h3>
                <p className="text-gray-600 mb-4">{badge.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  badge.rarity === 'legendary' ? 'bg-crypto-bitcoin text-white' :
                  badge.rarity === 'epic' ? 'bg-crypto-purple text-white' :
                  badge.rarity === 'rare' ? 'bg-crypto-ethereum text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

function App() {
  // Check for bypass mode
  const isBypassMode = window.location.hash === '#bypass' || window.location.pathname === '/bypass'
  
  if (isBypassMode && window.location.hash === '#bypass') {
    return <BypassHome />
  }
  
  return (
    <Router>
      <div className="App">
        {/* Test Route - Outside Auth Provider */}
        <Routes>
          <Route path="/test" element={<TestSignIn />} />
          <Route path="/bypass" element={<DirectBypass />} />
          <Route path="/yearbook" element={<BypassHome />} />
          <Route path="/auth" element={
            <AuthProvider>
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            </AuthProvider>
          } />
          <Route path="/*" element={
            <AuthProvider>
              <Routes>
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/classmates" element={
                  <ProtectedRoute>
                    <ClassmatesPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/badges" element={
                  <ProtectedRoute>
                    <BadgesPage />
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App