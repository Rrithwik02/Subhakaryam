import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { searchPages, saveSearch, getRecentSearches, SearchablePage } from '@/utils/searchUtils';

interface NotFoundSearchProps {
  onClose?: () => void;
}

export const NotFoundSearch: React.FC<NotFoundSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchablePage[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchPages(query);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleNavigate = (path: string, searchQuery?: string) => {
    if (searchQuery) {
      saveSearch(searchQuery);
    }
    navigate(path);
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleNavigate(results[selectedIndex].path, query);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose?.();
        break;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for pages, services, or features..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-4 h-14 text-lg"
          autoFocus
        />
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-4 bg-card border rounded-lg shadow-lg overflow-hidden">
          {results.map((page, index) => (
            <button
              key={page.path}
              onClick={() => handleNavigate(page.path, query)}
              className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 ${
                index === selectedIndex ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">{page.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {page.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{page.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{page.path}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-4 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Recent searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSearch(search)}
                className="text-sm"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {query && results.length === 0 && (
        <div className="mt-4 text-center py-8 text-muted-foreground">
          <p>No results found for "{query}"</p>
          <p className="text-sm mt-2">Try a different search term or browse our popular pages</p>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-muted rounded">↑↓</kbd> Navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> Select
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> Close
        </span>
      </div>
    </div>
  );
};
