
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { EnhancedSearchFilters } from "@/components/search/EnhancedSearchFilters";
import ServiceCard from "@/components/search/ServiceCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialServiceType = searchParams.get("service");
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState(initialServiceType?.toLowerCase() || "");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [rating, setRating] = useState(0);

  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ["services", searchTerm, city, serviceType, sortBy, priceRange, rating],
    queryFn: async () => {
      try {
        let query = supabase
          .from("service_providers")
          .select("*, profiles(full_name, phone)")
          .eq("status", "approved");

        // Search by business name
        if (searchTerm) {
          query = query.ilike("business_name", `%${searchTerm}%`);
        }

        // Filter by city (including secondary city)
        if (city) {
          query = query.or(`city.ilike.%${city}%,secondary_city.ilike.%${city}%`);
        }

        // Filter by service type
        if (serviceType) {
          query = query.eq("service_type", serviceType);
        }

        // Filter by price range
        if (priceRange[0] > 0 || priceRange[1] < 100000) {
          query = query.gte("base_price", priceRange[0]).lte("base_price", priceRange[1]);
        }

        // Filter by rating
        if (rating > 0) {
          query = query.gte("rating", rating);
        }

        // Apply sorting
        switch (sortBy) {
          case "rating":
            query = query.order("rating", { ascending: false, nullsFirst: false });
            break;
          case "price_low":
            query = query.order("base_price", { ascending: true });
            break;
          case "price_high":
            query = query.order("base_price", { ascending: false });
            break;
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          default:
            query = query.order("rating", { ascending: false, nullsFirst: false });
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        return data;
      } catch (err) {
        
        throw err;
      }
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load services. Please try again later.
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon mb-2">
            Find Services
          </h1>
          <p className="text-gray-600 mb-8">
            Discover the perfect service provider for your ceremonial needs
          </p>

          <EnhancedSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            city={city}
            setCity={setCity}
            serviceType={serviceType}
            setServiceType={setServiceType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            rating={rating}
            setRating={setRating}
            resultsCount={services?.length || 0}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-scale-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                      <div className="h-8 bg-muted rounded w-24 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : services?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm animate-slide-up-fade">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria or explore different service types</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setCity('');
                    setServiceType('');
                    setPriceRange([0, 100000]);
                    setRating(0);
                  }}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service, index) => (
                <div 
                  key={service.id} 
                  className="animate-scale-up hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
