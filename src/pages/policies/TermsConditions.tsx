
import { Shield } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-ceremonial-maroon" />
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Terms & Conditions
          </h1>
        </div>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Service Terms</h2>
          <ul>
            <li>Services are provided subject to availability and confirmation</li>
            <li>All ceremonies will be conducted according to traditional customs</li>
            <li>Service timings must be strictly adhered to</li>
            <li>Additional requirements must be communicated in advance</li>
          </ul>

          <h2>2. Booking and Payments</h2>
          <ul>
            <li>Advance payment is required to confirm bookings</li>
            <li>Prices are subject to change based on specific requirements</li>
            <li>GST and other applicable taxes will be charged extra</li>
            <li>Payment terms are non-negotiable</li>
          </ul>

          <h2>3. Service Provider Guidelines</h2>
          <ul>
            <li>Providers must maintain professional standards</li>
            <li>All religious items must be authentic and pure</li>
            <li>Punctuality is mandatory</li>
            <li>Proper traditional attire must be worn</li>
          </ul>

          <h2>4. User Responsibilities</h2>
          <ul>
            <li>Provide accurate ceremony details</li>
            <li>Ensure venue accessibility and readiness</li>
            <li>Follow traditional customs and practices</li>
            <li>Maintain respectful behavior during ceremonies</li>
          </ul>

          <h2>5. Dispute Resolution</h2>
          <p>Any disputes will be resolved through:</p>
          <ul>
            <li>Direct communication with customer service</li>
            <li>Mediation if required</li>
            <li>Legal proceedings as a last resort</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
