import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2, Star } from "lucide-react";

const Search = () => {
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "rating_desc">("rating_desc");
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", city, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("service_providers")
        .select("*, profiles(full_name)");

      if (city) {
        query = query.ilike("city", `%${city}%`);
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-8">
        Find Services
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="md:w-64"
        />
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating_desc">Highest Rated</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <Card key={service.id} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.business_name}</h3>
              <p className="text-gray-600 mb-2">
                By {service.profiles?.full_name}
              </p>
              <p className="text-gray-600 mb-2 capitalize">
                {service.service_type}
              </p>
              <p className="text-gray-600 mb-2">{service.city}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-semibold text-ceremonial-gold">
                  ₹{service.base_price}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <span>{service.rating || "N/A"}</span>
                </div>
              </div>
              {service.is_premium && (
                <div className="mt-2">
                  <span className="bg-ceremonial-gold text-white text-sm px-2 py-1 rounded">
                    Premium
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;