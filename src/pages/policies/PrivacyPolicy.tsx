
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

          <h2>Information Collection</h2>
          <p>At Subhakaryam, we collect and process the following information:</p>
          <ul>
            <li>Personal identification information (Name, email address, phone number)</li>
            <li>Religious preferences and ceremony requirements</li>
            <li>Service booking details and history</li>
            <li>Payment information (processed securely through our payment provider)</li>
          </ul>

          <h2>Use of Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Facilitate ceremony bookings and services</li>
            <li>Communicate important updates about your bookings</li>
            <li>Improve our services and user experience</li>
            <li>Send relevant notifications about similar services</li>
            <li>Process payments and maintain financial records</li>
          </ul>

          <h2>Data Protection</h2>
          <p>We implement several measures to protect your data:</p>
          <ul>
            <li>Secure SSL encryption for all data transmission</li>
            <li>Regular security audits and updates</li>
            <li>Restricted access to personal information</li>
            <li>Compliance with data protection regulations</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for data processing</li>
            <li>Request a copy of your data</li>
          </ul>

          <h2>Contact Us</h2>
          <p>For any privacy-related queries, please contact us at:</p>
          <p>Email: privacy@subhakaryam.org</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
