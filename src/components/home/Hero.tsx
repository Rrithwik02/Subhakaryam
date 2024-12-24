import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="hero-pattern py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-ceremonial-gold mb-2">
            Subhakaryam
          </h1>
          <p className="text-ceremonial-maroon text-sm font-medium mt-4">
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
            onClick={() => navigate("/register")}
          >
            Join as Service Provider
          </Button>
          <Button 
            className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/register")}
          >
            Book Services as Guest
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;