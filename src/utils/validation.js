import DOMPurify from 'dompurify'

// Email validation with comprehensive regex
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { isValid: true, error: null }
}

// Password validation with security requirements
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long (max 128 characters)' }
  }
  
  // Check for at least one uppercase, one lowercase, one digit
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  
  if (!hasUppercase || !hasLowercase || !hasDigit) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty123', 'admin123', 'Password1']
  if (weakPasswords.includes(password)) {
    return { isValid: false, error: 'This password is too common. Please choose a stronger password.' }
  }
  
  return { isValid: true, error: null }
}

// Username validation
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username is required' }
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' }
  }
  
  if (username.length > 30) {
    return { isValid: false, error: 'Username must be less than 30 characters' }
  }
  
  // Only allow alphanumeric characters and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' }
  }
  
  // Cannot start with underscore or number
  if (/^[_0-9]/.test(username)) {
    return { isValid: false, error: 'Username must start with a letter' }
  }
  
  // Reserved usernames
  const reserved = ['admin', 'root', 'api', 'www', 'mail', 'support', 'help', 'test', 'user', 'null', 'undefined']
  if (reserved.includes(username.toLowerCase())) {
    return { isValid: false, error: 'This username is reserved. Please choose another.' }
  }
  
  return { isValid: true, error: null }
}

// Display name validation
export const validateDisplayName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Display name is required' }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Display name must be at least 2 characters long' }
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Display name must be less than 50 characters' }
  }
  
  // Allow letters, numbers, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z0-9\s\-']+$/.test(trimmedName)) {
    return { isValid: false, error: 'Display name can only contain letters, numbers, spaces, hyphens, and apostrophes' }
  }
  
  return { isValid: true, error: null }
}

// Bio validation
export const validateBio = (bio) => {
  if (!bio) {
    return { isValid: true, error: null } // Bio is optional
  }
  
  if (typeof bio !== 'string') {
    return { isValid: false, error: 'Bio must be text' }
  }
  
  if (bio.length > 500) {
    return { isValid: false, error: 'Bio must be less than 500 characters' }
  }
  
  // Check for excessive line breaks
  const lineBreaks = bio.split('\n').length - 1
  if (lineBreaks > 5) {
    return { isValid: false, error: 'Bio can contain at most 5 line breaks' }
  }
  
  return { isValid: true, error: null }
}

// URL validation for profile links
export const validateUrl = (url) => {
  if (!url) {
    return { isValid: true, error: null } // URLs are optional
  }
  
  if (typeof url !== 'string') {
    return { isValid: false, error: 'URL must be text' }
  }
  
  try {
    const urlObj = new URL(url)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use http or https protocol' }
    }
    
    // Check for reasonable length
    if (url.length > 2048) {
      return { isValid: false, error: 'URL is too long' }
    }
    
    return { isValid: true, error: null }
  } catch (e) {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
}

// XSS Protection - Sanitize HTML content
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return ''
  
  // Configure DOMPurify to be very strict
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    SANITIZE_DOM: true
  })
  
  return cleanHtml
}

// SQL Injection Protection - Escape special characters
export const escapeSqlString = (str) => {
  if (!str || typeof str !== 'string') return ''
  
  return str.replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z')
}

// File upload validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options
  
  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }
  
  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` }
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed. Please use JPG, PNG, GIF, or WebP.' }
  }
  
  // Check file extension
  const fileName = file.name.toLowerCase()
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
  
  if (!hasValidExtension) {
    return { isValid: false, error: 'Invalid file extension' }
  }
  
  return { isValid: true, error: null }
}

// Rate limiting helper
export const createRateLimiter = (maxRequests = 5, timeWindowMs = 60000) => {
  const requests = new Map()
  
  return (identifier) => {
    const now = Date.now()
    const userRequests = requests.get(identifier) || []
    
    // Remove old requests outside the time window
    const validRequests = userRequests.filter(time => now - time < timeWindowMs)
    
    if (validRequests.length >= maxRequests) {
      const oldestRequest = Math.min(...validRequests)
      const resetTime = Math.ceil((oldestRequest + timeWindowMs - now) / 1000)
      
      return {
        allowed: false,
        error: `Rate limit exceeded. Try again in ${resetTime} seconds.`,
        resetTime
      }
    }
    
    // Add current request
    validRequests.push(now)
    requests.set(identifier, validRequests)
    
    return { allowed: true, error: null }
  }
}

// Comprehensive form validation
export const validateForm = (data, rules) => {
  const errors = {}
  let isValid = true
  
  for (const [field, value] of Object.entries(data)) {
    const fieldRules = rules[field] || []
    
    for (const rule of fieldRules) {
      const result = rule(value)
      
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
        break // Stop at first error for this field
      }
    }
  }
  
  return { isValid, errors }
}

// Common validation rule builders
export const required = (message = 'This field is required') => (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: message }
  }
  return { isValid: true, error: null }
}

export const minLength = (min, message) => (value) => {
  if (value && value.length < min) {
    return { isValid: false, error: message || `Must be at least ${min} characters` }
  }
  return { isValid: true, error: null }
}

export const maxLength = (max, message) => (value) => {
  if (value && value.length > max) {
    return { isValid: false, error: message || `Must be less than ${max} characters` }
  }
  return { isValid: true, error: null }
}

export const matches = (regex, message) => (value) => {
  if (value && !regex.test(value)) {
    return { isValid: false, error: message }
  }
  return { isValid: true, error: null }
}