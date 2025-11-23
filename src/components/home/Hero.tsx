import FloatingSearchBar from "./FloatingSearchBar";

const Hero = () => {

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-heritage-dark">
      {/* Dark Heritage Background with Aurora Glow */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-heritage-dark" />
        
        {/* Aurora glow at bottom center */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-aurora-glow" />
        
        {/* Subtle texture overlay for depth */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' 
          }} 
        />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-start items-center text-white px-4 pt-16 md:pt-20 pb-8 md:pb-12">
        <div className="text-center max-w-4xl w-full flex flex-col items-center">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight text-heritage-cream opacity-0 animate-hero-title"
          >
            Sacred Ceremonies, Authentic Traditions
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-body text-heritage-cream/90 mb-10 md:mb-12 leading-relaxed opacity-0 animate-hero-subtitle"
          >
            Find trusted pandits, photographers, and decorators for your special moments.
          </p>
          
          {/* Search Bar */}
          <div className="w-full opacity-0 animate-search-bar-float">
            <FloatingSearchBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
