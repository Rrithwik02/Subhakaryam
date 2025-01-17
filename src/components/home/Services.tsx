import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceCategories } from "@/data/services";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();
  const [speaking, setSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleFindProviders = (serviceType: string) => {
    navigate(`/search?service=${encodeURIComponent(serviceType.toLowerCase())}`);
  };

  const speakDescription = async (text: string) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        setSpeaking(false);
      }

      const { data, error } = await supabase.functions.invoke('voice-synthesis', {
        body: { text }
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setSpeaking(false);
        setCurrentAudio(null);
      };

      audio.play();
      setSpeaking(true);
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  };

  return (
    <section id="services-section" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon animate-slide-up-fade">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large featured card */}
          <Card className="md:col-span-2 md:row-span-2 p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-ceremonial-cream to-white">
            {(() => {
              const service = serviceCategories[0];
              const IconComponent = service.icon;
              return (
                <>
                  <div className="flex justify-between items-start">
                    <div className="animate-float">
                      <IconComponent className="w-16 h-16 text-ceremonial-gold" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (speaking) {
                          currentAudio?.pause();
                          setSpeaking(false);
                        } else {
                          speakDescription(service.description);
                        }
                      }}
                      className="hover:bg-ceremonial-gold/10"
                    >
                      {speaking ? (
                        <VolumeX className="h-6 w-6 text-ceremonial-gold" />
                      ) : (
                        <Volume2 className="h-6 w-6 text-ceremonial-gold" />
                      )}
                    </Button>
                  </div>
                  <h3 className="text-2xl font-display font-semibold mt-6 mb-4 text-ceremonial-maroon">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">{service.description}</p>
                  <p className="text-ceremonial-gold font-semibold mb-6 text-xl animate-pulse-gold">
                    Starting from ₹{service.basePrice.toLocaleString()}
                  </p>
                  <Button 
                    className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white transition-all duration-300"
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
                className="p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-white to-ceremonial-cream"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="animate-float">
                    <IconComponent className="w-12 h-12 text-ceremonial-gold" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (speaking) {
                        currentAudio?.pause();
                        setSpeaking(false);
                      } else {
                        speakDescription(service.description);
                      }
                    }}
                    className="hover:bg-ceremonial-gold/10"
                  >
                    {speaking ? (
                      <VolumeX className="h-5 w-5 text-ceremonial-gold" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-ceremonial-gold" />
                    )}
                  </Button>
                </div>
                <h3 className="text-xl font-display font-semibold mt-4 mb-2 text-ceremonial-maroon">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                <p className="text-ceremonial-gold font-semibold mb-4 animate-pulse-gold">
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