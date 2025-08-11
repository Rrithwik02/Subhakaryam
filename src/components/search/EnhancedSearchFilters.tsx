import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, X, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface EnhancedSearchFiltersProps {
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

export const EnhancedSearchFilters = ({
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
}: EnhancedSearchFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounce search term to improve performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (city) params.set('city', city);
    if (serviceType) params.set('service', serviceType);
    if (sortBy) params.set('sort', sortBy);
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
    const urlCity = searchParams.get('city') || '';
    const urlService = searchParams.get('service') || '';
    const urlSort = searchParams.get('sort') || 'rating';
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
    setSearchTerm('');
    setCity('');
    setServiceType('');
    setSortBy('rating');
    setPriceRange([0, 100000]);
    setRating(0);
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (city) count++;
    if (serviceType) count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    if (rating > 0) count++;
    return count;
  }, [searchTerm, city, serviceType, priceRange, rating]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search services, providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
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

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            <SelectItem value="Mumbai">Mumbai</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Kolkata">Kolkata</SelectItem>
            <SelectItem value="Pune">Pune</SelectItem>
            <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Service Type Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Service Type</label>
        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger>
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Services</SelectItem>
            <SelectItem value="wedding_photography">Wedding Photography</SelectItem>
            <SelectItem value="mehendi_artist">Mehendi Artist</SelectItem>
            <SelectItem value="pooja_services">Pooja Services</SelectItem>
            <SelectItem value="catering">Catering</SelectItem>
            <SelectItem value="decoration">Decoration</SelectItem>
            <SelectItem value="music_dj">Music & DJ</SelectItem>
            <SelectItem value="function_hall">Function Hall</SelectItem>
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
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((ratingValue) => (
            <Button
              key={ratingValue}
              variant={rating === ratingValue ? "default" : "outline"}
              size="sm"
              onClick={() => setRating(ratingValue)}
              className="flex items-center gap-1"
            >
              {ratingValue === 0 ? (
                "Any"
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

      {/* Sort Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Sort By</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
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

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Button & Results */}
        <div className="flex items-center justify-between">
          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
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

          <span className="text-sm text-gray-600">
            {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchTerm}"
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSearchTerm('')} 
                />
              </Badge>
            )}
            {city && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {city}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setCity('')} 
                />
              </Badge>
            )}
            {serviceType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {serviceType.replace('_', ' ')}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setServiceType('')} 
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Search & Filters</h3>
        <span className="text-sm text-gray-600">
          {resultsCount} result{resultsCount !== 1 ? 's' : ''}
        </span>
      </div>
      <FilterContent />
    </Card>
  );
};