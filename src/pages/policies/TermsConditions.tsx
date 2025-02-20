
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
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using our service, you agree to these terms and conditions.</p>
          
          <h2>2. User Responsibilities</h2>
          <ul>
            <li>Provide accurate information</li>
            <li>Maintain confidentiality of your account</li>
            <li>Comply with booking and cancellation policies</li>
            <li>Treat service providers with respect</li>
          </ul>

          <h2>3. Service Provider Responsibilities</h2>
          <ul>
            <li>Provide services as described</li>
            <li>Maintain professional standards</li>
            <li>Honor bookings and pricing</li>
            <li>Communicate changes promptly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
