
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
            <li>Service not provided as described</li>
            <li>Technical issues preventing service delivery</li>
            <li>Cancellations within policy guidelines</li>
          </ul>

          <h2>Refund Process</h2>
          <ul>
            <li>Refunds are processed within 5-7 business days</li>
            <li>Original payment method will be used for refund</li>
            <li>Processing fees may be deducted for certain cases</li>
          </ul>

          <h2>Non-Refundable Cases</h2>
          <ul>
            <li>Late cancellations (less than 24 hours notice)</li>
            <li>No-shows</li>
            <li>Partially completed services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
