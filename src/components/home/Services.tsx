import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceCategories } from "@/data/services";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";

const Services = () => {
  const navigate = useNavigate();
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const audioTimeoutRef = useRef<NodeJS.Timeout>();

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

      // Set a small delay before starting new audio to prevent rapid switching
      audioTimeoutRef.current = setTimeout(async () => {
        const { data, error } = await supabase.functions.invoke('voice-synthesis', {
          body: { text }
        });

        if (error) throw error;

        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        setCurrentAudio(audio);
        audio.play();
      }, 300);

    } catch (error) {
      console.error('Error generating speech:', error);
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
          <Card className="md:col-span-2 p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg bg-gradient-to-br from-ceremonial-cream to-white"
                onMouseEnter={() => speakDescription(serviceCategories[0].description)}
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
                    className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-all duration-300"
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
                className="p-4 transform transition-all duration-300 hover:scale-102 hover:shadow-lg bg-gradient-to-br from-white to-ceremonial-cream"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => speakDescription(service.description)}
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
                  className="w-full border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-all duration-300"
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