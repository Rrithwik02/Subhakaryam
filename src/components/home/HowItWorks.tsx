const HowItWorks = () => {
  return (
    <section className="py-16 px-4 bg-ceremonial-cream">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-ceremonial-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
              Choose Your Services
            </h3>
            <p className="text-gray-600">
              Browse through our wide range of traditional services and select what you need
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-ceremonial-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
              Book Your Date
            </h3>
            <p className="text-gray-600">
              Select your preferred date and time for the ceremony
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-ceremonial-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-display font-semibold mb-2 text-ceremonial-maroon">
              Enjoy Your Ceremony
            </h3>
            <p className="text-gray-600">
              Relax and let our experienced professionals handle everything
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;