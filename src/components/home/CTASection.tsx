import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Search, Plus, Calendar, Phone } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const ctaItems = [
    {
      title: "Need a Service?",
      description: "Find and book verified service providers for your ceremonies",
      icon: <Search className="h-8 w-8 text-ceremonial-gold mb-4" />,
      buttonText: "Find Services",
      action: () => navigate("/search"),
      primary: true
    },
    {
      title: "Become a Provider",
      description: "Join our network of trusted service providers",
      icon: <Plus className="h-8 w-8 text-ceremonial-gold mb-4" />,
      buttonText: "Join Now",
      action: () => navigate("/register/service-provider"),
      primary: false
    },
    {
      title: "Track Your Booking",
      description: "Check the status of your ceremony bookings",
      icon: <Calendar className="h-8 w-8 text-ceremonial-gold mb-4" />,
      buttonText: "Track Booking",
      action: () => navigate("/track-booking"),
      primary: false
    },
    {
      title: "Need Help?",
      description: "Get in touch with our support team",
      icon: <Phone className="h-8 w-8 text-ceremonial-gold mb-4" />,
      buttonText: "Contact Us",
      action: () => navigate("/contact"),
      primary: false
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-ceremonial-cream to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            Whether you need services or want to provide them, we're here to help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ctaItems.map((item, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-ceremonial-maroon mb-2">
                {item.title}
              </h3>
              <p className="text-ceremonial-brown mb-6 text-sm">
                {item.description}
              </p>
              <Button
                onClick={item.action}
                className={
                  item.primary
                    ? "w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                    : "w-full bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white"
                }
              >
                {item.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;