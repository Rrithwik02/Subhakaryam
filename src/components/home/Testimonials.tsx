import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Testimonials = () => {
  // Fetch approved reviews from the database
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id,
          provider_id
        `)
        .eq("status", "approved")
        .not("comment", "is", null)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      
      // Fetch user and provider details separately
      if (!data || data.length === 0) return [];
      
      const enrichedReviews = await Promise.all(
        data.map(async (review) => {
          const [userResult, providerResult] = await Promise.all([
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", review.user_id)
              .maybeSingle(),
            supabase
              .from("service_providers")
              .select("service_type, city")
              .eq("id", review.provider_id)
              .maybeSingle()
          ]);
          
          return {
            ...review,
            profiles: userResult.data,
            service_providers: providerResult.data
          };
        })
      );
      
      return enrichedReviews;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
              Real experiences from families who trusted us with their sacred ceremonies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
              Be the first to share your experience with our service providers!
            </p>
          </div>
          <div className="text-center text-gray-500">
            <p className="text-lg">No reviews yet. Book a service and share your experience to help others!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4 animate-slide-up-fade">
            What Our Clients Say
          </h2>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            Real experiences from families who trusted our service providers with their sacred ceremonies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card 
              key={review.id} 
              className="p-6 bg-gradient-to-br from-ceremonial-cream to-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up-fade relative" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <Quote className="h-8 w-8 text-ceremonial-gold/30" />
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-ceremonial-gold fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{review.comment}"
              </p>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-ceremonial-maroon">
                      {review.profiles?.full_name || "Anonymous"}
                    </p>
                    <p className="text-sm text-ceremonial-brown">
                      {review.service_providers?.service_type || "Service"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {review.service_providers?.city || ""}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;