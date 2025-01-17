import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceCategories } from "@/data/services";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const handleFindProviders = (serviceType: string) => {
    navigate(`/search?service=${encodeURIComponent(serviceType.toLowerCase())}`);
  };

  return (
    <section id="services-section" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon animate-slide-up-fade">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className="p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="animate-float">
                  <IconComponent className="w-12 h-12 mb-4 text-ceremonial-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-ceremonial-gold font-semibold mb-4 animate-pulse-gold">
                  Starting from ₹{service.basePrice.toLocaleString()}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-all duration-300"
                  onClick={() => handleFindProviders(service.name)}
                >
                  Find Providers
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;