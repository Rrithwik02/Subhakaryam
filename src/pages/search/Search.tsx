import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Star, MapPin, IndianRupee, Crown, Search as SearchIcon } from "lucide-react";
import { serviceCategories } from "@/data/services";

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialServiceType = searchParams.get("service");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState(initialServiceType?.toLowerCase() || "");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "rating_desc">("rating_desc");
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", city, sortBy, serviceType],
    queryFn: async () => {
      let query = supabase
        .from("service_providers")
        .select("*, profiles(full_name)");

      if (city) {
        query = query.ilike("city", `%${city}%`);
      }

      if (serviceType) {
        query = query.ilike("service_type", `%${serviceType}%`);
      }

      switch (sortBy) {
        case "price_asc":
          query = query.order("base_price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("base_price", { ascending: false });
          break;
        case "rating_desc":
          query = query.order("rating", { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch services",
        });
        return [];
      }

      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon mb-2">
            Find Services
          </h1>
          <p className="text-gray-600 mb-8">
            Discover the perfect service provider for your ceremonial needs
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Services</SelectItem>
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

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
            </div>
          ) : services?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-ceremonial-maroon mb-1">
                          {service.business_name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          By {service.profiles?.full_name}
                        </p>
                      </div>
                      {service.is_premium && (
                        <Crown className="h-6 w-6 text-ceremonial-gold" />
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {service.city}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <IndianRupee className="h-4 w-4 mr-2" />
                        <span className="font-semibold text-ceremonial-gold">
                          {service.base_price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{service.rating || "New"}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "Booking functionality will be available soon!",
                        });
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;