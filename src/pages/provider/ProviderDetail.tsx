import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, MapPin, Star, Phone, ArrowLeft, Calendar } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import ReviewForm from "@/components/reviews/ReviewForm";
import BookingDialog from "@/components/bookings/BookingDialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FloatingBookingButton } from "@/components/booking/FloatingBookingButton";
import SocialSharing from "@/components/ui/social-sharing";
import ProviderCalendar from "@/components/calendar/ProviderCalendar";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, MapPin, Star, Phone, ArrowLeft, Calendar } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import ReviewForm from "@/components/reviews/ReviewForm";
import BookingDialog from "@/components/bookings/BookingDialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FloatingBookingButton } from "@/components/booking/FloatingBookingButton";
import SocialSharing from "@/components/ui/social-sharing";
import ProviderCalendar from "@/components/calendar/ProviderCalendar";

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const { data: provider, isLoading, error } = useQuery({
    queryKey: ["service-provider", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select(`
          *,
          profiles(full_name, phone),
          additional_services(id, service_type, subcategory, description, status, min_price, max_price, portfolio_images)
        `)
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ["provider-reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles(full_name)
        `)
        .eq("provider_id", id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleServiceToggle = (serviceType: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceType) 
        ? prev.filter(s => s !== serviceType)
        : [...prev, serviceType]
    );
  };

  const handleShowPhone = () => {
    setShowPhone(true);
    toast({
      title: "Phone number revealed",
      description: "You can now contact the service provider directly.",
    });
  };

  const anonymizePhone = (phone?: string) => {
    if (!phone) return "Not provided";
    return showPhone ? phone : `${phone.slice(0, 2)}•••${phone.slice(-2)}`;
  };

  const getPriceRange = () => {
    if (selectedServices.length === 0) {
      return "Select services to view pricing";
    }
    
    const selectedServiceData = allServices.filter(s => selectedServices.includes(s.type));
    
    if (selectedServiceData.length === 0) {
      return "No pricing available";
    }
    
    const minPrice = selectedServiceData.reduce((sum, service) => sum + (service.min_price || 0), 0);
    const maxPrice = selectedServiceData.reduce((sum, service) => sum + (service.max_price || 0), 0);
    
    return `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
            <Button onClick={() => navigate("/search")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const allServices = [
    { 
      type: provider.service_type,
      subcategory: provider.subcategory,
      description: `Main ${provider.service_type?.replace('_', ' ') || 'service'} service`,
      min_price: provider.base_price || 0,
      max_price: provider.base_price || 0,
      portfolio_images: provider.portfolio_images || []
    },
    ...(provider.additional_services?.filter(s => s.status === 'approved').map(s => ({
      type: s.service_type,
      subcategory: s.subcategory,
      description: s.description,
      min_price: s.min_price || 0,
      max_price: s.max_price || 0,
      portfolio_images: s.portfolio_images || []
    })) || [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/search")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-display font-bold text-ceremonial-maroon">
                  {provider.business_name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  By {provider.profiles?.full_name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {provider.is_premium && (
                  <Crown className="h-6 w-6 text-ceremonial-gold" />
                )}
                <SocialSharing 
                  url={window.location.href}
                  title={`${provider.business_name} - ${provider.service_type} Services`}
                  description={provider.description || `Professional ${provider.service_type} services by ${provider.profiles?.full_name}`}
                  image={provider.portfolio_images?.[0] ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/portfolio_images/${provider.portfolio_images[0]}` : undefined}
                />
                <FavoriteButton providerId={provider.id} />
              </div>
            </div>
          </div>

          {/* Portfolio Images */}
          {provider.portfolio_images && provider.portfolio_images.length > 0 && (
            <Card className="mb-6 overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {provider.portfolio_images.map((image, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16 / 9} className="bg-muted">
                        <img
                          src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/portfolio_images/${image}`}
                          alt={`Portfolio ${index + 1}`}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Card>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services Section */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4">
                  Available Services
                </h2>
                <p className="text-gray-600 mb-6">
                  Select the services you're interested in to view pricing information.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allServices.map((service) => (
                    <div
                      key={service.type}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        selectedServices.includes(service.type)
                          ? "border-ceremonial-gold bg-ceremonial-gold/5"
                          : "border-gray-200 hover:border-ceremonial-gold/50"
                      )}
                      onClick={() => handleServiceToggle(service.type)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold capitalize">
                          {service.type?.replace('_', ' ') || 'Service'}
                          {service.subcategory && (
                            <span className="text-sm font-normal text-gray-500 ml-1">
                              → {service.subcategory?.replace('_', ' ') || service.subcategory}
                            </span>
                          )}
                        </h3>
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.type)}
                          onChange={() => handleServiceToggle(service.type)}
                          className="text-ceremonial-gold"
                        />
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>

                {/* Price Range Display */}
                {selectedServices.length > 0 && (
                  <div className="mt-6 p-4 bg-ceremonial-gold/10 rounded-lg">
                    <h3 className="font-semibold text-ceremonial-maroon mb-2">
                      Estimated Price Range
                    </h3>
                    <p className="text-2xl font-bold text-ceremonial-gold">
                      {getPriceRange()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Final pricing will be discussed during booking based on your specific requirements.
                    </p>
                  </div>
                )}
              </Card>

              {/* Calendar Section */}
              <ProviderCalendar providerId={provider.id} isPublic={true} />

              {/* Reviews Section */}
              <Card className="p-6">
                <Tabs defaultValue="reviews" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
                    <TabsTrigger value="write-review">Write Review</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="reviews" className="mt-4">
                    {reviews && reviews.length > 0 ? (
                      <div className="space-y-6">
                        {/* Rating Summary */}
                        <div className="border-b pb-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-ceremonial-gold">
                                {provider.rating ? provider.rating.toFixed(1) : '0.0'}
                              </div>
                              <div className="flex items-center justify-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < Math.floor(provider.rating || 0)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4 last:border-b-0">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-ceremonial-gold/20 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-ceremonial-gold">
                                    {review.profiles?.full_name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{review.profiles?.full_name}</span>
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={cn(
                                            "h-4 w-4",
                                            i < review.rating
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                  <p className="text-gray-600">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No reviews yet. Be the first to review!
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="write-review" className="mt-4">
                    <ReviewForm
                      providerId={provider.id}
                      onSuccess={() => {
                        setShowReviewForm(false);
                        toast({
                          title: "Review submitted",
                          description: "Your review has been submitted for approval.",
                        });
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Provider Info */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {provider.city}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">
                      {provider.rating ? provider.rating.toFixed(1) : "New"}
                    </span>
                    <span className="text-gray-500">
                      ({reviews?.length || 0} reviews)
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <button
                      onClick={handleShowPhone}
                      className="text-ceremonial-teal hover:underline"
                    >
                      {anonymizePhone(provider.profiles?.phone)}
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 capitalize">
                    <Badge variant="secondary">
                      {provider.service_type?.replace('_', ' ') || 'Service'} Specialist
                    </Badge>
                  </div>

                  {provider.description && (
                    <p className="text-gray-600 text-sm">{provider.description}</p>
                  )}
                </div>
              </Card>

              {/* Booking Section */}
              <Card className="p-6">
                <Button
                  className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white mb-4"
                  onClick={() => setShowBookingDialog(true)}
                  disabled={selectedServices.length === 0}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Selected Services
                </Button>
                
                {selectedServices.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">
                    Select services above to enable booking
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      <BookingDialog
        isOpen={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        provider={provider}
        selectedServices={selectedServices}
        serviceData={allServices}
      />

      <FloatingBookingButton
        providerId={provider.id}
        serviceType={provider.service_type}
        basePrice={provider.base_price}
      />
    </div>
  );
};

export default ProviderDetail;