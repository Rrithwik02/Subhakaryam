
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, MapPin, IndianRupee, Star, Phone } from "lucide-react";
import { useState } from "react";
import ReviewForm from "@/components/reviews/ReviewForm";
import BookingDialog from "@/components/bookings/BookingDialog";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

interface ServiceCardProps {
  service: {
    id: string;
    business_name: string;
    profiles?: {
      full_name: string;
      phone?: string;
    };
    city: string;
    base_price: number;
    rating: number;
    is_premium: boolean;
    portfolio_images?: string[];
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const { toast } = useToast();

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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 md:p-6">
        {service.portfolio_images && service.portfolio_images.length > 0 && (
          <div className="mb-4 -mx-4 md:-mx-6">
            <Carousel className="w-full">
              <CarouselContent>
                {service.portfolio_images.map((image, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <img
                        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/portfolio_images/${image}`}
                        alt={`Portfolio ${index + 1}`}
                        className="rounded-none md:rounded-lg object-cover w-full h-full"
                        loading="lazy"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-semibold text-ceremonial-maroon">
              {service.business_name}
            </h3>
            <p className="text-sm text-gray-600">
              By {service.profiles?.full_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {service.is_premium && (
              <Crown className="h-5 w-5 text-ceremonial-gold" />
            )}
            <FavoriteButton providerId={service.id} />
          </div>
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
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">
              {service.rating ? service.rating.toFixed(1) : "New"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <button
              onClick={handleShowPhone}
              className="text-ceremonial-teal hover:underline"
            >
              {anonymizePhone(service.profiles?.phone)}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
            onClick={() => setShowBookingDialog(true)}
          >
            Book Service
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </Button>
        </div>

        {showReviewForm && (
          <div className="mt-4 pt-4 border-t">
            <ReviewForm
              providerId={service.id}
              onSuccess={() => setShowReviewForm(false)}
            />
          </div>
        )}

        <BookingDialog
          isOpen={showBookingDialog}
          onClose={() => setShowBookingDialog(false)}
          provider={service}
        />
      </div>
    </Card>
  );
};

export default ServiceCard;
