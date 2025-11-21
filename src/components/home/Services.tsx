import { serviceCategories } from "@/data/services";
import ServiceCard from "./services/ServiceCard";

const Services = () => {
  return (
    <section id="services-section" className="section-spacing px-4 bg-ceremonial-cream">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon animate-slide-up-fade">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;