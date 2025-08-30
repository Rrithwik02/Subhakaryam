import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const CateringIdeas = () => {
  return (
    <>
      <Helmet>
        <title>Top 7 Wedding Catering Ideas to Delight Your Guests in 2025 | Subhakaryam</title>
        <meta name="description" content="Discover creative wedding catering ideas for 2025. From regional food counters to fusion menus, explore trending catering concepts for unforgettable celebrations." />
        <meta name="keywords" content="wedding catering ideas, Indian wedding food, live cooking stations, fusion catering, wedding menu planning" />
        <link rel="canonical" href="https://subhakaryam.org/blog/catering-ideas" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-ceremonial-cream to-white">
        {/* Back Button */}
        <div className="container mx-auto max-w-4xl pt-8 px-4">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6 flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="container mx-auto max-w-4xl px-4 pb-16">
          <header className="mb-8">
            <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-ceremonial-cream flex items-center justify-center">
              <div className="text-ceremonial-maroon text-6xl">🍽️</div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Catering Ideas</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                6 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              Top 7 Wedding Catering Ideas to Delight Your Guests in 2025
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Chef Ramesh Kumar
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  December 28, 2024
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-ceremonial-brown leading-relaxed">
            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4">Introduction</h2>
            <p>Food is the heart of any Indian wedding. Guests may forget the flowers or the stage setup, but they will always remember the taste and hospitality of the catering. As weddings evolve, couples are seeking creative catering ideas that go beyond the traditional. Here are the latest catering trends for 2025 that can make your big day unforgettable.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Top 7 Wedding Catering Ideas for 2025</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Regional Food Counters</h3>
            <p>Celebrate India's diversity with live counters representing South Indian, North Indian, Rajasthani, and Bengali cuisines. Guests love tasting different regional delicacies.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Popular Regional Dishes:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>South Indian:</strong> Dosa, idli, sambar, coconut chutney</li>
                <li><strong>North Indian:</strong> Chole bhature, rajma chawal, parathas</li>
                <li><strong>Rajasthani:</strong> Dal baati churma, gatte ki sabzi, ker sangri</li>
                <li><strong>Bengali:</strong> Fish curry, mishti doi, rasgulla</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Live Cooking Stations</h3>
            <p>From chaat stalls to pasta and dosa counters, live stations bring freshness and entertainment. Watching chefs prepare food adds an engaging element to your event.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Trending Live Stations:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Pani puri and chaat counter</li>
                <li>Live pasta and risotto station</li>
                <li>Fresh dosa and uttapam corner</li>
                <li>Tandoor bread and kebab station</li>
                <li>Ice cream and kulfi bar</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Global Fusion Menus</h3>
            <p>Mix tradition with modernity — think butter chicken tacos, paneer sushi rolls, or masala pasta. Fusion food delights younger guests while keeping older ones intrigued.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Creative Fusion Ideas:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tandoori chicken pizza</li>
                <li>Masala mac and cheese</li>
                <li>Curry ramen bowls</li>
                <li>Samosa sliders</li>
                <li>Gulab jamun cheesecake</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">4. Health-Conscious Menus</h3>
            <p>With rising awareness, many guests prefer gluten-free, vegan, or low-oil food options. Adding a small health section ensures inclusivity.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Healthy Options:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Quinoa salads with Indian spices</li>
                <li>Grilled vegetables and paneer</li>
                <li>Millet-based dishes</li>
                <li>Sugar-free desserts</li>
                <li>Fresh fruit and smoothie bar</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">5. Beverage Innovation</h3>
            <p>Mocktail bars, traditional drink stalls (like jal jeera, badam milk), and customized coffee counters are a big hit.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Trending Beverage Ideas:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Signature mocktails named after the couple</li>
                <li>Traditional drinks: Thandai, lassi, aam panna</li>
                <li>Fresh coconut water station</li>
                <li>Specialty tea and coffee bar</li>
                <li>Infused water with fruits and herbs</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">6. Instagrammable Desserts</h3>
            <p>Interactive dessert walls, live jalebi with rabri, or nitrogen ice cream counters make for memorable photo moments.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Photo-Worthy Dessert Ideas:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Live jalebi and rabri counter</li>
                <li>Nitrogen ice cream preparation</li>
                <li>Dessert shot glasses</li>
                <li>Cotton candy station</li>
                <li>Chocolate fountain with fruits</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">7. Traditional Sweets Reimagined</h3>
            <p>Serve classics like gulab jamun, rasmalai, and ariselu with modern plating to elevate presentation.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Modern Sweet Presentations:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Deconstructed rasmalai in glass cups</li>
                <li>Mini gulab jamun on silver spoons</li>
                <li>Layered halwa in clear jars</li>
                <li>Bite-sized barfi with edible flowers</li>
                <li>Individual portions in elegant boxes</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Planning Your Wedding Menu</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">Key Considerations:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Guest Count & Preferences:</strong> Survey family preferences and dietary restrictions</li>
              <li><strong>Budget Planning:</strong> Allocate 30-40% of your wedding budget to catering</li>
              <li><strong>Seasonal Ingredients:</strong> Use fresh, seasonal produce for better taste and cost</li>
              <li><strong>Venue Logistics:</strong> Ensure your venue can accommodate live cooking stations</li>
              <li><strong>Service Style:</strong> Choose between buffet, plated service, or family-style serving</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Tips for Working with Caterers</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Schedule tastings at least 2-3 months before the wedding</li>
              <li>Discuss backup plans for outdoor events</li>
              <li>Ask about service staff-to-guest ratios</li>
              <li>Clarify what's included: plates, utensils, linens</li>
              <li>Get detailed contracts with menu specifications</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Cost-Saving Catering Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choose seasonal vegetables and fruits</li>
              <li>Limit the number of live stations</li>
              <li>Opt for family-style serving over individual plating</li>
              <li>Include more vegetarian options (generally less expensive)</li>
              <li>Consider weekday or off-season bookings for better rates</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Conclusion</h2>
            <p>Your catering should reflect your love story and culture. The right food creates lasting memories and brings people together in celebration. From regional specialties to innovative fusion dishes, the key is balancing tradition with creativity while keeping your guests' preferences in mind.</p>
            
            <div className="bg-ceremonial-gold/10 p-6 rounded-lg mt-6 border-l-4 border-ceremonial-gold">
              <p className="font-semibold text-ceremonial-maroon mb-2">Ready to plan your dream wedding menu?</p>
              <p>With Subhakaryam, you can connect with professional wedding caterers who bring both creativity and authenticity to the table. Book trusted catering services today and make your wedding feast unforgettable.</p>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default CateringIdeas;