import { Search, Calendar, CheckCircle, Users, Clock, Shield } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-white" />,
      title: "Browse & Choose",
      description: "Explore our verified service providers and select the perfect match for your ceremony",
      details: ["Compare ratings & reviews", "View portfolios", "Check availability"]
    },
    {
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Book & Schedule", 
      description: "Select your preferred date, time, and package details for your special occasion",
      details: ["Flexible scheduling", "Instant confirmation", "Secure payments"]
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Relax & Celebrate",
      description: "Our experienced professionals handle everything while you enjoy your sacred moment",
      details: ["Professional service", "On-time delivery", "Quality guarantee"]
    }
  ];

  const features = [
    {
      icon: <Users className="h-6 w-6 text-ceremonial-gold" />,
      text: "Verified Professionals"
    },
    {
      icon: <Clock className="h-6 w-6 text-ceremonial-gold" />,
      text: "On-Time Service"
    },
    {
      icon: <Shield className="h-6 w-6 text-ceremonial-gold" />,
      text: "Quality Assured"
    }
  ];

  return (
    <section className="py-16 px-4 bg-ceremonial-cream">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4 animate-slide-up-fade">
            How It Works
          </h2>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            Book authentic traditional services in just three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center animate-slide-up-fade" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-ceremonial-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-float shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-ceremonial-maroon text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-display font-semibold mb-3 text-ceremonial-maroon">
                {step.title}
              </h3>
              <p className="text-ceremonial-brown mb-4 leading-relaxed">
                {step.description}
              </p>
              
              <div className="space-y-2">
                {step.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center justify-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-ceremonial-gold mr-2" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-ceremonial-maroon mb-6 text-center">
            Why Choose Our Platform?
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
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

export default HowItWorks;