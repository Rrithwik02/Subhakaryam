import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

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
  sortBy: "price_asc" | "price_desc" | "rating_desc";
  setSortBy: (sort: "price_asc" | "price_desc" | "rating_desc") => void;
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
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search service providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="md:w-64">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:w-64">
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {serviceCategories.map((category) => (
                <SelectItem key={category.id} value={category.name.toLowerCase()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:w-64">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating_desc">Highest Rated</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;