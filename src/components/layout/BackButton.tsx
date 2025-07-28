import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page
  if (location.pathname === "/") return null;

  const handleBack = () => {
    // Always try to go back first
    navigate(-1);
  };

  return (
    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="my-2"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default BackButton;