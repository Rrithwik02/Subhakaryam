import { Card } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 bg-gradient-to-br from-ceremonial-cream to-white">
            <p className="text-gray-600 mb-4">
              "The poojari services were excellent. Very professional and knowledgeable about all the rituals."
            </p>
            <p className="font-semibold text-ceremonial-maroon">- Rama Krishna</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-ceremonial-cream to-white">
            <p className="text-gray-600 mb-4">
              "Amazing mehendi artists! They made my wedding day even more special with their beautiful designs."
            </p>
            <p className="font-semibold text-ceremonial-maroon">- Priya Sharma</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-ceremonial-cream to-white">
            <p className="text-gray-600 mb-4">
              "The decoration team did a fantastic job. Everything was exactly as we had envisioned."
            </p>
            <p className="font-semibold text-ceremonial-maroon">- Arjun Reddy</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;