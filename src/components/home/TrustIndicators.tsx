import { Shield, Users, Star, Award, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TrustIndicators = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-ceremonial-gold" />,
      number: "10,000+",
      label: "Happy Customers",
      subtext: "Ceremonies completed successfully"
    },
    {
      icon: <Star className="h-8 w-8 text-ceremonial-gold" />,
      number: "4.8/5",
      label: "Average Rating",
      subtext: "Based on customer reviews"
    },
    {
      icon: <Shield className="h-8 w-8 text-ceremonial-gold" />,
      number: "100%",
      label: "Verified Providers",
      subtext: "Background checked professionals"
    },
    {
      icon: <Award className="h-8 w-8 text-ceremonial-gold" />,
      number: "5+ Years",
      label: "Experience",
      subtext: "Serving traditional ceremonies"
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="h-5 w-5 text-ceremonial-gold" />,
      text: "Authentic Traditional Services"
    },
    {
      icon: <Shield className="h-5 w-5 text-ceremonial-gold" />,
      text: "Verified & Trusted Providers"
    },
    {
      icon: <Clock className="h-5 w-5 text-ceremonial-gold" />,
      text: "On-Time Service Guarantee"
    },
    {
      icon: <Award className="h-5 w-5 text-ceremonial-gold" />,
      text: "Experienced Professionals"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            Join our community of satisfied customers who trust us for their sacred ceremonies
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-ceremonial-maroon mb-1">
                {stat.number}
              </div>
              <div className="font-semibold text-ceremonial-brown mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">
                {stat.subtext}
              </div>
            </Card>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-ceremonial-cream rounded-xl p-8">
          <h3 className="text-xl font-semibold text-ceremonial-maroon mb-6 text-center">
            Why Choose Subhakaryam?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                {feature.icon}
                <span className="text-ceremonial-brown font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;