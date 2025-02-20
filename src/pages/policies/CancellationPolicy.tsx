
import { XOctagon } from "lucide-react";

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ceremonial-cream to-white pt-24">
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <XOctagon className="h-8 w-8 text-ceremonial-maroon" />
          <h1 className="text-4xl font-display font-bold text-ceremonial-maroon">
            Cancellation Policy
          </h1>
        </div>
        <div className="prose max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Cancellation Windows</h2>
          <ul>
            <li>More than 48 hours before: Full refund</li>
            <li>24-48 hours before: 50% refund</li>
            <li>Less than 24 hours: No refund</li>
          </ul>

          <h2>How to Cancel</h2>
          <p>You can cancel your booking through:</p>
          <ul>
            <li>Your user profile dashboard</li>
            <li>Contacting customer support</li>
          </ul>

          <h2>Service Provider Cancellations</h2>
          <p>If a service provider cancels:</p>
          <ul>
            <li>You will receive a full refund</li>
            <li>We will assist in finding an alternative provider</li>
            <li>You may receive additional compensation for the inconvenience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
