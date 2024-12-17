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

      {/* Hero Section */}
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

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-ceremonial-cream">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ceremonial-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
                Choose Your Services
              </h3>
              <p className="text-gray-600">
                Browse through our wide range of traditional services and select what you need
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-ceremonial-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
                Book Your Date
              </h3>
              <p className="text-gray-600">
                Select your preferred date and time for the ceremony
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-ceremonial-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
                Enjoy Your Ceremony
              </h3>
              <p className="text-gray-600">
                Relax and let our experienced professionals handle everything
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-ceremonial-cream to-white">
              <p className="text-gray-600 mb-4">
                "The poojari services were excellent. Very professional and knowledgeable about all the rituals."
              </p>
              <p className="font-semibold text-ceremonial-maroon">- Rama Krishna</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-ceremonial-cream to-white">
              <p className="text-gray-600 mb-4">
                "Amazing mehendi artists! They made my wedding day even more special with their beautiful designs."
              </p>
              <p className="font-semibold text-ceremonial-maroon">- Priya Sharma</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-ceremonial-cream to-white">
              <p className="text-gray-600 mb-4">
                "The decoration team did a fantastic job. Everything was exactly as we had envisioned."
              </p>
              <p className="font-semibold text-ceremonial-maroon">- Arjun Reddy</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ceremonial-maroon text-white py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-4">Subhakaryam</h3>
            <p className="text-sm opacity-80">
              Making sacred ceremonies accessible and memorable for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-ceremonial-gold transition-colors">About Us</a></li>
              <li><a href="/services" className="hover:text-ceremonial-gold transition-colors">Services</a></li>
              <li><a href="/contact" className="hover:text-ceremonial-gold transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="/services/poojari" className="hover:text-ceremonial-gold transition-colors">Poojari Services</a></li>
              <li><a href="/services/mehendi" className="hover:text-ceremonial-gold transition-colors">Mehendi & Makeup</a></li>
              <li><a href="/services/catering" className="hover:text-ceremonial-gold transition-colors">Catering</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <p className="text-sm opacity-80 mb-2">Email: info@subhakaryam.com</p>
            <p className="text-sm opacity-80">Phone: +91 98765 43210</p>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-white/20 text-center text-sm opacity-80">
          <p>© 2024 Subhakaryam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;