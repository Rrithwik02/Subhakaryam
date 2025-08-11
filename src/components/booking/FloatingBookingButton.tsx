import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowUp } from "lucide-react";
import { SimpleBookingDialog } from "./SimpleBookingDialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingBookingButtonProps {
  providerId: string;
  serviceType: string;
  basePrice?: number;
  className?: string;
}

export const FloatingBookingButton = ({ 
  providerId, 
  serviceType, 
  basePrice, 
  className 
}: FloatingBookingButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Only show on mobile devices
  if (!isMobile) return null;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 transform",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
          className
        )}
      >
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setShowBookingDialog(true)}
            className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white rounded-full shadow-lg h-14 px-6 flex items-center gap-2"
            size="lg"
          >
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">Book Now</span>
            {basePrice && (
              <span className="text-sm opacity-90">from ₹{basePrice.toLocaleString()}</span>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm rounded-full shadow-md h-10 w-10 p-0 ml-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <SimpleBookingDialog
        isOpen={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        providerId={providerId}
        serviceType={serviceType}
        basePrice={basePrice}
      />
    </>
  );
};