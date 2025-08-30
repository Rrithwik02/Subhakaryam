import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const EssentialHomeCeremonies = () => {
  return (
    <>
      <Helmet>
        <title>Essential Indian Home Ceremonies: A Complete Guide | Subhakaryam</title>
        <meta name="description" content="Discover the most important Indian home ceremonies, their meanings, and how to perform them. From pujas to festivals, learn step-by-step traditions." />
        <meta name="keywords" content="Indian home ceremonies, griha pravesh, satyanarayan puja, naming ceremony, home rituals" />
        <link rel="canonical" href="https://subhakaryam.org/blog/essential-home-ceremonies" />
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
                src="/lovable-uploads/4079e9c8-f79f-4bf9-a1f7-1aeeea1f9e30.png" 
                alt="Essential Indian Home Ceremonies"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Home Ceremonies</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                6 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              Essential Indian Home Ceremonies: A Complete Guide
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pandit Rajesh Sharma
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  December 20, 2024
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
            <p>In Indian culture, the home is considered sacred—a place where family, tradition, and spirituality meet. That's why home ceremonies (griha sanskar & pujas) play such a vital role in preserving customs and creating a bond between generations. From housewarming pujas to naming ceremonies, Satyanarayan puja, and festival celebrations, every ritual carries deep cultural and spiritual significance.</p>

            <p>In this guide, we'll explore the most popular Indian home ceremonies, their meanings, and how they are performed today.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Popular Indian Home Ceremonies</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Griha Pravesh (Housewarming Ceremony)</h3>
            <p>When a family moves into a new home, the Griha Pravesh ritual is performed to purify the space and invite positive energy. Priests conduct mantras, the family enters with a coconut, and the lady of the house kicks a pot of rice for prosperity.</p>
            <p><strong>💡 Modern Tip:</strong> Eco-friendly décor, rangolis with flower petals, and simple vegetarian feasts are trending for housewarming pujas in 2024.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Satyanarayan Puja</h3>
            <p>One of the most common and significant home pujas, the Satyanarayan Puja is dedicated to Lord Vishnu. It is performed to seek blessings for health, wealth, and happiness.</p>
            
            <h4 className="text-lg font-semibold text-ceremonial-maroon mb-2">How it's performed:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>A Kalash (sacred pot) is placed and decorated.</li>
              <li>Lord Vishnu's idol or photo is worshipped.</li>
              <li>Devotees recite the Satyanarayan Katha.</li>
              <li>Prasad (usually sheera or halwa) is distributed.</li>
            </ul>
            <p><strong>👉</strong> This puja is often performed during marriages, housewarming, birthdays, or before embarking on a new journey.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Naamkaran (Naming Ceremony)</h3>
            <p>Held 11 or 12 days after a baby's birth, this ceremony introduces the newborn to the family and community. The priest consults the baby's horoscope to suggest auspicious letters for the name.</p>
            <p><strong>💡 Modern Twist:</strong> Parents often combine traditional rituals with creative themes—like personalized decorations, baby photo booths, and customized keepsakes.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">4. Annaprashan (First Rice-Eating Ceremony)</h3>
            <p>Performed when the baby is 6 months old, Annaprashan marks the child's first solid food intake. The ceremony is done with prayers, blessings, and offerings of kheer (sweet rice pudding).</p>
            <p><strong>💡 SEO Keyword:</strong> "Annaprashan ceremony significance" is a growing search term among young parents.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">5. Upanayan (Sacred Thread Ceremony)</h3>
            <p>A traditional Hindu rite of passage for boys, Upanayan introduces the child to spiritual learning. The boy is given the sacred thread (yajnopavita) and taught the Gayatri Mantra by a priest.</p>
            <p>Though less common today, it remains a respected ritual in many families.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">6. Shraddha & Pitru Paksha Rituals</h3>
            <p>Indian families also perform ancestral rites (Shraddha) to honor forefathers and seek their blessings. These ceremonies include offerings of food, water, and prayers for peace to departed souls.</p>
            <p><strong>💡 SEO Boost:</strong> People often search for "how to perform Shraddha at home" — adding step-by-step guidance helps your blog rank.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Everyday Home Pujas</h2>
            <p>Apart from big occasions, many Indian families perform small rituals regularly:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Daily Diya Lighting</strong> – Offering prayers to the family deity morning and evening.</li>
              <li><strong>Lakshmi Puja on Fridays</strong> – For prosperity.</li>
              <li><strong>Ganesh Puja on new beginnings</strong> – Before exams, business launches, or travels.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Modern Trends in Home Ceremonies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Eco-Friendly Pujas:</strong> Using clay idols, natural flowers, and reusable decorations.</li>
              <li><strong>Online Puja Services:</strong> Priests conducting pujas virtually for families living abroad.</li>
              <li><strong>Minimalist Rituals:</strong> Families opting for simplified ceremonies with close relatives.</li>
              <li><strong>Blending Traditions:</strong> Couples from different cultural backgrounds combining customs into one unique home ceremony.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">FAQs About Home Ceremonies</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">1. Can I perform pujas at home without a priest?</h4>
                <p>Yes, many rituals can be performed by family members with devotion, though priests are often invited for major pujas.</p>
              </div>
              <div>
                <h4 className="font-semibold">2. What items are needed for home ceremonies?</h4>
                <p>Typically flowers, fruits, betel leaves, incense sticks, turmeric, kumkum, a diya (lamp), and offerings like sweets.</p>
              </div>
              <div>
                <h4 className="font-semibold">3. Are home ceremonies the same across India?</h4>
                <p>While the core rituals remain the same, each region has its own variations and customs.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Conclusion</h2>
            <p>Indian home ceremonies are much more than rituals—they're heartfelt traditions that bring families together and ensure blessings for new beginnings. Whether it's the joy of a baby's naming ceremony, the sanctity of a Satyanarayan puja, or the emotional Griha Pravesh, each ceremony strengthens cultural roots and family bonds.</p>
          </div>
        </article>
      </div>
    </>
  );
};

export default EssentialHomeCeremonies;