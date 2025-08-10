import { serviceCategories } from "@/data/services";
import { Link } from "react-router-dom";
import FeaturedService from "./services/FeaturedService";
import ServiceCard from "./services/ServiceCard";

const Services = () => {

  return (
    <section id="services-section" className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8 text-ceremonial-maroon animate-slide-up-fade">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/services/pooja-services">
            <FeaturedService 
              service={serviceCategories[0]}
            />
          </Link>
          
          {serviceCategories.slice(1).map((service, index) => {
            const getServiceLink = (serviceId: string) => {
              switch(serviceId) {
                case "mehendi": return "/services/mehendi-artists";
                case "photo": return "/services/wedding-photography";
                default: return `/search?service=${serviceId}`;
              }
            };
            
            return (
              <Link key={service.id} to={getServiceLink(service.id)}>
                <ServiceCard
                  service={service}
                  index={index}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;