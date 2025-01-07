import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  isServiceProvider: boolean;
}

const QuickActions = ({ isServiceProvider }: QuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 -mt-20 relative z-10 mb-12">
      <div className="glass-card p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-display font-bold text-royal-light mb-6">
          Welcome Back
        </h2>
        <div className="flex flex-wrap gap-4">
          {isServiceProvider ? (
            <>
              <Button 
                size="lg"
                className="bg-royal-button hover:bg-royal-hover text-white button-hover rounded-full shadow-lg"
                onClick={() => navigate("/dashboard")}
              >
                Provider Dashboard
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-royal-light text-royal-light hover:bg-royal-light hover:text-royal-bg button-hover rounded-full"
                onClick={() => navigate("/provider/profile")}
              >
                View Profile
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="lg"
                className="bg-royal-button hover:bg-royal-hover text-white button-hover rounded-full shadow-lg"
                onClick={() => navigate("/search")}
              >
                Find Services
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-royal-light text-royal-light hover:bg-royal-light hover:text-royal-bg button-hover rounded-full"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;