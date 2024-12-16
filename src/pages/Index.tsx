import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceCategories } from "@/data/services";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation Buttons */}
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <Button 
            className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
            onClick={() => navigate("/register")}
          >
            Join Us
          </Button>
        </div>
      </div>

      {/* Logo and Hero Section */}
      <section className="hero-pattern py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold text-ceremonial-gold mb-2">
              Subhakaryam
            </h1>
            <p className="text-ceremonial-maroon text-sm font-medium">
              Celebrating Sacred Traditions
            </p>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-ceremonial-maroon mb-6">
            Sacred Ceremonies Made Simple
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Book all your ceremonial services in one place. From poojas to weddings, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white px-8 py-6 text-lg"
              onClick={() => navigate("/register/provider")}
            >
              Join as Service Provider
            </Button>
            <Button 
              className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-6 text-lg"
              onClick={() => navigate("/register/guest")}
            >
              Book Services as Guest
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="service-card">
                  <IconComponent className="w-12 h-12 mb-4 text-ceremonial-gold" />
                  <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-ceremonial-gold font-semibold">
                    Starting from ₹{service.basePrice.toLocaleString()}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    Learn More
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full Event Package Section */}
      <section className="py-16 px-4 bg-ceremonial-cream">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-ceremonial-maroon">
            Planning a Full Event?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Let us handle everything. Get customized packages with hand-picked service providers.
          </p>
          <Button 
            className="bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/full-event")}
          >
            Build Your Package
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;