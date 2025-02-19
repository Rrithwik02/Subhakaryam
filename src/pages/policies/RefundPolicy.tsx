
import { CreditCard } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="h-8 w-8 text-ceremonial-maroon" />
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Refund Policy
          </h1>
        </div>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Refund Eligibility</h2>
          <ul>
            <li>Booking cancellations as per cancellation policy</li>
            <li>Service not provided as described</li>
            <li>Technical issues preventing service delivery</li>
            <li>Service provider unavailability</li>
          </ul>

          <h2>Refund Process</h2>
          <ul>
            <li>Refund requests must be submitted within 7 days</li>
            <li>Processing time: 5-7 business days</li>
            <li>Amount credited to original payment method</li>
            <li>Processing fees may be deducted</li>
          </ul>

          <h2>Special Circumstances</h2>
          <ul>
            <li>Force majeure events: Case-by-case evaluation</li>
            <li>Weather-related cancellations: Full refund</li>
            <li>Health emergencies: Full refund with proof</li>
          </ul>

          <h2>Non-Refundable Items</h2>
          <ul>
            <li>Convenience fees</li>
            <li>Last-minute cancellations (less than 24 hours)</li>
            <li>Partially completed services</li>
            <li>Special arrangement costs</li>
          </ul>

          <h2>Contact for Refunds</h2>
          <p>For refund requests and queries:</p>
          <ul>
            <li>Email: refunds@subhakaryam.org</li>
            <li>Phone: +91 98765 43210</li>
            <li>Response time: Within 24-48 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
