import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const generateLogo = async () => {
      try {
        const { data: { publicUrl } } = supabase
          .storage
          .from('assets')
          .getPublicUrl('logo.webp');
          
        // Try to load existing logo first
        const img = new Image();
        img.src = publicUrl;
        img.onload = () => {
          setLogoUrl(publicUrl);
          setIsLoading(false);
        };
        img.onerror = async () => {
          // If logo doesn't exist, generate new one
          const { data, error } = await supabase.functions.invoke('generate-logo');
          
          if (error) throw error;
          
          if (data?.data?.[1]?.imageURL) {
            // Download the generated image
            const response = await fetch(data.data[1].imageURL);
            const blob = await response.blob();
            
            // Upload to Supabase Storage
            const { error: uploadError } = await supabase
              .storage
              .from('assets')
              .upload('logo.webp', blob, {
                contentType: 'image/webp',
                upsert: true
              });
              
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabase
              .storage
              .from('assets')
              .getPublicUrl('logo.webp');
              
            setLogoUrl(publicUrl);
          }
          setIsLoading(false);
        };
      } catch (error) {
        console.error('Error generating logo:', error);
        setIsLoading(false);
      }
    };

    generateLogo();
  }, []);
  
  return (
    <section className="hero-pattern py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-ceremonial-gold" />
            </div>
          ) : logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Subhakaryam Logo" 
              className="h-32 mx-auto object-contain"
            />
          ) : (
            <h1 className="text-4xl font-display font-bold text-ceremonial-gold mb-2">
              Subhakaryam
            </h1>
          )}
          <p className="text-ceremonial-maroon text-sm font-medium mt-4">
            Celebrating Sacred Traditions
          </p>
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-ceremonial-maroon mb-6">
          Sacred Ceremonies Made Simple
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Book all your ceremonial services in one place. From poojas to weddings, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            className="bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/register")}
          >
            Join as Service Provider
          </Button>
          <Button 
            className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/register")}
          >
            Book Services as Guest
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;