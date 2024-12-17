import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";

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

      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;