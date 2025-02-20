
import { File } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <File className="h-8 w-8 text-ceremonial-maroon" />
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Privacy Policy
          </h1>
        </div>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Service booking details</li>
            <li>Payment information</li>
            <li>Communications with service providers</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your bookings</li>
            <li>Facilitate communication between users and service providers</li>
            <li>Improve our services</li>
            <li>Send important updates about your bookings</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We share your information only with:</p>
          <ul>
            <li>Service providers you book with</li>
            <li>Payment processors to complete transactions</li>
            <li>When required by law</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
