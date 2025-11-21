import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import FloatingSearchBar from "./FloatingSearchBar";

const eventImages = [
  {
    url: "/lovable-uploads/b7933b51-98b2-45e4-ac01-f2424ed5e781.png",
    alt: "Traditional Indian Wedding Ceremony Offerings",
  },
  {
    url: "/lovable-uploads/4079e9c8-f79f-4bf9-a1f7-1aeeea1f9e30.png",
    alt: "Professional Wedding Photography Service",
  },
  {
    url: "/lovable-uploads/11ac3cd2-aa50-4a44-8bfd-e951d610fb7b.png",
    alt: "Traditional Hindu Baby Ceremony",
  },
  {
    url: "/lovable-uploads/8b5f264e-7ce3-4d42-b1bf-46a28d9b54ca.png",
    alt: "Traditional Mehndi Ceremony",
  }
];

const Hero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { t } = useTranslation();
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-white p-4">
        <div className="text-center max-w-4xl animate-slide-up-fade">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-2xl">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto font-body text-white/95 drop-shadow-xl" aria-describedby="hero-description">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Background Carousel */}
      <div className="absolute inset-0">
        {!imagesLoaded && (
          <div className="absolute inset-0 z-0">
            <Skeleton className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
          </div>
        )}
        <Carousel 
          className="w-full h-full" 
          plugins={[autoplayRef.current]}
          opts={{
            loop: true,
            align: "start",
          }}
          onMouseEnter={() => autoplayRef.current.stop()}
          onMouseLeave={() => autoplayRef.current.play()}
        >
          <CarouselContent>
            {eventImages.map((image, index) => (
              <CarouselItem key={index} className="w-full h-full">
                <div className="relative w-full h-full group">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={() => index === 0 && setImagesLoaded(true)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Floating Search Bar */}
      <FloatingSearchBar />
    </div>
  );
};

export default Hero;
