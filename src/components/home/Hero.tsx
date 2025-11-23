import FloatingSearchBar from "./FloatingSearchBar";

const Hero = () => {

  return (
    <div className="relative w-full h-[90vh] overflow-hidden bg-glass-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-glass-gradient" />
        
        {/* Radial glow at center-bottom */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-glass-radial opacity-40" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-glass-noise opacity-30" />
        
        {/* Animated shimmer overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsla(43, 96%, 56%, 0.1) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'glass-shimmer 8s linear infinite',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-6 text-glass-white-high opacity-0 animate-hero-title">
            Sacred Ceremonies, Authentic Traditions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-glass-white-low mb-12 opacity-0 animate-hero-subtitle">
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