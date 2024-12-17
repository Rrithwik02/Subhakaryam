import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BasicInformation } from "@/components/service-provider/BasicInformation";
import { ServiceSelection } from "@/components/service-provider/ServiceSelection";
import { ServiceAreas } from "@/components/service-provider/ServiceAreas";

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Service provider registration will be implemented soon.",
    });
  };

  const renderServiceSpecificFields = () => {
    switch (selectedService) {
      case "poojari":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <Input type="number" required min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Specializations
              </label>
              <Textarea
                placeholder="List your specializations in different types of pujas and ceremonies"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Languages Known
              </label>
              <Input placeholder="e.g., Sanskrit, Hindi, Tamil" required />
            </div>
          </>
        );

      case "mehendi":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Style Specialties
              </label>
              <Input
                placeholder="e.g., Arabic, Indian, Indo-Arabic"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Maximum Designs Per Day
              </label>
              <Input type="number" required min="1" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Portfolio Link
              </label>
              <Input type="url" placeholder="Link to your work samples" />
            </div>
          </>
        );

      case "photo":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Equipment Details
              </label>
              <Textarea
                placeholder="List your camera equipment and accessories"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Photography Style
              </label>
              <Input
                placeholder="e.g., Traditional, Contemporary, Candid"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Portfolio Website
              </label>
              <Input type="url" placeholder="Link to your portfolio" required />
            </div>
          </>
        );

      case "catering":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Cuisine Specialties
              </label>
              <Textarea
                placeholder="List the types of cuisines you specialize in"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Maximum Capacity
              </label>
              <Input
                type="number"
                placeholder="Maximum number of people you can serve"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Food License Number
              </label>
              <Input required />
            </div>
          </>
        );

      case "music":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Instruments
              </label>
              <Textarea
                placeholder="List the instruments you/your team plays"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Group Size
              </label>
              <Input
                type="number"
                placeholder="Number of performers in your group"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Sample Performance Link
              </label>
              <Input type="url" placeholder="Link to your performance video" />
            </div>
          </>
        );

      case "decoration":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Decoration Styles
              </label>
              <Textarea
                placeholder="List your decoration specialties"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Maximum Event Size
              </label>
              <Input
                type="number"
                placeholder="Maximum venue size you can handle (in sq ft)"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Portfolio Link
              </label>
              <Input type="url" placeholder="Link to your previous work" />
            </div>
          </>
        );

      default:
        return null;
    };
  };

  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl p-6 space-y-6 bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
            Register as Service Provider
          </h1>
          <p className="text-gray-600">Join our network of trusted professionals</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicInformation className="space-y-4" />
          
          <ServiceSelection 
            className="space-y-4" 
            onServiceChange={setSelectedService} 
          />

          {selectedService && (
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-display font-semibold text-ceremonial-maroon">
                Service Details
              </h2>
              {renderServiceSpecificFields()}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-xl font-display font-semibold text-ceremonial-maroon">
              Additional Information
            </h2>
            
            <ServiceAreas className="space-y-4" />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Base Price (₹)
              </label>
              <Input type="number" min="0" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                About Your Services
              </label>
              <Textarea
                placeholder="Tell us more about your services and experience"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
          >
            Register as Service Provider
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Button
            variant="link"
            className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 p-0"
            onClick={() => navigate("/login")}
          >
            Sign in here
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ServiceProviderRegister;
