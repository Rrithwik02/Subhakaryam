import { serviceCategories } from "@/data/services";
import { useEffect } from "react";
import FeaturedService from "./services/FeaturedService";
import ServiceCard from "./services/ServiceCard";
import { useVoiceSynthesizer } from "./services/VoiceSynthesizer";

const Services = () => {
  const { speakDescription, stopSpeaking, isLoading } = useVoiceSynthesizer();

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <section id="services-section" className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8 text-ceremonial-maroon animate-slide-up-fade">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeaturedService 
            service={serviceCategories[0]}
            onMouseEnter={() => !isLoading && speakDescription(serviceCategories[0].description)}
            onMouseLeave={stopSpeaking}
          />
          
          {serviceCategories.slice(1).map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onMouseEnter={() => !isLoading && speakDescription(service.description)}
              onMouseLeave={stopSpeaking}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;