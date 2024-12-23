import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, MapPin, IndianRupee, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceCardProps {
  service: {
    business_name: string;
    profiles?: {
      full_name: string;
    };
    city: string;
    base_price: number;
    rating: number;
    is_premium: boolean;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const { toast } = useToast();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
  );
};

export default ServiceCard;