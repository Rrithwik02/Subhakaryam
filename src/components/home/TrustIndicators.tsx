import { Shield, Users, Star, Lock } from 'lucide-react';

const TrustIndicators = () => {
  const stats = [
    {
      icon: Shield,
      number: "100%",
      label: "Verified"
    },
    {
      icon: Users,
      number: "5000+",
      label: "Bookings"
    },
    {
      icon: Star,
      number: "4.8★",
      label: "Rating"
    },
    {
      icon: Lock,
      number: "Secure",
      label: "Payments"
    }
  ];

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:justify-center">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 snap-start flex-shrink-0 min-w-[140px]"
              >
                <IconComponent className="w-8 h-8 text-ceremonial-gold flex-shrink-0" />
                <div>
                  <div className="text-2xl font-bold text-ceremonial-maroon">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-700">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;