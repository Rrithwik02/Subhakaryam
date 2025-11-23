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
      <div className="absolute inset-0 z-10 flex flex-col justify-start items-center text-white px-4 pt-16 md:pt-20 pb-8 md:pb-12">
        <div className="text-center max-w-4xl w-full flex flex-col items-center">
          <h1 
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 sm:mb-6 leading-tight text-white opacity-0 animate-hero-title"
            style={{ 
              textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9)' 
            }}
          >
            {t('hero.title')}
          </h1>
          <div className="inline-block opacity-0 animate-hero-subtitle mb-8 md:mb-10">
            <p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto font-body text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20" 
              aria-describedby="hero-description"
              style={{ 
                textShadow: '0 2px 10px rgba(0,0,0,0.7)' 
              }}
            >
              {t('hero.subtitle')}
            </p>
          </div>
          
          {/* Search Bar - now inside content container */}
          <div className="w-full opacity-0 animate-search-bar-float">
            <FloatingSearchBar />
          </div>
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
                  {/* Multi-layer Gradient Overlay for Better Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ceremonial-maroon/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

    </div>
  );
};

export default Hero;
