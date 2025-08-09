
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { serviceCategories } from "@/data/services";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
}: SearchFiltersProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "bg-background rounded-lg shadow-md mb-8",
      isMobile ? "p-4" : "p-6"
    )}>
      <div className={cn(
        "gap-4",
        isMobile ? "space-y-4" : "flex flex-col md:flex-row"
      )}>
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search service providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn("pl-10", isMobile && "h-12 text-base")}
            />
          </div>
        </div>
        <div className={isMobile ? "w-full" : "md:w-64"}>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className={isMobile ? "h-12" : ""}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={isMobile ? "w-full" : "md:w-64"}>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className={isMobile ? "h-12" : ""}>
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
          <Select value={sortBy} onValueChange={(value: "rating_desc" | "newest") => setSortBy(value)}>
            <SelectTrigger className={isMobile ? "h-12" : ""}>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className={isMobile ? "w-full mt-4" : "md:w-auto md:mt-0"}>
        <Button
          variant="outline"
          className={isMobile ? "w-full h-12" : ""}
          onClick={() => {
            setSearchTerm("");
            setCity("all");
            setServiceType("all");
            setSortBy("rating_desc");
          }}
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
