import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroContentProps {
  isAuthenticated: boolean;
}

const HeroContent = ({ isAuthenticated }: HeroContentProps) => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center text-white text-center p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-tight text-white">
          Discover Sacred Traditions
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-body text-royal-accent">
          Connect with expert ceremonial service providers for your most important occasions
        </p>
        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-royal-button text-white hover:bg-royal-hover button-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg"
              onClick={() => navigate("/search")}
            >
              Search Providers
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black button-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm"
              onClick={() => navigate("/register/service-provider")}
            >
              Become a Provider
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroContent;