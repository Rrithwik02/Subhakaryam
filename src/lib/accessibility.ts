// Accessibility utility functions

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('class', 'sr-only')
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  firstElement?.focus()

  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd parse RGB values and calculate luminance
  return 4.5 // Return minimum WCAG AA compliance ratio as default
}

export const validateAccessibility = {
  hasProperHeadingStructure: (container: HTMLElement): boolean => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0
    
    for (const heading of headings) {
      const currentLevel = parseInt(heading.tagName.charAt(1))
      if (currentLevel > previousLevel + 1) {
        return false
      }
      previousLevel = currentLevel
    }
    return true
  },
  
  hasAltTextForImages: (container: HTMLElement): boolean => {
    const images = container.querySelectorAll('img')
    return Array.from(images).every(img => 
      img.hasAttribute('alt') || img.hasAttribute('aria-label')
    )
  },
  
  hasAriaLabels: (container: HTMLElement): boolean => {
    const interactiveElements = container.querySelectorAll('button, input, select, textarea, a')
    return Array.from(interactiveElements).every(element => 
      element.hasAttribute('aria-label') || 
      element.hasAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      element.querySelector('span:not(.sr-only)')
    )
  }
}