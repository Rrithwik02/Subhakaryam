import { Card } from "@/components/ui/card";
import { ServiceCategory } from "@/types/services";
import { useNavigate } from "react-router-dom";
import { serviceImages } from "@/data/services";

interface ServiceCardProps {
  service: ServiceCategory;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search?service=${encodeURIComponent(service.id)}`);
  };

  return (
    <Card 
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-ceremonial-gold hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={serviceImages[service.id] || "/placeholder.svg"}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-display font-semibold text-ceremonial-maroon">
          {service.name}
        </h3>
        <p className="text-ceremonial-teal font-medium">
          From ₹{service.basePrice.toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

export default ServiceCard;
