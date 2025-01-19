import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceCategories } from "@/data/services";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const navigate = useNavigate();
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const handleFindProviders = (serviceType: string) => {
    navigate(`/search?service=${encodeURIComponent(serviceType.toLowerCase())}`);
  };

  const speakDescription = async (text: string) => {
    try {
      // Clear any existing timeout
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }

      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }

      if (isLoading) return;

      setIsLoading(true);

      // Set a small delay before starting new audio to prevent rapid switching
      audioTimeoutRef.current = setTimeout(async () => {
        try {
          const { data, error } = await supabase.functions.invoke('voice-synthesis', {
            body: { text }
          });

          if (error) {
            console.error('Voice synthesis error:', error);
            if (error.message?.includes('Rate limit exceeded')) {
              toast({
                title: "Please wait",
                description: "Too many requests. Please wait a moment before trying again.",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Error",
                description: "Failed to generate speech. Please try again later.",
                variant: "destructive"
              });
            }
            return;
          }

          if (data?.audio) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
            setCurrentAudio(audio);
            await audio.play();
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          toast({
            title: "Error",
            description: "Failed to play audio. Please try again later.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }, 300);

    } catch (error) {
      console.error('Error in speech generation:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="services-section" className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8 text-ceremonial-maroon animate-slide-up-fade">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large featured card */}
          <Card className="md:col-span-2 p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg bg-gradient-to-br from-ceremonial-cream to-white shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff]"
                onMouseEnter={() => !isLoading && speakDescription(serviceCategories[0].description)}
                onMouseLeave={() => {
                  if (currentAudio) {
                    currentAudio.pause();
                    setCurrentAudio(null);
                  }
                }}>
            {(() => {
              const service = serviceCategories[0];
              const IconComponent = service.icon;
              return (
                <>
                  <div className="flex justify-between items-start">
                    <div className="animate-float">
                      <IconComponent className="w-12 h-12 text-ceremonial-gold" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-semibold mt-4 mb-3 text-ceremonial-maroon">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">{service.description}</p>
                  <p className="text-ceremonial-gold font-semibold mb-4 text-xl animate-pulse-gold">
                    Starting from ₹{service.basePrice.toLocaleString()}
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-all duration-300 shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d9d9d9,inset_-5px_-5px_10px_#ffffff]"
                    onClick={() => handleFindProviders(service.name)}
                  >
                    Find Providers
                  </Button>
                </>
              );
            })()}
          </Card>

          {/* Smaller cards */}
          {serviceCategories.slice(1).map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className="p-4 transform transition-all duration-300 hover:scale-102 hover:shadow-lg bg-gradient-to-br from-white to-ceremonial-cream shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff]"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => !isLoading && speakDescription(service.description)}
                onMouseLeave={() => {
                  if (currentAudio) {
                    currentAudio.pause();
                    setCurrentAudio(null);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="animate-float">
                    <IconComponent className="w-8 h-8 text-ceremonial-gold" />
                  </div>
                </div>
                <h3 className="text-lg font-display font-semibold mt-3 mb-2 text-ceremonial-maroon">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{service.description}</p>
                <p className="text-ceremonial-gold font-semibold mb-3 text-sm animate-pulse-gold">
                  Starting from ₹{service.basePrice.toLocaleString()}
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-all duration-300 shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d9d9d9,inset_-5px_-5px_10px_#ffffff]"
                  onClick={() => handleFindProviders(service.name)}
                >
                  Find Providers
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;