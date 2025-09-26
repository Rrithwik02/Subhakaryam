import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page
  if (location.pathname === "/") return null;

  const getBackRoute = () => {
    const path = location.pathname;
    
    // Context-aware back navigation
    if (path.startsWith("/provider/")) return "/search";
    if (path.startsWith("/services/")) return "/";
    if (path.startsWith("/blog/") && path !== "/blog") return "/blog";
    if (path.startsWith("/auth/")) return "/";
    if (path.startsWith("/profile/")) return "/";
    if (path === "/search") return "/";
    if (path === "/contact") return "/";
    if (path === "/about") return "/";
    
    // Default fallback
    return "/";
  };

  const handleBack = () => {
    const backRoute = getBackRoute();
    navigate(backRoute);
  };

  return (
    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-sm border-b mb-4">
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