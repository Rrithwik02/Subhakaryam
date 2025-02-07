
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
import { PaymentInformation } from "@/components/service-provider/PaymentInformation";
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
  const [paymentMethod, setPaymentMethod] = useState<"bank_account" | "upi" | "qr_code">("bank_account");

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

      const { data: provider, error: providerError } = await supabase
        .from('service_providers')
        .insert(serviceProviderData)
        .select()
        .single();

      if (providerError) throw providerError;

      // Finally, save the payment details
      const paymentData = {
        provider_id: provider.id,
        payment_method: paymentMethod,
        account_holder_name: formData.get('account_holder_name') as string,
        bank_name: formData.get('bank_name') as string,
        account_number: formData.get('account_number') as string,
        ifsc_code: formData.get('ifsc_code') as string,
        upi_id: formData.get('upi_id') as string,
        qr_code_url: formData.get('qr_code_url') as string,
      };

      const { error: paymentError } = await supabase
        .from('provider_payment_details')
        .insert(paymentData);

      if (paymentError) throw paymentError;

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
            
            <ServiceSelection 
              className="space-y-6" 
              onServiceChange={setSelectedService} 
            />

            {selectedService && (
              <ServiceDetails 
                selectedService={selectedService}
                className="space-y-6 pt-6 border-t"
              />
            )}

            <PaymentInformation 
              className="space-y-6 pt-6 border-t"
              onPaymentMethodChange={setPaymentMethod}
            />

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
                  Base Price (₹)
                </label>
                <Input 
                  type="number" 
                  name="base_price" 
                  min="0" 
                  required 
                  className="w-full"
                />
              </div>
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
