
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, MapPin, Star, Eye } from "lucide-react";
import { useState } from "react";
import FavoriteButton from "@/components/favorites/FavoriteButton";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { SUPABASE_URL } from "@/integrations/supabase/client";

interface ServiceCardProps {
  service: {
    id: string;
    business_name: string;
    profiles?: {
      full_name: string;
      phone?: string;
    };
    city: string;
    rating: number;
    is_premium: boolean;
    portfolio_images?: string[];
    service_type: string;
    description?: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/provider/${service.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={cn(
        isMobile ? "p-3" : "p-4 md:p-6"
      )}>
        {service.portfolio_images && service.portfolio_images.length > 0 && (
          <div className={cn(
            "mb-4",
            isMobile ? "-mx-3" : "-mx-4 md:-mx-6"
          )}>
            <Carousel className="w-full">
              <CarouselContent>
                {service.portfolio_images.map((image, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <img
                        src={`${SUPABASE_URL}/storage/v1/object/public/portfolio_images/${image}`}}
                        alt={`Portfolio ${index + 1}`}
                        className={cn(
                          "object-cover w-full h-full",
                          isMobile ? "rounded-none" : "rounded-none md:rounded-lg"
                        )}
                        loading="lazy"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className={isMobile ? "block" : "hidden md:block"}>
                <CarouselPrevious className={cn(
                  isMobile && "h-8 w-8 left-2"
                )} />
                <CarouselNext className={cn(
                  isMobile && "h-8 w-8 right-2"
                )} />
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
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {service.city}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">
              {service.rating ? service.rating.toFixed(1) : "New"}
            </span>
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {service.service_type.replace('_', ' ')} Specialist
          </div>
          {service.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {service.description}
            </p>
          )}
        </div>

        <Button 
          className={cn(
            "w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white",
            isMobile && "h-12 text-base"
          )}
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details & Services
        </Button>
      </div>
    </Card>
  );
};

export default ServiceCard;
