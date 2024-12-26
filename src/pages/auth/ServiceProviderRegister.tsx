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
import { ServiceDetails } from "@/components/service-provider/ServiceDetails";
import { supabase } from "@/integrations/supabase/client";

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const user = await supabase.auth.getUser();
      
      if (!user.data.user?.id) {
        throw new Error("User not authenticated");
      }

      // Convert form data to the correct types
      const serviceProviderData = {
        profile_id: user.data.user.id,
        service_type: selectedService,
        business_name: formData.get('business_name') as string,
        description: formData.get('description') as string,
        city: formData.get('city') as string,
        // Convert base_price to number
        base_price: Number(formData.get('base_price')),
      };

      const { data: serviceProvider, error } = await supabase
        .from('service_providers')
        .insert(serviceProviderData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your service provider profile has been created successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Error registering service provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register as service provider. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <ServiceDetails 
              selectedService={selectedService}
              className="space-y-4 pt-4 border-t"
            />
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
              <Input type="number" name="base_price" min="0" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                About Your Services
              </label>
              <Textarea
                name="description"
                placeholder="Tell us more about your services and experience"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register as Service Provider"}
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