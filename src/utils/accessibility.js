// WCAG 2.1 Accessibility Utilities

// Focus management
export const createFocusTrap = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]
  
  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('escape'))
    }
  }
  
  element.addEventListener('keydown', handleTabKey)
  
  return {
    activate: () => {
      firstFocusable?.focus()
    },
    deactivate: () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }
}

// Announce to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Color contrast checker
export const checkColorContrast = (foreground, background) => {
  const getRGBValues = (color) => {
    const temp = document.createElement('div')
    temp.style.color = color
    document.body.appendChild(temp)
    
    const rgbColor = window.getComputedStyle(temp).color
    document.body.removeChild(temp)
    
    const match = rgbColor.match(/\d+/g)
    return match ? match.map(Number) : [0, 0, 0]
  }
  
  const getRelativeLuminance = ([r, g, b]) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const fgRGB = getRGBValues(foreground)
  const bgRGB = getRGBValues(background)
  
  const fgLuminance = getRelativeLuminance(fgRGB)
  const bgLuminance = getRelativeLuminance(bgRGB)
  
  const lightest = Math.max(fgLuminance, bgLuminance)
  const darkest = Math.min(fgLuminance, bgLuminance)
  
  const contrast = (lightest + 0.05) / (darkest + 0.05)
  
  return {
    ratio: contrast,
    AA: contrast >= 4.5,
    AAA: contrast >= 7,
    AALarge: contrast >= 3,
    AAALarge: contrast >= 4.5
  }
}

// Keyboard navigation helpers
export const createKeyboardNavigator = (items, options = {}) => {
  const {
    orientation = 'vertical', // 'vertical' | 'horizontal' | 'both'
    wrap = true,
    activateOnFocus = false
  } = options
  
  let currentIndex = 0
  
  const navigate = (direction) => {
    const totalItems = items.length
    if (totalItems === 0) return
    
    let nextIndex = currentIndex
    
    switch (direction) {
      case 'next':
        nextIndex = wrap ? (currentIndex + 1) % totalItems : Math.min(currentIndex + 1, totalItems - 1)
        break
      case 'previous':
        nextIndex = wrap ? (currentIndex - 1 + totalItems) % totalItems : Math.max(currentIndex - 1, 0)
        break
      case 'first':
        nextIndex = 0
        break
      case 'last':
        nextIndex = totalItems - 1
        break
    }
    
    if (nextIndex !== currentIndex) {
      currentIndex = nextIndex
      items[currentIndex].focus()
      
      if (activateOnFocus) {
        items[currentIndex].click()
      }
    }
  }
  
  const handleKeyDown = (e) => {
    const key = e.key
    let handled = false
    
    if (orientation === 'vertical' || orientation === 'both') {
      if (key === 'ArrowDown') {
        navigate('next')
        handled = true
      } else if (key === 'ArrowUp') {
        navigate('previous')
        handled = true
      }
    }
    
    if (orientation === 'horizontal' || orientation === 'both') {
      if (key === 'ArrowRight') {
        navigate('next')
        handled = true
      } else if (key === 'ArrowLeft') {
        navigate('previous')
        handled = true
      }
    }
    
    if (key === 'Home') {
      navigate('first')
      handled = true
    } else if (key === 'End') {
      navigate('last')
      handled = true
    }
    
    if (handled) {
      e.preventDefault()
    }
  }
  
  return {
    handleKeyDown,
    setCurrentIndex: (index) => {
      if (index >= 0 && index < items.length) {
        currentIndex = index
      }
    },
    getCurrentIndex: () => currentIndex
  }
}

