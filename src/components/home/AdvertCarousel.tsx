import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const advertisements = [
  {
    title: "Special Pooja Services",
    description: "Book our premium pooja services for all your ceremonies",
    image: "/lovable-uploads/b7933b51-98b2-45e4-ac01-f2424ed5e781.png",
    tag: "Featured Service",
  },
  {
    title: "Wedding Photography",
    description: "Capture your special moments with our expert photographers",
    image: "/lovable-uploads/4079e9c8-f79f-4bf9-a1f7-1aeeea1f9e30.png",
    tag: "Premium Provider",
  },
  {
    title: "Traditional Decorations",
    description: "Transform your venue with authentic traditional decorations",
    image: "/lovable-uploads/11ac3cd2-aa50-4a44-8bfd-e951d610fb7b.png",
    tag: "Top Rated",
  },
];

const AdvertCarousel = () => {
  return (
    <section className="py-12 bg-ceremonial-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-ceremonial-maroon mb-8 text-center">
          Featured Services
        </h2>
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {advertisements.map((ad, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative group overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                    <div className="absolute top-4 right-4 bg-ceremonial-gold px-3 py-1 rounded-full text-xs font-semibold text-white">
                      {ad.tag}
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
                      <p className="text-sm opacity-90">{ad.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default AdvertCarousel;