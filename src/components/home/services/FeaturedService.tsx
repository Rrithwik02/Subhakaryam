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
      className="md:col-span-2 p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg bg-gradient-to-br from-ceremonial-cream to-white shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between items-start">
        <div className="animate-float filter drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">
          <IconComponent className="w-12 h-12 text-ceremonial-gold" />
        </div>
      </div>
      <h3 className="text-2xl font-display font-semibold mt-4 mb-3 text-ceremonial-maroon">
        {service.name}
      </h3>
      <p className="text-gray-600 mb-4 text-lg">{service.description}</p>
      <p className="text-ceremonial-gold font-semibold mb-4 text-xl animate-pulse-gold">
        Starting from ₹{service.basePrice.toLocaleString()}
      </p>
      <Button 
        variant="outline"
        className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-colors"
        onClick={() => handleFindProviders(service.name)}
      >
        Find Providers
      </Button>
    </Card>
  );
};

export default FeaturedService;