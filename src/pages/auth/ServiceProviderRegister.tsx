
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
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomRegistrationForm from "@/components/auth/CustomRegistrationForm";

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();
  const [services, setServices] = useState<any[]>([]);
  const [serviceCities, setServiceCities] = useState<string[]>([]);
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
      
      // Parse service cities from hidden input
      const serviceCitiesStr = formData.get('service_cities') as string;
      const parsedCities = serviceCitiesStr ? JSON.parse(serviceCitiesStr) : [];
      const primaryCity = parsedCities[0] || '';
      const secondaryCity = parsedCities[1] || null;
      
      const serviceProviderData = {
        profile_id: user.id,
        service_type: primaryService.service_type === 'other' ? primaryService.custom_service_name : primaryService.service_type,
        subcategory: primaryService.subcategory === 'other' ? primaryService.custom_subcategory_name : primaryService.subcategory,
        business_name: formData.get('business_name') as string,
        description: formData.get('description') as string,
        city: primaryCity,
        secondary_city: secondaryCity,
        service_cities: parsedCities,
        base_price: primaryService.min_price, // Use min price as base price
        portfolio_images: portfolioImages,
        portfolio_link: portfolioLink,
        status: 'pending',
        // New global fields
        logo_url: formData.get('logo_url') as string || null,
        gst_number: formData.get('gst_number') as string || null,
        whatsapp_number: formData.get('whatsapp_number') as string || null,
        website_url: formData.get('website_url') as string || null,
        facebook_url: formData.get('facebook_url') as string || null,
        instagram_url: formData.get('instagram_url') as string || null,
        youtube_url: formData.get('youtube_url') as string || null,
        verification_document_url: formData.get('verification_document_url') as string || null,
        terms_accepted: formData.get('terms_accepted') === 'true',
        terms_accepted_at: formData.get('terms_accepted') === 'true' ? new Date().toISOString() : null,
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
    <div className="min-h-screen bg-ceremonial-cream py-4 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-lg flex flex-col max-h-[calc(100vh-2rem)]">
          <div className="p-8 text-center flex-shrink-0">
            <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-4">
              Register as Service Provider
            </h1>
            <p className="text-gray-600 text-lg">Join our network of trusted professionals</p>
          </div>
        
          {showAuthForm ? (
            <div className="p-8 space-y-6">
              <div className="w-full max-w-md mx-auto">
                <CustomRegistrationForm 
                  isServiceProvider={true}
                  onSuccess={() => setShowAuthForm(false)} 
                />
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-8">
                <form id="service-provider-form" onSubmit={handleSubmit} className="space-y-8 pb-4">
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
                      value={serviceCities}
                      onChange={setServiceCities}
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
                </form>
              </ScrollArea>
              
              <div className="p-8 flex-shrink-0 border-t">
                <Button
                  type="submit"
                  form="service-provider-form"
                  className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-xl py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register as Service Provider"}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ServiceProviderRegister;
