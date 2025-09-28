
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
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">1. Acceptance of Terms</h2>
            <p className="text-lg mb-4 leading-relaxed">By accessing and using our service, you agree to these terms and conditions.</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">2. User Responsibilities</h2>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li>• Provide accurate information</li>
              <li>• Maintain confidentiality of your account</li>
              <li>• Comply with booking and cancellation policies</li>
              <li>• Treat service providers with respect</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">3. Service Provider Responsibilities</h2>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li>• Provide services as described</li>
              <li>• Maintain professional standards</li>
              <li>• Honor bookings and pricing</li>
              <li>• Communicate changes promptly</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">4. Bookings and Payments</h2>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li>• All payments are processed securely through Razorpay</li>
              <li>• Booking confirmations are sent via email</li>
              <li>• Payment is required to confirm your booking</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">5. Cancellation and Refunds</h2>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li>• Cancellations more than 48 hours before service: Full refund</li>
              <li>• Cancellations 24-48 hours before service: 50% refund</li>
              <li>• Cancellations less than 24 hours before service: No refund</li>
              <li>• Service provider cancellations: Full refund and assistance finding alternatives</li>
              <li>• Refunds are processed within 5-7 business days to the original payment method</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-4 mt-8">6. Limitation of Liability</h2>
            <p className="text-lg mb-4 leading-relaxed">Subhakary acts as a platform connecting users with service providers. We are not responsible for the quality of services provided by third-party vendors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
