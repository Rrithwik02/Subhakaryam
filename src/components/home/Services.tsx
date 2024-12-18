import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceCategories } from "@/data/services";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="p-6">
                <IconComponent className="w-12 h-12 mb-4 text-ceremonial-gold" />
                <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-ceremonial-gold font-semibold mb-4">
                  Starting from ₹{service.basePrice.toLocaleString()}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
                  onClick={() => navigate("/search")}
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