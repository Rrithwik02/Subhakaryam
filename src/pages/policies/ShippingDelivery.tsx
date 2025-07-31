import { Truck } from "lucide-react";

const ShippingDelivery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Truck className="h-8 w-8 text-ceremonial-maroon" />
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Shipping & Delivery
          </h1>
        </div>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Service Delivery Model</h2>
          <p>Subhakaryam operates as a service marketplace connecting customers with local service providers. Our delivery model is designed for in-person services.</p>

          <h2>Service Locations</h2>
          <ul>
            <li>Services are provided at customer-specified locations</li>
            <li>Service providers travel to your venue or preferred location</li>
            <li>Coverage areas are defined by individual service providers</li>
          </ul>

          <h2>Scheduling & Timing</h2>
          <ul>
            <li>Services are scheduled based on availability of providers</li>
            <li>Minimum 24-48 hours advance booking recommended</li>
            <li>Emergency services may be available with additional charges</li>
            <li>Service duration varies by type and requirements</li>
          </ul>

          <h2>Physical Products</h2>
          <p>For services that include physical items (decorations, materials, etc.):</p>
          <ul>
            <li>Items are brought by service providers to your location</li>
            <li>Setup and removal included in service package</li>
            <li>Any damaged or missing items will be addressed directly with the provider</li>
          </ul>

          <h2>Coverage Areas</h2>
          <ul>
            <li>Service availability varies by location</li>
            <li>Each provider defines their service radius</li>
            <li>Additional travel charges may apply for distant locations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;