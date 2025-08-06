
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BasicInformation } from "@/components/service-provider/BasicInformation";
import { ServiceAreas } from "@/components/service-provider/ServiceAreas";
import { ServiceManagerComponent } from "@/components/service-provider/ServiceManagerComponent";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext } from "@supabase/auth-helpers-react";

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();
  const [services, setServices] = useState<any[]>([]);
  const [primaryLocation, setPrimaryLocation] = useState("");
  const [secondaryLocation, setSecondaryLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(true);

  useEffect(() => {
    if (session) {
      setShowAuthForm(false);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData(e.target as HTMLFormElement);

      // Extract portfolio data from form
      const portfolioImagesStr = formData.get('portfolio_images') as string;
      const portfolioImages = portfolioImagesStr ? JSON.parse(portfolioImagesStr) : [];
      const portfolioLink = formData.get('portfolio_link') as string || '';

      // First check if the user already has a profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();


      if (profileError) {
        // Continue with registration process
      }

      // Upsert the user profile to be a service provider (handles both insert and update)
      const profileData = {
        id: user.id,
        user_type: 'service_provider',
        full_name: formData.get('owner_name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };


      const { error: upsertProfileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (upsertProfileError) {
        throw upsertProfileError;
      }
      
      // Validate services
      if (!services || services.length === 0) {
        throw new Error("Please add at least one service");
      }

      // Create the service provider record with the primary service
      const primaryService = services[0];
      const serviceProviderData = {
        profile_id: user.id,
        service_type: primaryService.service_type === 'other' ? primaryService.custom_service_name : primaryService.service_type,
        subcategory: primaryService.subcategory === 'other' ? primaryService.custom_subcategory_name : primaryService.subcategory,
        business_name: formData.get('business_name') as string,
        description: formData.get('description') as string,
        city: primaryLocation,
        secondary_city: secondaryLocation || null,
        base_price: primaryService.min_price, // Use min price as base price
        portfolio_images: portfolioImages,
        portfolio_link: portfolioLink,
        status: 'pending'
      };


      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .insert(serviceProviderData)
        .select()
        .single();

      if (providerError) {
        throw providerError;
      }

      // Create additional services entries for all services
      const additionalServicesData = services.map(service => ({
        provider_id: providerData.id,
        service_type: service.service_type === 'other' ? service.custom_service_name : service.service_type,
        subcategory: service.subcategory === 'other' ? service.custom_subcategory_name : service.subcategory,
        description: `${service.service_type === 'other' ? service.custom_service_name : service.service_type} service`,
        min_price: service.min_price,
        max_price: service.max_price,
        status: 'approved' // Auto-approve for registration
      }));

      const { error: additionalServicesError } = await supabase
        .from('additional_services')
        .insert(additionalServicesData);

      if (additionalServicesError) {
        throw additionalServicesError;
      }

      toast({
        title: "Success",
        description: "Your service provider profile has been created successfully and is pending approval.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register as service provider. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ceremonial-cream py-16 px-4">
      <Card className="max-w-2xl mx-auto p-8 space-y-8 bg-white shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-4">
            Register as Service Provider
          </h1>
          <p className="text-gray-600 text-lg">Join our network of trusted professionals</p>
        </div>
        
        {showAuthForm ? (
          <div className="space-y-6">
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
                },
                className: {
                  container: 'w-full',
                  button: 'w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white',
                  divider: 'my-6',
                }
              }}
              theme="light"
              providers={["google"]}
              view="sign_up"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <BasicInformation className="space-y-6" />
            
            <div className="space-y-6 pt-6 border-t">
              <ServiceManagerComponent 
                onServicesChange={setServices}
                className="space-y-6"
              />
            </div>

            <div className="space-y-6 pt-6 border-t">
              <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon">
                Additional Information
              </h2>
              
              <ServiceAreas 
                className="space-y-6" 
                onPrimaryLocationChange={setPrimaryLocation}
                onSecondaryLocationChange={setSecondaryLocation}
              />
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  About Your Services
                </label>
                <Textarea
                  name="description"
                  placeholder="Tell us more about your services and experience"
                  required
                  className="w-full min-h-[120px]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-xl py-6"
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
