import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const DecorationTrends = () => {
  return (
    <>
      <Helmet>
        <title>10 Stunning Wedding Decoration Trends for 2025 Every Couple Must See | Subhakaryam</title>
        <meta name="description" content="Discover the latest wedding decoration trends for 2025. From sustainable décor to minimalist elegance, explore stunning ideas for your dream wedding." />
        <meta name="keywords" content="wedding decoration trends 2025, mandap decoration, wedding décor ideas, floral arrangements, sustainable wedding décor" />
        <link rel="canonical" href="https://subhakaryam.org/blog/decoration-trends" />
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
              <div className="text-ceremonial-maroon text-6xl">🌸</div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Decoration Trends</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                7 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              10 Stunning Wedding Decoration Trends for 2025 Every Couple Must See
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Priya Decorators
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  December 30, 2024
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
            <p>Wedding décor sets the mood for the entire celebration. From dreamy mandaps to elegant table settings, the right decoration creates magical memories. If you are planning your wedding in 2025, here are the decoration trends you should not miss.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">10 Must-See Wedding Decoration Trends for 2025</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Sustainable Décor</h3>
            <p>Eco-friendly weddings are in demand — think reusable props, bamboo seating, and minimal plastic. Couples are choosing sustainable materials that can be repurposed or biodegradable options that don't harm the environment.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Sustainable Options:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Potted plants instead of cut flowers</li>
                <li>Recyclable paper decorations</li>
                <li>Wooden and bamboo furniture</li>
                <li>LED lights for energy efficiency</li>
                <li>Natural fabric draping</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Floral Overload</h3>
            <p>Seasonal flowers, especially marigolds, roses, and orchids, continue to dominate. Hanging floral chandeliers are trending for creating dramatic ceiling installations.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Popular Floral Arrangements:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Cascading floral walls</li>
                <li>Hanging garden installations</li>
                <li>Fresh flower carpets for aisles</li>
                <li>Mixed seasonal blooms for color variety</li>
                <li>Floating flower arrangements in water</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Rustic Themes</h3>
            <p>Wooden elements, earthy tones, and fairy lights create a natural yet stylish look. This trend works especially well for outdoor and destination weddings.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Rustic Elements:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Wooden mandap structures</li>
                <li>Burlap and lace table runners</li>
                <li>Mason jar centerpieces</li>
                <li>Tree branch archways</li>
                <li>Vintage furniture pieces</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">4. Personalized Signages</h3>
            <p>Custom neon signs with couple names or wedding hashtags are an Instagram favorite. These personalized touches make the celebration unique and memorable.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Signage Ideas:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>LED name boards at entrance</li>
                <li>Custom hashtag displays</li>
                <li>Love quote installations</li>
                <li>Directional signs for different venues</li>
                <li>Photo booth backdrops with names</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">5. Minimalist Elegance</h3>
            <p>Pastel drapes, white flowers, and subtle lighting offer a classy, modern aesthetic. This trend focuses on clean lines and sophisticated simplicity.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Minimalist Features:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Neutral color palettes</li>
                <li>Clean geometric shapes</li>
                <li>Simple floral arrangements</li>
                <li>Subtle metallic accents</li>
                <li>Uncluttered table settings</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">6. Traditional Grandeur</h3>
            <p>For those who prefer royal vibes — large brass lamps, temple bells, and rich fabrics never go out of style. This classic approach celebrates India's cultural heritage.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Traditional Elements:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Heavy silk draping in rich colors</li>
                <li>Brass urns and vessels</li>
                <li>Temple-style mandap designs</li>
                <li>Traditional oil lamps (diyas)</li>
                <li>Antique furniture and artifacts</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">7. Stage Backdrops</h3>
            <p>Unique mandap and stage backdrops with fabric layering, 3D panels, or LED screens make ceremonies stand out. These create stunning focal points for photography.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Backdrop Ideas:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Multi-layered fabric installations</li>
                <li>3D floral walls</li>
                <li>LED panel displays</li>
                <li>Mirror and crystal arrangements</li>
                <li>Themed scenic backdrops</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">8. Ceiling Décor</h3>
            <p>From flower garlands to fairy lights, ceiling installations create a wow factor. Overhead decorations transform the entire atmosphere of the venue.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Ceiling Decoration Options:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Draped fabric canopies</li>
                <li>Suspended floral arrangements</li>
                <li>String light installations</li>
                <li>Paper lantern displays</li>
                <li>Crystal chandelier rentals</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">9. Mix of Cultures</h3>
            <p>Blend South Indian temple-inspired décor with North Indian floral mandaps for a cultural fusion look. This trend celebrates India's diverse traditions.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Cultural Fusion Elements:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mixed regional flower arrangements</li>
                <li>Fusion mandap architectural styles</li>
                <li>Combined color schemes</li>
                <li>Diverse traditional artifacts</li>
                <li>Multi-cultural food presentation</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">10. Interactive Elements</h3>
            <p>Photo booths, wishing trees, and message walls keep guests engaged and entertained while adding personal touches to the décor.</p>
            
            <div className="bg-ceremonial-cream p-4 rounded-lg my-4">
              <h4 className="font-semibold text-ceremonial-maroon mb-2">Interactive Features:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Themed photo booth corners</li>
                <li>Guest message walls</li>
                <li>Wish tree installations</li>
                <li>Live art stations</li>
                <li>Memory lane photo displays</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Budget-Friendly Decoration Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>DIY Elements:</strong> Create your own centerpieces and small decorative items</li>
              <li><strong>Repurpose Decorations:</strong> Use ceremony décor for reception with minor adjustments</li>
              <li><strong>Seasonal Flowers:</strong> Choose flowers that are in season for better pricing</li>
              <li><strong>Rental Options:</strong> Rent expensive items like furniture and large installations</li>
              <li><strong>Focus on Key Areas:</strong> Invest more in highly visible areas like mandap and entrance</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Working with Decorators</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Share your vision through mood boards and inspiration photos</li>
              <li>Set a clear budget and stick to priority items</li>
              <li>Schedule site visits with your decorator before the event</li>
              <li>Ask for detailed timelines and setup schedules</li>
              <li>Get contracts that specify all materials and services included</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Conclusion</h2>
            <p>The right decoration is more than just beauty — it's about creating an experience that reflects your personality and love story. Whether you choose sustainable elements, traditional grandeur, or modern minimalism, the key is creating a cohesive look that makes your wedding day truly special.</p>
            
            <div className="bg-ceremonial-gold/10 p-6 rounded-lg mt-6 border-l-4 border-ceremonial-gold">
              <p className="font-semibold text-ceremonial-maroon mb-2">Ready to design your dream wedding décor?</p>
              <p>With Subhakaryam, you can explore expert decorators who bring your dream wedding setup to life. Browse trusted decoration services now and design the perfect backdrop for your big day.</p>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default DecorationTrends;