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
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState("");
  const [primaryLocation, setPrimaryLocation] = useState("");
  const [secondaryLocation, setSecondaryLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData(e.target as HTMLFormElement);
      
      // First update the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          user_type: 'service_provider',
          full_name: formData.get('owner_name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      // Then create the service provider record
      const serviceProviderData = {
        profile_id: user.id,
        service_type: selectedService,
        business_name: formData.get('business_name') as string,
        description: formData.get('description') as string,
        city: primaryLocation,
        secondary_city: secondaryLocation || null,
        base_price: parseFloat(formData.get('base_price') as string),
      };

      const { error: providerError } = await supabase
        .from('service_providers')
        .insert(serviceProviderData)
        .select()
        .single();

      if (providerError) throw providerError;

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

  // Listen for authentication state changes
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") {
      setShowAuthForm(false);
    }
  });

  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl p-6 space-y-6 bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
            Register as Service Provider
          </h1>
          <p className="text-gray-600">Join our network of trusted professionals</p>
        </div>
        
        {showAuthForm ? (
          <div className="space-y-4">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#B8860B',
                      brandAccent: '#966F08',
                    }
                  }
                }
              }}
              theme="light"
              providers={[]}
              view="sign_up"
            />
          </div>
        ) : (
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
              
              <ServiceAreas 
                className="space-y-4" 
                onPrimaryLocationChange={setPrimaryLocation}
                onSecondaryLocationChange={setSecondaryLocation}
              />
              
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
        )}
      </Card>
    </div>
  );
};

export default ServiceProviderRegister;