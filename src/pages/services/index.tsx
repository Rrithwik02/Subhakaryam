
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceCategories } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import ServiceCard from "@/components/search/ServiceCard";

const ServicesPage = () => {
  const { data: providers, isLoading } = useQuery({
    queryKey: ["service-providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*, profiles(full_name, phone)")
        .eq("status", "approved");

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display font-bold text-ceremonial-maroon mb-8">
          Our Services
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {serviceCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <category.icon className="h-6 w-6 text-ceremonial-gold" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{category.description}</p>
                <p className="text-sm text-ceremonial-gold font-semibold">
                  Starting from ₹{category.basePrice.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-display font-bold text-ceremonial-maroon mb-6">
          Available Service Providers
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers?.map((provider) => (
              <ServiceCard key={provider.id} service={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
