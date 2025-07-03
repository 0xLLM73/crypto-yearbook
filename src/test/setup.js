import { expect, afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    DEV: true,
    VITE_SUPABASE_URL: 'https://test-project.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    VITE_APP_NAME: 'Crypto Yearbook Test',
    VITE_ENABLE_TEST_MODE: 'true'
  }
}))

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }))
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    range: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis()
  }))
}

// Mock @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}))

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((input) => input)
  }
}))

// Mock React Router
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/' })),
    Navigate: vi.fn(({ to }) => `Navigate to ${to}`)
  }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock scrollTo
window.scrollTo = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// Mock URL constructor
global.URL = class URL {
  constructor(url) {
    this.href = url
    this.protocol = 'https:'
    this.host = 'example.com'
    this.pathname = '/'
  }
}

// Mock fetch
global.fetch = vi.fn()

// Setup mock responses
beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks()
  
  // Setup default Supabase responses
  mockSupabaseClient.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null
  })
  
  mockSupabaseClient.from().select().mockResolvedValue({
    data: [],
    error: null,
    count: 0
  })
  
  // Setup default fetch response
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  })
})

// Custom matchers
expect.extend({
  toBeAccessible(received) {
    // Simple accessibility check
    const hasAriaLabel = received.getAttribute('aria-label') || 
                        received.getAttribute('aria-labelledby') ||
                        received.tagName === 'LABEL'
    
    const isInteractive = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(received.tagName)
    
    if (isInteractive && !hasAriaLabel) {
      return {
        message: () => `Expected interactive element to have aria-label or be a label`,
        pass: false
      }
    }
    
    return {
      message: () => `Element is accessible`,
      pass: true
    }
  },

  toHaveValidFormStructure(received) {
    const inputs = received.querySelectorAll('input, select, textarea')
    const labels = received.querySelectorAll('label')
    
    for (const input of inputs) {
      const hasLabel = input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby') ||
                      labels.some(label => 
                        label.getAttribute('for') === input.id ||
                        label.contains(input)
                      )
      
      if (!hasLabel) {
        return {
          message: () => `Form input without proper label found`,
          pass: false
        }
      }
    }
    
    return {
      message: () => `Form has valid structure`,
      pass: true
    }
  }
})

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: '2025-01-01T00:00:00Z',
  ...overrides
})

export const createMockProfile = (overrides = {}) => ({
  id: 'test-profile-id',
  user_id: 'test-user-id',
  username: 'testuser',
  display_name: 'Test User',
  bio: 'Test bio',
  avatar_url: null,
  favorite_crypto: 'Bitcoin',
  crypto_quote: 'HODL to the moon!',
  is_verified: false,
  created_at: '2025-01-01T00:00:00Z',
  ...overrides
})

export const mockAuthContextValue = (overrides = {}) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn(),
  fetchUserProfile: vi.fn(),
  hasCompletedProfile: vi.fn(() => false),
  clearError: vi.fn(),
  supabase: mockSupabaseClient,
  ...overrides
})

// Accessibility testing utilities
export const axeMatchers = {
  async toPassAxeTests(received) {
    // Simple accessibility validation
    const violations = []
    
    // Check for missing alt text on images
    const images = received.querySelectorAll('img')
    images.forEach(img => {
      if (!img.alt) {
        violations.push('Image missing alt text')
      }
    })
    
    // Check for missing form labels
    const inputs = received.querySelectorAll('input:not([type="hidden"])')
    inputs.forEach(input => {
      const hasLabel = input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby') ||
                      received.querySelector(`label[for="${input.id}"]`)
      
      if (!hasLabel) {
        violations.push('Input missing label')
      }
    })
    
    return {
      pass: violations.length === 0,
      message: () => violations.length > 0 
        ? `Accessibility violations found: ${violations.join(', ')}`
        : 'No accessibility violations found'
    }
  }
}

expect.extend(axeMatchers)

// Console error/warning suppression for expected test behavior
const originalError = console.error
const originalWarn = console.warn

beforeEach(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
       args[0].includes('Warning: componentWillReceiveProps'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('deprecated')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterEach(() => {
  console.error = originalError
  console.warn = originalWarn
})