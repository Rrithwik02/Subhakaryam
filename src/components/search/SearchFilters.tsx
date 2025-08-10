
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X, RotateCcw } from "lucide-react";
import { serviceCategories } from "@/data/services";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const cities = [
  { id: "vizag", name: "Visakhapatnam" },
  { id: "vijayawada", name: "Vijayawada" },
  { id: "hyderabad", name: "Hyderabad" },
];

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  city: string;
  setCity: (city: string) => void;
  serviceType: string;
  setServiceType: (type: string) => void;
  sortBy: "rating_desc" | "newest";
  setSortBy: (sort: "rating_desc" | "newest") => void;
  resultCount?: number;
}

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  city,
  setCity,
  serviceType,
  setServiceType,
  sortBy,
  setSortBy,
  resultCount = 0,
}: SearchFiltersProps) => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sync filters with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (city && city !== 'all') params.set('city', city);
    if (serviceType && serviceType !== 'all') params.set('service', serviceType);
    if (sortBy !== 'rating_desc') params.set('sort', sortBy);
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, city, serviceType, sortBy, setSearchParams]);

  const hasActiveFilters = searchTerm || (city && city !== 'all') || (serviceType && serviceType !== 'all') || sortBy !== 'rating_desc';
  
  const clearAllFilters = () => {
    setSearchTerm('');
    setCity('all');
    setServiceType('all');
    setSortBy('rating_desc');
  };
  
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl",
      isMobile ? "p-4" : "p-6"
    )}>
      {/* Header with result count and clear filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Search Filters</h2>
          {resultCount > 0 && (
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {resultCount} results
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors"
            aria-label="Clear all filters"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className={cn(
        "gap-4",
        isMobile ? "space-y-4" : "flex flex-col md:flex-row"
      )}>
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search service providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20",
                isMobile && "h-12 text-base"
              )}
              aria-label="Search service providers"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className={isMobile ? "w-full" : "md:w-64"}>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className={cn(
              "transition-all duration-200 hover:bg-muted/50",
              isMobile ? "h-12" : ""
            )}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={isMobile ? "w-full" : "md:w-64"}>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className={cn(
              "transition-all duration-200 hover:bg-muted/50",
              isMobile ? "h-12" : ""
            )}>
              <SelectValue placeholder="Select service type" />
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
        <div className={isMobile ? "w-full" : "md:w-64"}>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className={cn(
              "transition-all duration-200 hover:bg-muted/50",
              isMobile ? "h-12" : ""
            )}>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
