import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceCategory } from "@/types/services";
import { useNavigate } from "react-router-dom";

interface FeaturedServiceProps {
  service: ServiceCategory;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const FeaturedService = ({ service, onMouseEnter, onMouseLeave }: FeaturedServiceProps) => {
  const navigate = useNavigate();
  const IconComponent = service.icon;

  const handleFindProviders = (serviceType: string) => {
    navigate(`/search?service=${encodeURIComponent(serviceType.toLowerCase())}`);
  };

  return (
    <Card 
      className="md:col-span-2 p-4 md:p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg bg-gradient-to-br from-ceremonial-cream to-white shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="animate-float filter drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">
            <IconComponent className="w-12 h-12 text-ceremonial-gold" />
          </div>
          <h3 className="text-xl md:text-2xl font-display font-semibold mt-4 mb-3 text-ceremonial-maroon">
            {service.name}
          </h3>
          <p className="text-gray-600 mb-4 text-base md:text-lg">{service.description}</p>
          <p className="text-ceremonial-gold font-semibold mb-4 text-lg md:text-xl animate-pulse-gold">
            Starting from ₹{service.basePrice.toLocaleString()}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Button 
            variant="outline"
            className="w-full md:w-auto min-w-[200px] border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-colors"
            onClick={() => handleFindProviders(service.name)}
          >
            Find Providers
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedService;