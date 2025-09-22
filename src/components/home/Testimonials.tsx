import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rama Krishna",
      service: "Pooja Services",
      rating: 5,
      text: "The poojari services were excellent. Very professional and knowledgeable about all the rituals. They made our ceremony so meaningful and authentic.",
      location: "Hyderabad"
    },
    {
      name: "Priya Sharma",
      service: "Mehendi Artists",
      rating: 5,
      text: "Amazing mehendi artists! They made my wedding day even more special with their beautiful designs. The intricate patterns were absolutely stunning.",
      location: "Vijayawada"
    },
    {
      name: "Arjun Reddy",
      service: "Decoration",
      rating: 5,
      text: "The decoration team did a fantastic job. Everything was exactly as we had envisioned. They transformed our venue into a magical space.",
      location: "Visakhapatnam"
    },
    {
      name: "Lakshmi Devi",
      service: "Catering",
      rating: 5,
      text: "Exceptional catering service! The food was delicious and authentic. All our guests were impressed with the variety and taste.",
      location: "Hyderabad"
    },
    {
      name: "Ravi Kumar",
      service: "Photography",
      rating: 5,
      text: "Professional photographers who captured every precious moment perfectly. We'll treasure these memories forever.",
      location: "Vijayawada"
    },
    {
      name: "Sita Mahalakshmi",
      service: "Music Services",
      rating: 5,
      text: "The musicians added such a beautiful touch to our ceremony. Their knowledge of traditional songs was impressive.",
      location: "Visakhapatnam"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4 animate-slide-up-fade">
            What Our Clients Say
          </h2>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            Real experiences from families who trusted us with their sacred ceremonies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-gradient-to-br from-ceremonial-cream to-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up-fade relative" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex justify-between items-start mb-4">
                <Quote className="h-8 w-8 text-ceremonial-gold/30" />
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-ceremonial-gold fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-ceremonial-maroon">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-ceremonial-brown">
                      {testimonial.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;