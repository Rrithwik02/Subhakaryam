import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import FloatingSearchBar from "./FloatingSearchBar";

const Hero = () => {
  const advertisements = [
    {
      title: "Special Pooja Services",
      image: "/lovable-uploads/b7933b51-98b2-45e4-ac01-f2424ed5e781.png",
    },
    {
      title: "Wedding Photography",
      image: "/lovable-uploads/4079e9c8-f79f-4bf9-a1f7-1aeeea1f9e30.png",
    },
    {
      title: "Traditional Decorations",
      image: "/lovable-uploads/11ac3cd2-aa50-4a44-8bfd-e951d610fb7b.png",
    },
  ];

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const autoplayRef = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  useEffect(() => {
    const images = advertisements.map(ad => ad.image);
    
    Promise.all(images.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
      });
    })).then(() => setImagesLoaded(true));
  }, []);

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Background Carousel */}
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplayRef.current]}
        className="absolute inset-0 w-full h-full"
      >
        <CarouselContent className="h-full">
          {advertisements.map((ad, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Dark overlay for text visibility */}
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-6 text-white opacity-0 animate-hero-title">
            Sacred Ceremonies, Authentic Traditions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 opacity-0 animate-hero-subtitle">
            Find trusted pandits, photographers, and decorators for your special moments.
          </p>
          
          {/* Search Bar with Glass Effect */}
          <div className="opacity-0 animate-search-bar-float">
            <FloatingSearchBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;