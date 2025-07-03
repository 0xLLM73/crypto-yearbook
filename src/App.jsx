import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import YearbookPage from './components/YearbookPage'
import AuthPage from './components/AuthPage'
import TestSignIn from './components/TestSignIn'

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

// Development Test Component (only in dev mode)
const DevTestComponent = () => {
  // Only show in development mode
  if (!import.meta.env.DEV) {
    return <Navigate to="/auth" replace />
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🧪</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Development Mode</h1>
        <p className="text-gray-600 mb-6">
          This is a development-only testing interface.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/test'}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🧪 Authentication Tests
          </button>
          
          <button
            onClick={() => window.location.href = '/auth'}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🔑 Go to Authentication
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Development mode only - not available in production
        </p>
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
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Development Test Route - Outside Auth Provider */}
          <Route path="/test" element={<TestSignIn />} />
          
          {/* Development Landing - Only in dev mode */}
          <Route path="/dev" element={<DevTestComponent />} />
          
          {/* Public Auth Route */}
          <Route path="/auth" element={
            <AuthProvider>
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            </AuthProvider>
          } />
          
          {/* All Protected Routes */}
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
                
                {/* Catch all route - redirect to home or auth */}
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