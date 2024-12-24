import { Card } from "@/components/ui/card";
import { Users2, Heart, History } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center text-ceremonial-maroon mb-8">
          About Subhakaryam
        </h1>
        
        <div className="max-w-3xl mx-auto text-lg text-gray-700 mb-12 text-center">
          <p className="mb-4">
            Subhakaryam is your trusted partner in celebrating life's most sacred moments. 
            We bridge the gap between traditional ceremonial service providers and modern families 
            seeking authentic spiritual experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center">
            <Users2 className="w-12 h-12 mx-auto mb-4 text-ceremonial-gold" />
            <h3 className="text-xl font-display font-semibold mb-3 text-ceremonial-maroon">Our Community</h3>
            <p className="text-gray-600">
              We've built a thriving community of verified service providers and satisfied families.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-ceremonial-gold" />
            <h3 className="text-xl font-display font-semibold mb-3 text-ceremonial-maroon">Our Values</h3>
            <p className="text-gray-600">
              We're committed to preserving and promoting sacred traditions while ensuring convenience and trust.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <History className="w-12 h-12 mx-auto mb-4 text-ceremonial-gold" />
            <h3 className="text-xl font-display font-semibold mb-3 text-ceremonial-maroon">Our Journey</h3>
            <p className="text-gray-600">
              Started with a vision to make sacred ceremonies accessible, we continue to grow and serve.
            </p>
          </Card>
        </div>

        <div className="bg-ceremonial-gold/10 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-display font-bold text-ceremonial-maroon mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            To preserve and promote sacred traditions while making them accessible to everyone through 
            a trusted platform that connects families with qualified service providers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;