import { Package, Flower2, Flame } from "lucide-react";

const essentialItems = [
  {
    icon: Flower2,
    title: "Fresh Flowers",
    description: "Traditional flowers for all ceremonies",
  },
  {
    icon: Flame,
    title: "Agarbathi & Dhoop",
    description: "Premium quality incense and dhoop",
  },
  {
    icon: Package,
    title: "Pooja Items",
    description: "Complete pooja essentials kit",
  },
];

const EssentialsPreview = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-ceremonial-maroon mb-4">
            Essential Items Delivery
          </h2>
          <p className="text-lg text-gray-600">
            Coming Soon: Get all your ceremonial essentials delivered right to your doorstep
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {essentialItems.map((item, index) => (
            <div
              key={index}
              className="relative group p-6 bg-ceremonial-cream rounded-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 right-0 bg-ceremonial-gold/10 px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold text-ceremonial-gold">
                Coming Soon
              </div>
              <div className="flex flex-col items-center text-center">
                <item.icon className="w-12 h-12 text-ceremonial-gold mb-4" />
                <h3 className="text-xl font-semibold text-ceremonial-maroon mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EssentialsPreview;