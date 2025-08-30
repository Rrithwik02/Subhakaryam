import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const FestivalCelebrations = () => {
  return (
    <>
      <Helmet>
        <title>How to Celebrate Indian Festivals in Style: Traditions & Modern Trends | Subhakaryam</title>
        <meta name="description" content="Explore Indian festival celebrations with rituals, traditions, and modern trends. From Diwali to Holi, learn how to celebrate festivals with joy and style." />
        <meta name="keywords" content="Indian festivals, Diwali celebrations, Holi traditions, Navratri, festival rituals, Indian culture" />
        <link rel="canonical" href="https://subhakaryam.org/blog/festival-celebrations" />
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
              <div className="text-ceremonial-maroon text-6xl">🎉</div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Festival Celebrations</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                7 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              How to Celebrate Indian Festivals in Style: Traditions & Modern Trends
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Ravi Kumar
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  December 18, 2024
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
            <p>India is known as the land of festivals, where every season brings new celebrations filled with color, music, food, and traditions. Festivals are not just occasions for fun—they carry deep spiritual and cultural meanings. From Diwali, Holi, and Navratri to regional harvest festivals like Pongal and Baisakhi, these occasions unite families, neighbors, and communities.</p>

            <p>In this blog, we'll explore the major Indian festivals, their traditions, and how people are celebrating them in modern times—blending age-old customs with stylish new trends.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Major Indian Festivals and Their Traditions</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Diwali – Festival of Lights</h3>
            <p>Diwali, one of India's most popular festivals, celebrates the victory of light over darkness and good over evil. Families decorate their homes with diyas (oil lamps), candles, and rangolis, perform Lakshmi Puja, and burst fireworks.</p>
            <p><strong>💡 Modern Trends:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Eco-friendly fireworks or laser shows.</li>
              <li>Designer rangolis with flower petals and LEDs.</li>
              <li>Gifting plants instead of sweets.</li>
            </ul>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Holi – Festival of Colors</h3>
            <p>Known for its joy and playfulness, Holi is celebrated with colored powders, water balloons, and music. It signifies the arrival of spring and the triumph of love and positivity.</p>
            <p><strong>💡 Trendy Celebrations:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Organic colors to protect skin and nature.</li>
              <li>Holi pool parties in urban areas.</li>
              <li>Fusion food like "thandai cheesecakes" and colorful mocktails.</li>
            </ul>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Navratri & Durga Puja</h3>
            <p>Navratri is a nine-day festival honoring Goddess Durga. Families perform daily pujas, fast, and participate in Garba and Dandiya dances. In Bengal, Durga Puja is celebrated with grand pandals, cultural shows, and feasts.</p>
            <p><strong>💡 Modern Twist:</strong> Live-streamed pujas for NRIs, fusion Garba outfits, and eco-friendly clay idols.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">4. Ganesh Chaturthi</h3>
            <p>Dedicated to Lord Ganesha, this festival is marked by bringing home beautifully crafted idols, performing aarti, and immersing the idol in water after several days.</p>
            <p><strong>💡 Modern Trends:</strong> Families now choose biodegradable idols and symbolic immersions in buckets or tanks to reduce water pollution.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">5. Raksha Bandhan</h3>
            <p>Celebrated as the bond between siblings, sisters tie rakhi on their brothers' wrists, and brothers promise to protect them. Gifts and sweets make the day extra special.</p>
            <p><strong>💡 Stylish Ideas:</strong> Designer rakhis, handmade gifts, and digital rakhi delivery for siblings living abroad.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">6. Harvest Festivals (Pongal, Makar Sankranti, Baisakhi, Onam)</h3>
            <p>India's agricultural roots are celebrated in harvest festivals across states:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pongal in Tamil Nadu</strong> – cooking sweet rice as an offering to the Sun God.</li>
              <li><strong>Makar Sankranti in the north</strong> – flying kites and sharing til-gud (sesame-jaggery sweets).</li>
              <li><strong>Baisakhi in Punjab</strong> – bhangra, fairs, and feasting.</li>
              <li><strong>Onam in Kerala</strong> – pookalam (floral designs), snake boat races, and grand sadhya feasts.</li>
            </ul>
            <p><strong>💡 SEO Boost:</strong> Searches for "Onam sadhya menu" and "Makar Sankranti kite festival" rise every year.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Modern Trends in Festival Celebrations</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">Eco-Friendly Celebrations</h3>
            <p>Clay idols, plastic-free decorations, and waste-free feasts are becoming popular across cities.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">Destination Festivals</h3>
            <p>Families and friends are combining vacations with festivals—celebrating Holi in Goa or Diwali in Jaipur.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">Technology in Celebrations</h3>
            <p>Virtual pujas, festival e-cards, WhatsApp invites, and digital gifting platforms are now common.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">Fusion Food & Fashion</h3>
            <p>Chefs experiment with fusion sweets (like chocolate ladoos), while designers blend ethnic wear with Western cuts for festive outfits.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">How to Celebrate Festivals in Style</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Decor Ideas:</strong> Use fairy lights, flowers, and sustainable décor.</li>
              <li><strong>Food Tips:</strong> Mix traditional sweets with modern dishes.</li>
              <li><strong>Outfits:</strong> Choose vibrant colors with comfortable fabrics.</li>
              <li><strong>Music & Dance:</strong> Organize cultural games, karaoke, or traditional dances.</li>
              <li><strong>Photography:</strong> Create themed corners for Instagram-worthy pictures.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">FAQs on Festival Celebrations</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">1. Why are Indian festivals so important?</h4>
                <p>They connect people to traditions, bring communities together, and celebrate life's values like love, unity, and prosperity.</p>
              </div>
              <div>
                <h4 className="font-semibold">2. How can festivals be celebrated sustainably?</h4>
                <p>By using eco-friendly décor, avoiding plastic, donating food, and reducing waste.</p>
              </div>
              <div>
                <h4 className="font-semibold">3. Can festivals be celebrated outside India?</h4>
                <p>Yes, Indian communities worldwide celebrate Diwali, Holi, and Navratri, often blending local culture with Indian rituals.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Conclusion</h2>
            <p>Indian festivals are a celebration of life itself—where traditions, family, food, and fun come together. Whether it's lighting diyas on Diwali, dancing Garba during Navratri, or flying kites on Makar Sankranti, every festival has its unique charm.</p>
            <p>By blending timeless traditions with modern style, you can make these celebrations more memorable, meaningful, and sustainable.</p>
          </div>
        </article>
      </div>
    </>
  );
};

export default FestivalCelebrations;