import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const YearbookPage = ({ pageNumber = 1, totalPages = 5 }) => {
  const { supabase, user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBadge, setFilterBadge] = useState('')
  const [currentPage, setCurrentPage] = useState(pageNumber)
  const [totalProfiles, setTotalProfiles] = useState(0)
  const [badges, setBadges] = useState([])

  const PROFILES_PER_PAGE = 12

  // Fetch profiles from database
  useEffect(() => {
    fetchProfiles()
    fetchBadges()
  }, [currentPage, searchTerm, filterBadge])

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('yearbook_profiles')
        .select(`
          *,
          yearbook_user_badges (
            yearbook_badges (
              name,
              icon,
              rarity
            )
          )
        `)
        .order('created_at', { ascending: false })

      // Apply search filter
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
      }

      // Calculate pagination
      const from = (currentPage - 1) * PROFILES_PER_PAGE
      const to = from + PROFILES_PER_PAGE - 1

      const { data, error, count } = await query
        .range(from, to)

      if (error) throw error

      setProfiles(data || [])
      
      // Get total count for pagination
      const { count: totalCount } = await supabase
        .from('yearbook_profiles')
        .select('*', { count: 'exact', head: true })
      
      setTotalProfiles(totalCount || 0)
    } catch (error) {
      console.error('Error fetching profiles:', error)
      setError('Failed to load profiles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('yearbook_badges')
        .select('*')
        .order('name')

      if (error) throw error
      setBadges(data || [])
    } catch (error) {
      console.error('Error fetching badges:', error)
    }
  }

  // Mock profiles for when database is empty
  const getMockProfiles = () => [
    {
      id: '1',
      username: 'cryptowhale',
      display_name: 'Crypto Whale',
      bio: 'Diamond hands since 2010 💎🙌',
      avatar_url: null,
      favorite_crypto: 'Bitcoin',
      crypto_quote: 'HODL to the moon! 🚀',
      is_verified: true,
      yearbook_user_badges: [
        { yearbook_badges: { name: 'Diamond Hands', icon: '💎', rarity: 'epic' } },
        { yearbook_badges: { name: 'Whale', icon: '🐳', rarity: 'legendary' } }
      ]
    },
    {
      id: '2',
      username: 'nftartist',
      display_name: 'NFT Artist',
      bio: 'Creating digital art for the metaverse 🎨',
      avatar_url: null,
      favorite_crypto: 'Ethereum',
      crypto_quote: 'Art is the future of value',
      is_verified: false,
      yearbook_user_badges: [
        { yearbook_badges: { name: 'NFT Collector', icon: '🖼️', rarity: 'common' } }
      ]
    },
    {
      id: '3',
      username: 'defi_farmer',
      display_name: 'DeFi Farmer',
      bio: 'Yield farming since DeFi summer ⚡',
      avatar_url: null,
      favorite_crypto: 'Chainlink',
      crypto_quote: 'Code is law',
      is_verified: true,
      yearbook_user_badges: [
        { yearbook_badges: { name: 'DeFi Farmer', icon: '🌾', rarity: 'rare' } }
      ]
    }
  ]

  const displayProfiles = profiles.length > 0 ? profiles : getMockProfiles()
  const filteredProfiles = displayProfiles.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesBadge = !filterBadge || 
      profile.yearbook_user_badges?.some(ub => 
        ub.yearbook_badges?.name === filterBadge
      )
    
    return matchesSearch && matchesBadge
  })

  const totalFilteredPages = Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE)

  const ProfileCard = ({ profile }) => (
    <div className="yearbook-card p-6 h-full">
      {/* Profile Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-pepe-400 to-pepe-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              profile.display_name?.[0]?.toUpperCase() || '👤'
            )}
          </div>
          {profile.is_verified && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {profile.display_name || 'Anonymous'}
          </h3>
          <p className="text-sm text-gray-600">
            @{profile.username || 'username'}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {profile.bio || 'No bio yet...'}
      </p>

      {/* Crypto Info */}
      <div className="space-y-2 mb-4">
        {profile.favorite_crypto && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Favorite:</span>
            <span className="font-medium text-pepe-600">{profile.favorite_crypto}</span>
          </div>
        )}
        {profile.crypto_quote && (
          <div className="bg-pepe-50 p-2 rounded-lg">
            <p className="text-xs italic text-pepe-700">
              "{profile.crypto_quote}"
            </p>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1">
        {profile.yearbook_user_badges?.slice(0, 3).map((userBadge, index) => {
          const badge = userBadge.yearbook_badges
          return (
            <span
              key={index}
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              <span>{badge.icon}</span>
              <span>{badge.name}</span>
            </span>
          )
        })}
        {profile.yearbook_user_badges?.length > 3 && (
          <span className="text-xs text-gray-500">
            +{profile.yearbook_user_badges.length - 3} more
          </span>
        )}
      </div>
    </div>
  )

  const LoadingCard = () => (
    <div className="yearbook-card p-6 h-full animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pepe-700 mb-2 font-handwriting">
          Crypto Yearbook - Page {currentPage}
        </h1>
        <p className="text-lg text-gray-600">
          Meet the Class of 2025 - The Crypto Natives
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, username, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="yearbook-input pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Badge Filter */}
          <div className="sm:w-48">
            <select
              value={filterBadge}
              onChange={(e) => setFilterBadge(e.target.value)}
              className="yearbook-input"
            >
              <option value="">All Badges</option>
              {badges.map((badge) => (
                <option key={badge.id} value={badge.name}>
                  {badge.icon} {badge.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterBadge) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterBadge('')
              }}
              className="yearbook-button-secondary px-4 py-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-red-700">{error}</span>
            <button
              onClick={fetchProfiles}
              className="ml-auto text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array.from({ length: PROFILES_PER_PAGE }).map((_, index) => (
            <LoadingCard key={index} />
          ))
        ) : filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No profiles found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterBadge
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a profile!'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalFilteredPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'yearbook-button-secondary hover:bg-gray-300'
            }`}
          >
            ← Previous
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: Math.min(totalFilteredPages, 5) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-pepe-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalFilteredPages}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === totalFilteredPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'yearbook-button-secondary hover:bg-gray-300'
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="text-center mt-8 text-sm text-gray-500">
        Showing {filteredProfiles.length} of {totalProfiles || displayProfiles.length} profiles
      </div>
    </div>
  )
}

export default YearbookPage