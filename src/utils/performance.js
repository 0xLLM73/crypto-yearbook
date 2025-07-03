import { memo, useMemo, useCallback, lazy } from 'react'

// React component lazy loading
export const createLazyComponent = (componentImporter) => {
  return lazy(() => componentImporter())
}

// Memoization utilities
export const createMemoizedComponent = (Component, propsAreEqual) => {
  return memo(Component, propsAreEqual)
}

export const useMemoizedValue = (factory, deps) => {
  return useMemo(factory, deps)
}

export const useMemoizedCallback = (callback, deps) => {
  return useCallback(callback, deps)
}

// Image optimization utilities
export const optimizeImageLoading = () => {
  // Intersection Observer for lazy loading images
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.src
        
        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      }
    })
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  })

  return observer
}

// Bundle size optimization - dynamic imports
export const loadComponentDynamically = async (componentPath) => {
  try {
    const module = await import(componentPath)
    return module.default || module
  } catch (error) {
    console.error(`Failed to load component from ${componentPath}:`, error)
    throw error
  }
}

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = []
  }

  // Measure component render time
  measureRender(componentName, callback) {
    const startTime = performance.now()
    const result = callback()
    const endTime = performance.now()
    
    this.recordMetric(`render_${componentName}`, endTime - startTime)
    return result
  }

  // Measure async operations
  async measureAsync(operationName, asyncCallback) {
    const startTime = performance.now()
    try {
      const result = await asyncCallback()
      const endTime = performance.now()
      this.recordMetric(`async_${operationName}`, endTime - startTime)
      return result
    } catch (error) {
      const endTime = performance.now()
      this.recordMetric(`async_${operationName}_error`, endTime - startTime)
      throw error
    }
  }

  // Record custom metrics
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const metrics = this.metrics.get(name)
    metrics.push({
      value,
      timestamp: Date.now()
    })

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift()
    }
  }

  // Get performance statistics
  getStats(metricName) {
    const metrics = this.metrics.get(metricName)
    if (!metrics || metrics.length === 0) {
      return null
    }

    const values = metrics.map(m => m.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)
    const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)]

    return { avg, min, max, median, count: values.length }
  }

  // Monitor Core Web Vitals
  monitorWebVitals() {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.recordMetric('lcp', entry.startTime)
    })

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry) => {
      this.recordMetric('fid', entry.processingStart - entry.startTime)
    })

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('cls', entry.value)
      }
    })
  }

  observeMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback)
      })
      
      observer.observe({ type, buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error)
    }
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Memory management utilities
export const createMemoryOptimizer = () => {
  const cache = new Map()
  const maxSize = 100

  return {
    set(key, value) {
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      cache.set(key, value)
    },

    get(key) {
      return cache.get(key)
    },

    has(key) {
      return cache.has(key)
    },

    delete(key) {
      return cache.delete(key)
    },

    clear() {
      cache.clear()
    },

    size() {
      return cache.size
    }
  }
}

// Throttle and debounce utilities
export const throttle = (func, delay) => {
  let timeoutId
  let lastExecTime = 0
  
  return function (...args) {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

export const debounce = (func, delay) => {
  let timeoutId
  
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

// Network optimization
export const createNetworkOptimizer = () => {
  const requestCache = new Map()
  
  return {
    // Cache GET requests
    async cachedFetch(url, options = {}) {
      const cacheKey = `${url}_${JSON.stringify(options)}`
      
      if (requestCache.has(cacheKey)) {
        return requestCache.get(cacheKey)
      }
      
      try {
        const response = await fetch(url, options)
        const result = await response.json()
        
        // Cache successful responses for 5 minutes
        setTimeout(() => requestCache.delete(cacheKey), 5 * 60 * 1000)
        requestCache.set(cacheKey, result)
        
        return result
      } catch (error) {
        requestCache.delete(cacheKey)
        throw error
      }
    },

    // Preload critical resources
    preloadResource(href, as = 'fetch') {
      if (typeof document === 'undefined') return

      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      document.head.appendChild(link)
    },

    // Prefetch next page resources
    prefetchResource(href) {
      if (typeof document === 'undefined') return

      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    }
  }
}

// Bundle analysis utilities
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return null

  const scripts = Array.from(document.scripts)
  let totalSize = 0

  scripts.forEach(script => {
    if (script.src) {
      // Estimate size based on script length (rough approximation)
      totalSize += script.innerHTML.length
    }
  })

  return {
    estimatedSize: totalSize,
    scriptCount: scripts.length,
    timestamp: Date.now()
  }
}

// React performance hooks
export const usePerformanceMonitor = (componentName) => {
  const monitor = useMemo(() => new PerformanceMonitor(), [])

  const measureRender = useCallback((callback) => {
    return monitor.measureRender(componentName, callback)
  }, [monitor, componentName])

  const measureAsync = useCallback((operationName, asyncCallback) => {
    return monitor.measureAsync(operationName, asyncCallback)
  }, [monitor])

  return { measureRender, measureAsync, monitor }
}

// Virtual scrolling utility for large lists
export class VirtualScroller {
  constructor(containerHeight, itemHeight, items) {
    this.containerHeight = containerHeight
    this.itemHeight = itemHeight
    this.items = items
    this.scrollTop = 0
  }

  getVisibleRange() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight) + 1,
      this.items.length - 1
    )

    return { startIndex, endIndex }
  }

  getVisibleItems() {
    const { startIndex, endIndex } = this.getVisibleRange()
    return this.items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index
    }))
  }

  updateScrollTop(scrollTop) {
    this.scrollTop = scrollTop
  }

  getTotalHeight() {
    return this.items.length * this.itemHeight
  }
}

// Create global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor()

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  globalPerformanceMonitor.monitorWebVitals()
}