// Reduced motion detection
export const preferesReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// High contrast detection
export const preferesHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Skip link functionality
export const createSkipLink = (targetId, text = 'Skip to main content') => {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = 'skip-link'
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 4px;
  `
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px'
  })
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px'
  })
  
  document.body.insertBefore(skipLink, document.body.firstChild)
  
  return skipLink
}

// ARIA live region manager
export class LiveRegionManager {
  constructor() {
    this.regions = new Map()
    this.createDefaultRegions()
  }
  
  createDefaultRegions() {
    this.createRegion('polite', 'polite')
    this.createRegion('assertive', 'assertive')
    this.createRegion('status', 'polite', 'status')
  }
  
  createRegion(id, priority = 'polite', role = null) {
    if (this.regions.has(id)) return this.regions.get(id)
    
    const region = document.createElement('div')
    region.id = `live-region-${id}`
    region.setAttribute('aria-live', priority)
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    
    if (role) {
      region.setAttribute('role', role)
    }
    
    document.body.appendChild(region)
    this.regions.set(id, region)
    
    return region
  }
  
  announce(message, regionId = 'polite') {
    const region = this.regions.get(regionId)
    if (region) {
      region.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = ''
      }, 1000)
    }
  }
  
  announceError(message) {
    this.announce(message, 'assertive')
  }
  
  announceStatus(message) {
    this.announce(message, 'status')
  }
  
  destroy() {
    this.regions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region)
      }
    })
    this.regions.clear()
  }
}

// Form accessibility helpers
export const enhanceFormAccessibility = (form) => {
  const inputs = form.querySelectorAll('input, select, textarea')
  const errors = []
  
  inputs.forEach(input => {
    // Ensure inputs have labels
    const hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    form.querySelector(`label[for="${input.id}"]`)
    
    if (!hasLabel && input.type !== 'hidden') {
      errors.push(`Input ${input.name || input.type} missing label`)
    }
    
    // Add required indicators
    if (input.required) {
      input.setAttribute('aria-required', 'true')
      
      // Add visual indicator if not present
      const label = form.querySelector(`label[for="${input.id}"]`)
      if (label && !label.textContent.includes('*')) {
        label.innerHTML += ' <span aria-hidden="true">*</span>'
      }
    }
    
    // Enhance error display
    input.addEventListener('invalid', (e) => {
      const errorId = `${input.id}-error`
      let errorElement = form.querySelector(`#${errorId}`)
      
      if (!errorElement) {
        errorElement = document.createElement('div')
        errorElement.id = errorId
        errorElement.className = 'error-message'
        errorElement.setAttribute('role', 'alert')
        input.parentNode.insertBefore(errorElement, input.nextSibling)
      }
      
      errorElement.textContent = input.validationMessage
      input.setAttribute('aria-describedby', errorId)
      input.setAttribute('aria-invalid', 'true')
    })
    
    input.addEventListener('input', () => {
      if (input.validity.valid) {
        input.removeAttribute('aria-invalid')
        const errorElement = form.querySelector(`#${input.id}-error`)
        if (errorElement) {
          errorElement.textContent = ''
        }
      }
    })
  })
  
  return errors
}

// Image accessibility
export const enhanceImageAccessibility = (container = document) => {
  const images = container.querySelectorAll('img')
  const issues = []
  
  images.forEach(img => {
    // Check for alt text
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push(`Image missing alt text: ${img.src}`)
      
      // Add empty alt for decorative images
      if (img.classList.contains('decorative')) {
        img.alt = ''
      }
    }
    
    // Add loading states for accessibility
    if (!img.complete) {
      img.setAttribute('aria-busy', 'true')
      img.addEventListener('load', () => {
        img.removeAttribute('aria-busy')
      })
      
      img.addEventListener('error', () => {
        img.removeAttribute('aria-busy')
        img.setAttribute('aria-label', 'Image failed to load')
      })
    }
  })
  
  return issues
}

// Create global live region manager
export const liveRegionManager = new LiveRegionManager()

// Accessibility testing utility
export const runAccessibilityCheck = (element = document.body) => {
  const issues = []
  
  // Check color contrast (simplified)
  const elements = element.querySelectorAll('*')
  elements.forEach(el => {
    const styles = window.getComputedStyle(el)
    const textColor = styles.color
    const bgColor = styles.backgroundColor
    
    if (textColor && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      const contrast = checkColorContrast(textColor, bgColor)
      if (!contrast.AA) {
        issues.push(`Low contrast detected: ${contrast.ratio.toFixed(2)}:1`)
      }
    }
  })
  
  // Check form accessibility
  const forms = element.querySelectorAll('form')
  forms.forEach(form => {
    const formIssues = enhanceFormAccessibility(form)
    issues.push(...formIssues)
  })
  
  // Check image accessibility
  const imageIssues = enhanceImageAccessibility(element)
  issues.push(...imageIssues)
  
  // Check heading structure
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let currentLevel = 0
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1))
    if (level > currentLevel + 1) {
      issues.push(`Heading level skipped: ${heading.tagName} after h${currentLevel}`)
    }
    currentLevel = level
  })
  
  return issues
}

// Export React hooks for accessibility
export const useAccessibility = () => {
  return {
    announceToScreenReader,
    liveRegionManager,
    preferesReducedMotion: preferesReducedMotion(),
    preferesHighContrast: preferesHighContrast(),
    runAccessibilityCheck
  }
}