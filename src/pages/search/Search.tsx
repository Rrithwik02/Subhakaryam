import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, IndianRupee, Star } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Search = () => {
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("price_asc");
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data;
    },
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", city, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("service_providers")
        .select("*")
        .order(
          sortBy === "price_asc" 
            ? "base_price" 
            : sortBy === "price_desc" 
              ? "base_price" 
              : "rating", 
          { ascending: sortBy === "price_asc" }
        );

      if (city) {
        query = query.ilike("city", `%${city}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch services. Please try again.",
        });
        return [];
      }

      return data;
    },
    enabled: true,
  });

  // Show admin dashboard for admin users
  if (userProfile?.user_type === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-8">
          Find Services
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search by city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="md:w-1/3"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <Card key={service.id} className="p-6">
                <h3 className="text-xl font-display font-semibold text-ceremonial-maroon mb-2">
                  {service.business_name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{service.city}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <IndianRupee className="h-4 w-4" />
                  <span>Starting from ₹{service.base_price}</span>
                </div>
                {service.rating && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Star className="h-4 w-4 fill-ceremonial-gold text-ceremonial-gold" />
                    <span>{service.rating.toFixed(1)}</span>
                  </div>
                )}
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button 
                  className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Booking functionality will be available soon!",
                    });
                  }}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;