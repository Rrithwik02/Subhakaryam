import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceCategory } from "@/types/services";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  service: ServiceCategory;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ServiceCard = ({ service, index, onMouseEnter, onMouseLeave }: ServiceCardProps) => {
  const navigate = useNavigate();
  const IconComponent = service.icon;

  const handleFindProviders = (serviceType: string) => {
    navigate(`/search?service=${encodeURIComponent(serviceType.toLowerCase())}`);
  };

  return (
    <Card 
      className="p-4 transform transition-all duration-300 hover:scale-102 hover:shadow-lg bg-gradient-to-br from-white to-ceremonial-cream shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff]"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between items-start">
        <div className="animate-float filter drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">
          <IconComponent className="w-8 h-8 text-ceremonial-gold" />
        </div>
      </div>
      <h3 className="text-lg font-display font-semibold mt-3 mb-2 text-ceremonial-maroon">
        {service.name}
      </h3>
      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{service.description}</p>
      <p className="text-ceremonial-gold font-semibold mb-3 text-sm animate-pulse-gold">
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

export default ServiceCard;