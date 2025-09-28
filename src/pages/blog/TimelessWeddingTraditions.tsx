import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const TimelessWeddingTraditions = () => {
  return (
    <>
      <Helmet>
        <title>Timeless Indian Wedding Traditions You Should Know | Subhakary</title>
        <meta name="description" content="Discover timeless Indian wedding traditions and rituals. From pre-wedding ceremonies to post-wedding customs, explore their meanings and significance." />
        <meta name="keywords" content="Indian wedding traditions, Hindu marriage customs, wedding rituals, pre-wedding ceremonies, post-wedding traditions" />
        <link rel="canonical" href="https://subhakary.com/blog/timeless-wedding-traditions" />
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
            <div className="aspect-video mb-6 rounded-xl overflow-hidden">
              <img 
                src="/lovable-uploads/11ac3cd2-aa50-4a44-8bfd-e951d610fb7b.png" 
                alt="Timeless Indian Wedding Traditions"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Wedding Traditions</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                8 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              Timeless Indian Wedding Traditions You Should Know
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Priya Sharma
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  December 15, 2024
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
            <p>Indian weddings are not just ceremonies; they are grand celebrations of culture, family, and spirituality. Known for their vibrancy, emotional depth, and elaborate rituals, Indian weddings beautifully blend tradition with joy. Whether you're attending your first Indian wedding or planning your own, understanding these timeless traditions can help you appreciate the cultural richness behind each ritual.</p>

            <p>In this article, we'll explore the most important Indian wedding traditions—from pre-wedding customs to post-wedding celebrations—along with their cultural meanings and modern adaptations.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Pre-Wedding Traditions</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Roka & Engagement Ceremony</h3>
            <p>The Roka marks the official start of wedding celebrations. It's a simple yet significant ritual where both families exchange gifts, sweets, and blessings. The engagement follows, where the bride and groom exchange rings.</p>
            <p><strong>💡 Modern Twist:</strong> Many couples now host engagement parties with themes, music, and fusion cuisines while still honoring traditional blessings.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Haldi Ceremony</h3>
            <p>Held a day or two before the wedding, the Haldi ceremony involves applying a paste of turmeric, sandalwood, and rosewater on the bride and groom's face and body. It symbolizes purification, prosperity, and a natural glow.</p>
            <p><strong>💡 SEO Tip:</strong> If you're searching for "haldi decoration ideas," you'll notice marigold flowers and yellow drapes trending in 2024.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Mehendi Ceremony</h3>
            <p>The bride's hands and feet are decorated with intricate henna designs. Mehendi is not just about beauty—it represents joy, prosperity, and love. Families celebrate with music, dance, and colorful outfits.</p>
            <p><strong>💡 Fun Fact:</strong> Darker mehendi color is traditionally believed to signify deeper love and affection between the couple.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">4. Sangeet Night</h3>
            <p>Once a small family affair, the Sangeet has become one of the most fun-filled wedding events. Both families come together to sing, dance, and celebrate love. It strengthens family bonds and sets the tone for the big day.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Wedding Day Rituals</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">5. Baraat (Groom's Procession)</h3>
            <p>The groom arrives at the wedding venue with a lively procession called the Baraat. Accompanied by music, dance, and dhol beats, it symbolizes the groom's journey to unite with his bride.</p>
            <p><strong>💡 Modern Update:</strong> Many grooms now arrive on vintage cars, decorated horses, or even bikes instead of the traditional ghodi (horse).</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">6. Jaimala (Exchange of Garlands)</h3>
            <p>The bride and groom exchange floral garlands, symbolizing acceptance of each other as partners. This light-hearted ritual often sparks playful moments, as friends lift the groom to make it challenging for the bride to place the garland.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">7. Kanyadaan (Giving Away the Bride)</h3>
            <p>One of the most emotional rituals, Kanyadaan is performed by the bride's parents, symbolizing their trust in the groom to take care of their daughter. It represents the union of two families.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">8. Mangal Pheras (Sacred Vows Around the Fire)</h3>
            <p>The couple walks around the sacred fire (Agni) seven times, each round signifying a vow—such as love, respect, fidelity, and prosperity. The pheras are the most important ritual, making the marriage official in Hindu tradition.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">9. Sindoor & Mangalsutra</h3>
            <p>The groom applies sindoor (vermillion) to the bride's hair parting and ties the mangalsutra (sacred necklace) around her neck. These mark the bride's new marital status.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Post-Wedding Traditions</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">10. Vidaai (Farewell Ceremony)</h3>
            <p>An emotional moment where the bride bids farewell to her family and leaves for her new home. Traditionally, she throws back handfuls of rice to signify prosperity and gratitude.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">11. Griha Pravesh (Welcoming the Bride)</h3>
            <p>At the groom's house, the bride is welcomed with an aarti and asked to gently kick a pot of rice at the entrance—symbolizing abundance and good fortune entering the new home.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">12. Reception Party</h3>
            <p>The reception is the couple's first public appearance as husband and wife. Families and friends gather to bless the couple, often with music, dance, and a grand feast.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Modern Trends in Indian Wedding Traditions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Eco-Friendly Weddings:</strong> Couples are opting for sustainable décor, plant-based gifts, and waste-free ceremonies.</li>
              <li><strong>Destination Weddings:</strong> From Jaipur palaces to beach weddings in Goa, destination weddings are on the rise.</li>
              <li><strong>Fusion Rituals:</strong> Interfaith and intercultural weddings often merge traditions, creating unique and inclusive celebrations.</li>
              <li><strong>Technology in Weddings:</strong> Live-streamed weddings, wedding hashtags, and drone photography are becoming common.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">FAQs about Indian Wedding Traditions</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">1. How long does an Indian wedding last?</h4>
                <p>Typically 3–5 days, including pre-wedding and post-wedding events.</p>
              </div>
              <div>
                <h4 className="font-semibold">2. What is the most important ritual in a Hindu wedding?</h4>
                <p>The Mangal Pheras (seven sacred rounds) is considered the most significant.</p>
              </div>
              <div>
                <h4 className="font-semibold">3. Can Indian weddings be customized?</h4>
                <p>Yes! Many couples adapt rituals to suit personal, cultural, or interfaith needs.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Conclusion</h2>
            <p>Indian wedding traditions are a beautiful blend of culture, family values, and spirituality. From the joyous Haldi to the emotional Vidaai, each ritual carries deep meaning that has been cherished for centuries.</p>
            <p>Whether you're a bride, groom, or guest, understanding these traditions allows you to fully appreciate the magic of an Indian wedding.</p>
          </div>
        </article>
      </div>
    </>
  );
};

export default TimelessWeddingTraditions;