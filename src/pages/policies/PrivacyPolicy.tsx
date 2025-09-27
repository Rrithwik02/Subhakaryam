
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
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">1. Information We Collect</h2>
            <p className="text-lg mb-4 leading-relaxed">We collect information that you provide directly to us, including:</p>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li>• Name, email address, and phone number</li>
              <li>• Service booking details and preferences</li>
              <li>• Payment information (processed securely by Razorpay)</li>
              <li>• Communications with service providers</li>
              <li>• Profile information and service provider details</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">2. How We Use Your Information</h2>
            <p className="text-lg mb-4 leading-relaxed">We use the information we collect to:</p>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li>• Process and manage your service bookings</li>
              <li>• Facilitate secure payments through Razorpay</li>
              <li>• Enable communication between users and service providers</li>
              <li>• Send booking confirmations and important updates</li>
              <li>• Improve our platform and services</li>
              <li>• Provide customer support</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">3. Information Sharing</h2>
            <p className="text-lg mb-4 leading-relaxed">We share your information only with:</p>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li>• Service providers you book with (name, contact details, booking requirements)</li>
              <li>• Razorpay payment processor to complete secure transactions</li>
              <li>• Legal authorities when required by law</li>
              <li>• With your explicit consent for other purposes</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">4. Data Security</h2>
            <p className="text-lg mb-4 leading-relaxed">We implement appropriate security measures to protect your personal information. Payment data is handled securely by Razorpay and we do not store payment card details on our servers.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">5. Your Rights</h2>
            <p className="text-lg mb-4 leading-relaxed">You have the right to access, update, or delete your personal information. Contact us at admin@subhakary.com to exercise these rights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
