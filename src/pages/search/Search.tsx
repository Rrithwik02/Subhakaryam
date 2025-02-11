
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import SearchFilters from "@/components/search/SearchFilters";
import ServiceCard from "@/components/search/ServiceCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialServiceType = searchParams.get("service");
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState(initialServiceType?.toLowerCase() || "all");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "rating_desc">("rating_desc");

  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ["services", searchTerm, city, serviceType, sortBy],
    queryFn: async () => {
      try {
        let query = supabase
          .from("service_providers")
          .select("*, profiles(full_name, phone)");

        // Search by business name
        if (searchTerm) {
          query = query.ilike("business_name", `%${searchTerm}%`);
        }

        // Filter by city (including secondary city)
        if (city && city !== "all") {
          query = query.or(`city.ilike.%${city}%,secondary_city.ilike.%${city}%`);
        }

        // Filter by service type
        if (serviceType && serviceType !== "all") {
          query = query.eq("service_type", serviceType);
        }

        // Apply sorting
        switch (sortBy) {
          case "price_asc":
            query = query.order("base_price", { ascending: true });
            break;
          case "price_desc":
            query = query.order("base_price", { ascending: false });
            break;
          case "rating_desc":
            query = query.order("rating", { ascending: false, nullsFirst: false });
            break;
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        return data;
      } catch (err) {
        console.error("Error fetching services:", err);
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

          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            city={city}
            setCity={setCity}
            serviceType={serviceType}
            setServiceType={setServiceType}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
            </div>
          ) : services?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
