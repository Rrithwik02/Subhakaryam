import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, X, Star, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { serviceCategories } from "@/data/services";

interface ModernSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  city: string;
  setCity: (city: string) => void;
  serviceType: string;
  setServiceType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  rating: number;
  setRating: (rating: number) => void;
  resultsCount?: number;
}

const cities = [
  { id: "all", name: "All Cities" },
  { id: "vizag", name: "Visakhapatnam" },
  { id: "vijayawada", name: "Vijayawada" },
  { id: "hyderabad", name: "Hyderabad" }
];

export const ModernSearchFilters = ({
  searchTerm,
  setSearchTerm,
  city,
  setCity,
  serviceType,
  setServiceType,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  rating,
  setRating,
  resultsCount = 0
}: ModernSearchFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounce search term to improve performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (city && city !== 'all') params.set('city', city);
    if (serviceType && serviceType !== 'all') params.set('service', serviceType);
    if (sortBy && sortBy !== 'rating_desc') params.set('sort', sortBy);
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    }
    if (rating > 0) params.set('rating', rating.toString());
    
    setSearchParams(params);
  }, [debouncedSearchTerm, city, serviceType, sortBy, priceRange, rating, setSearchParams]);

  // Read from URL params on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCity = searchParams.get('city') || 'all';
    const urlService = searchParams.get('service') || 'all';
    const urlSort = searchParams.get('sort') || 'rating_desc';
    const urlMinPrice = parseInt(searchParams.get('minPrice') || '0');
    const urlMaxPrice = parseInt(searchParams.get('maxPrice') || '100000');
    const urlRating = parseFloat(searchParams.get('rating') || '0');

    if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
    if (urlCity !== city) setCity(urlCity);
    if (urlService !== serviceType) setServiceType(urlService);
    if (urlSort !== sortBy) setSortBy(urlSort);
    if (urlMinPrice !== priceRange[0] || urlMaxPrice !== priceRange[1]) {
      setPriceRange([urlMinPrice, urlMaxPrice]);
    }
    if (urlRating !== rating) setRating(urlRating);
  }, []);

  const clearAllFilters = () => {
    // Clear all filter states
    setSearchTerm('');
    setCity('all');
    setServiceType('all');
    setSortBy('rating_desc');
    setPriceRange([0, 100000]);
    setRating(0);
    
    // Clear URL search parameters completely
    const newParams = new URLSearchParams();
    setSearchParams(newParams, { replace: true });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (city && city !== 'all') count++;
    if (serviceType && serviceType !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    if (rating > 0) count++;
    return count;
  }, [searchTerm, city, serviceType, priceRange, rating]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Location Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {cities.map((cityOption) => (
              <SelectItem key={cityOption.id} value={cityOption.id}>
                {cityOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Service Type Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Service Type</label>
        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="all">All Services</SelectItem>
            {serviceCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
        </label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={100000}
          min={0}
          step={1000}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹0</span>
          <span>₹1,00,000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Minimum Rating
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[0, 3, 4, 4.5].map((ratingValue) => (
            <Button
              key={ratingValue}
              variant={rating === ratingValue ? "default" : "outline"}
              size="sm"
              onClick={() => setRating(ratingValue)}
              className="flex items-center justify-center gap-1"
            >
              {ratingValue === 0 ? (
                "Any Rating"
              ) : (
                <>
                  {ratingValue}
                  <Star className="w-3 h-3 fill-current" />
                </>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
        >
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  const SortSelect = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[140px]">
          <SlidersHorizontal className="w-4 h-4" />
          Sort
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {/* Compact Search Bar */}
        <div className={cn(
          "relative transition-all duration-300",
          isSearchFocused ? "transform scale-105" : ""
        )}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={isSearchFocused ? "Search services, providers..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              "pl-10 pr-4 transition-all duration-300",
              isSearchFocused ? "h-12 text-base" : "h-10"
            )}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchTerm('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filter Button & Results */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter Results</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  <FilterContent />
                </div>
              </DrawerContent>
            </Drawer>
            
            <SortSelect />
          </div>

          <span className="text-sm text-gray-600 font-medium">
            {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1 pr-1">
                "{searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {city && city !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1 pr-1">
                {cities.find(c => c.id === city)?.name || city}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setCity('all')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {serviceType && serviceType !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1 pr-1">
                {serviceCategories.find(s => s.id === serviceType)?.name || serviceType}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setServiceType('all')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {rating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 pr-1">
                {rating}+ ⭐
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setRating(0)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop Version with Amazon/Flipkart style
  return (
    <div className="border-b bg-white sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto max-w-7xl p-4">
        {/* Main Search Row */}
        <div className="flex items-center gap-4 mb-4">
          {/* Expandable Search */}
          <div className={cn(
            "relative flex-1 transition-all duration-300",
            isSearchFocused ? "max-w-2xl" : "max-w-xl"
          )}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={isSearchFocused ? "Search for service providers, services, locations..." : "Search services..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "pl-12 pr-12 transition-all duration-300 border-2",
                isSearchFocused 
                  ? "h-12 text-base border-primary focus:ring-2 focus:ring-primary/20" 
                  : "h-10 border-gray-200"
              )}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-48">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {cities.map((cityOption) => (
                  <SelectItem key={cityOption.id} value={cityOption.id}>
                    {cityOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">All Services</SelectItem>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <SortSelect />

            {/* Advanced Filters */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                  {activeFilterCount > 2 && (
                    <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {activeFilterCount - 2}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <FilterContent />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Results count and active filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">
              {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
            </span>
            
            {/* Active Filters Row */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Applied filters:</span>
                <div className="flex flex-wrap gap-1">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1 pr-1 text-xs">
                      "{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}"
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  )}
                  {city && city !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1 pr-1 text-xs">
                      {cities.find(c => c.id === city)?.name || city}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setCity('all')}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  )}
                  {serviceType && serviceType !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1 pr-1 text-xs">
                      {serviceCategories.find(s => s.id === serviceType)?.name || serviceType}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setServiceType('all')}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-destructive hover:text-destructive-foreground"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};