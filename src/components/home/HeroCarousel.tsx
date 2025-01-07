import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const eventImages = [
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    alt: "Traditional Indian wedding ceremony",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
    alt: "Elegant catering setup",
  },
  {
    url: "https://images.unsplash.com/photo-1509264279362-c1b418e7e91d",
    alt: "Bridal mehendi ceremony",
  },
  {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    alt: "Professional makeup session",
  },
];

const HeroCarousel = () => {
  return (
    <div className="absolute inset-0">
      <Carousel className="w-full h-full" opts={{ loop: true, duration: 10000 }}>
        <CarouselContent>
          {eventImages.map((image, index) => (
            <CarouselItem key={index} className="w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;