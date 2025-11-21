// Utility functions for 404 page search functionality

export interface SearchablePage {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  category: 'service' | 'page' | 'profile' | 'auth' | 'info';
}

// Define all searchable pages in the application
export const SEARCHABLE_PAGES: SearchablePage[] = [
  // Services
  { path: '/services', title: 'All Services', description: 'Browse all available services', keywords: ['service', 'browse', 'all'], category: 'service' },
  { path: '/services/photography', title: 'Photography Services', description: 'Professional photography for your events', keywords: ['photo', 'camera', 'pictures', 'photography'], category: 'service' },
  { path: '/services/catering', title: 'Catering Services', description: 'Delicious catering for all occasions', keywords: ['food', 'catering', 'menu', 'cuisine'], category: 'service' },
  { path: '/services/decoration', title: 'Decoration Services', description: 'Beautiful decoration for events', keywords: ['decor', 'decoration', 'design', 'flowers'], category: 'service' },
  { path: '/services/mehendi', title: 'Mehendi Artists', description: 'Traditional mehendi art services', keywords: ['mehendi', 'henna', 'art', 'bridal'], category: 'service' },
  { path: '/services/music', title: 'Music Services', description: 'Live music and DJs for events', keywords: ['music', 'dj', 'band', 'entertainment'], category: 'service' },
  { path: '/services/pooja', title: 'Pooja Services', description: 'Traditional pooja and ceremony services', keywords: ['pooja', 'puja', 'priest', 'ceremony', 'ritual'], category: 'service' },
  { path: '/services/function-hall', title: 'Function Halls', description: 'Venues for your special events', keywords: ['venue', 'hall', 'function', 'space', 'location'], category: 'service' },
  { path: '/services/bundles', title: 'Service Bundles', description: 'Complete service packages', keywords: ['bundle', 'package', 'combo', 'complete'], category: 'service' },
  
  // Pages
  { path: '/', title: 'Home', description: 'Welcome to Subhakary', keywords: ['home', 'main', 'index'], category: 'page' },
  { path: '/search', title: 'Search', description: 'Search for services and providers', keywords: ['search', 'find', 'look'], category: 'page' },
  { path: '/about', title: 'About Us', description: 'Learn more about Subhakary', keywords: ['about', 'company', 'information'], category: 'info' },
  { path: '/contact', title: 'Contact Us', description: 'Get in touch with us', keywords: ['contact', 'support', 'help', 'email'], category: 'info' },
  { path: '/track-booking', title: 'Track Booking', description: 'Track your booking status', keywords: ['track', 'booking', 'status', 'order'], category: 'page' },
  
  // Profile & Auth
  { path: '/profile', title: 'My Profile', description: 'Manage your profile and bookings', keywords: ['profile', 'account', 'my', 'user'], category: 'profile' },
  { path: '/login', title: 'Login', description: 'Sign in to your account', keywords: ['login', 'signin', 'sign', 'auth'], category: 'auth' },
  { path: '/register', title: 'Register', description: 'Create a new account', keywords: ['register', 'signup', 'sign', 'create'], category: 'auth' },
  
  // Blog
  { path: '/blog', title: 'Blog', description: 'Read our latest articles', keywords: ['blog', 'articles', 'read', 'posts'], category: 'info' },
  
  // Policies
  { path: '/privacy-policy', title: 'Privacy Policy', description: 'Our privacy policy', keywords: ['privacy', 'policy', 'terms', 'legal'], category: 'info' },
  { path: '/terms-conditions', title: 'Terms & Conditions', description: 'Terms and conditions', keywords: ['terms', 'conditions', 'legal'], category: 'info' },
];

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const len1 = s1.length;
  const len2 = s2.length;
  
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : 1 - matrix[len1][len2] / maxLen;
};

/**
 * Search pages by query string
 */
export const searchPages = (query: string): SearchablePage[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  const results = SEARCHABLE_PAGES.map(page => {
    let score = 0;
    
    // Check title match
    if (page.title.toLowerCase().includes(searchTerm)) {
      score += 10;
    }
    
    // Check path match
    if (page.path.toLowerCase().includes(searchTerm)) {
      score += 8;
    }
    
    // Check keywords match
    for (const keyword of page.keywords) {
      if (keyword.toLowerCase().includes(searchTerm)) {
        score += 5;
      }
    }
    
    // Check description match
    if (page.description.toLowerCase().includes(searchTerm)) {
      score += 3;
    }
    
    // Calculate similarity scores
    const titleSimilarity = calculateSimilarity(searchTerm, page.title);
    score += titleSimilarity * 7;
    
    return { page, score };
  })
  .filter(result => result.score > 2)
  .sort((a, b) => b.score - a.score)
  .slice(0, 8)
  .map(result => result.page);
  
  return results;
};

/**
 * Get suggested pages based on requested path
 */
export const getSuggestedPages = (requestedPath: string): SearchablePage[] => {
  const cleanPath = requestedPath.toLowerCase().replace(/^\//, '');
  
  if (!cleanPath) return getPopularPages();
  
  const suggestions = SEARCHABLE_PAGES.map(page => {
    const pagePath = page.path.toLowerCase().replace(/^\//, '');
    const similarity = calculateSimilarity(cleanPath, pagePath);
    return { page, similarity };
  })
  .filter(result => result.similarity > 0.3)
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, 6)
  .map(result => result.page);
  
  return suggestions.length > 0 ? suggestions : getPopularPages();
};

/**
 * Get popular pages (most commonly accessed)
 */
export const getPopularPages = (): SearchablePage[] => {
  return [
    SEARCHABLE_PAGES.find(p => p.path === '/')!,
    SEARCHABLE_PAGES.find(p => p.path === '/services')!,
    SEARCHABLE_PAGES.find(p => p.path === '/search')!,
    SEARCHABLE_PAGES.find(p => p.path === '/about')!,
    SEARCHABLE_PAGES.find(p => p.path === '/contact')!,
    SEARCHABLE_PAGES.find(p => p.path === '/profile')!,
  ].filter(Boolean);
};

/**
 * Save search to localStorage
 */
export const saveSearch = (query: string) => {
  try {
    const searches = getRecentSearches();
    const updated = [query, ...searches.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save search:', error);
  }
};

/**
 * Get recent searches from localStorage
 */
export const getRecentSearches = (): string[] => {
  try {
    const searches = localStorage.getItem('recent_searches');
    return searches ? JSON.parse(searches) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Get category icon name
 */
export const getCategoryIcon = (category: SearchablePage['category']): string => {
  const icons = {
    service: 'Briefcase',
    page: 'FileText',
    profile: 'User',
    auth: 'Lock',
    info: 'Info',
  };
  return icons[category] || 'FileText';
};
