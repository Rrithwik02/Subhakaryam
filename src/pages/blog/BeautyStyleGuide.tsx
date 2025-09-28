import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const BeautyStyleGuide = () => {
  return (
    <>
      <Helmet>
        <title>Indian Wedding Beauty & Style Guide: Tips for Brides & Grooms | Subhakary</title>
        <meta name="description" content="Discover the ultimate Indian wedding beauty & style guide. From bridal makeup to groom styling, explore timeless tips and modern trends." />
        <meta name="keywords" content="bridal makeup, wedding style guide, groom fashion, Indian wedding beauty, bridal outfits, wedding hair" />
        <link rel="canonical" href="https://subhakary.com/blog/beauty-style-guide" />
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
                src="/lovable-uploads/8b5f264e-7ce3-4d42-b1bf-46a28d9b54ca.png" 
                alt="Indian Wedding Beauty & Style Guide"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Beauty & Style</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                9 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              Indian Wedding Beauty & Style Guide: Tips for Brides & Grooms
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Meera Patel
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  December 22, 2024
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
            <p>An Indian wedding is more than a ceremony—it's a grand showcase of culture, tradition, and personal style. Every bride and groom wants to look their best on their big day, and with endless beauty rituals, fashion choices, and style inspirations, planning the perfect look can be overwhelming.</p>

            <p>This complete beauty and style guide for Indian weddings covers everything—from bridal makeup and skincare routines to groom styling, outfits, and accessories—blending traditional charm with modern trends.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Bridal Beauty & Style</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Pre-Wedding Skincare Routine</h3>
            <p>Glowing skin starts months before the big day. Brides usually follow a skincare regime that includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cleansing & Hydration:</strong> Regular CTM (Cleanse, Tone, Moisturize).</li>
              <li><strong>Natural Packs:</strong> Haldi, sandalwood, and rose water masks.</li>
              <li><strong>Professional Treatments:</strong> Facials and dermatology-approved routines.</li>
            </ul>
            <p><strong>💡 SEO Tip:</strong> "Bridal skincare routine before wedding" is one of the most searched terms among brides-to-be.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Bridal Makeup Trends</h3>
            <p>Makeup plays a crucial role in defining the bride's final look. Popular styles include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Classic Bridal Look:</strong> Red lips, bold eyeliner, gold shimmer eyeshadow.</li>
              <li><strong>Minimalist Makeup:</strong> Nude tones with a natural glow.</li>
              <li><strong>Regional Styles:</strong> South Indian brides prefer temple jewelry with bold eyes; Punjabi brides go for heavy eye makeup and bold lipstick.</li>
            </ul>
            <p><strong>💡 Trending 2024:</strong> Waterproof airbrush makeup for long-lasting finish.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Bridal Hairstyles & Accessories</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Traditional Styles:</strong> Buns adorned with jasmine flowers, braids decorated with hair jewelry.</li>
              <li><strong>Modern Styles:</strong> Loose curls, messy buns, or sleek ponytails with jeweled pins.</li>
              <li><strong>Accessories:</strong> Maang tikka, jhumkas, kamarbandh, and statement bangles complete the look.</li>
            </ul>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">4. Bridal Outfits</h3>
            <p>Indian brides have a variety of outfit choices depending on region and personal preference:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Lehenga:</strong> The most popular choice with heavy embroidery and embellishments.</li>
              <li><strong>Saree:</strong> Kanjeevaram, Banarasi, and Paithani sarees are timeless classics.</li>
              <li><strong>Fusion Wear:</strong> Gowns with traditional embroidery, Indo-Western lehengas.</li>
            </ul>
            <p><strong>💡 Tip:</strong> Colors like maroon, red, and gold remain classic, while pastel pinks and ivory are trending in 2024 weddings.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Groom Beauty & Style</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Pre-Wedding Groom Care</h3>
            <p>Grooms, too, need a self-care routine:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Skincare facials and beard grooming.</li>
              <li>Hair spa sessions for shine and volume.</li>
              <li>Fitness and diet plans for a confident look.</li>
            </ul>
            <p><strong>💡 SEO Keyword:</strong> "groom skincare before wedding" is trending among young grooms.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Groom Outfits</h3>
            <p>Just like brides, grooms have versatile fashion choices:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sherwani:</strong> Richly embroidered, often paired with churidar or dhoti.</li>
              <li><strong>Bandhgala Suit:</strong> A royal, sophisticated look.</li>
              <li><strong>Kurta-Pyjama with Jacket:</strong> Elegant yet simple.</li>
              <li><strong>Western Suits:</strong> Blazers and tuxedos for receptions.</li>
            </ul>
            <p><strong>💡 Trending Colors 2024:</strong> Ivory, pastel blue, emerald green, and beige.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Groom Accessories</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sehra or Turban:</strong> Essential for the baraat.</li>
              <li><strong>Neckpieces & Brooches:</strong> Add a regal touch.</li>
              <li><strong>Footwear:</strong> Mojaris and juttis are classics.</li>
              <li><strong>Watches & Perfumes:</strong> The ultimate style statement.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Couple Styling Tips</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Coordinated Outfits</h3>
            <p>Brides and grooms often choose matching or complementary colors for their outfits. Example: bride in red lehenga, groom in ivory sherwani with red accents.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Photography-Ready Looks</h3>
            <p>Choose styles that look good both in person and in pictures. Overly shiny makeup or awkward outfit fits can appear different on camera.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Theme-Based Weddings</h3>
            <p>Destination weddings often inspire outfit themes—beach weddings call for lighter fabrics, palace weddings for royal attire.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Modern Trends in Wedding Beauty & Style</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sustainable Fashion:</strong> Brides and grooms choosing eco-friendly fabrics, organic makeup, and ethical jewelry.</li>
              <li><strong>Minimalism:</strong> A rise in lightweight lehengas, simple sherwanis, and subtle makeup.</li>
              <li><strong>Celebrity-Inspired Looks:</strong> Many couples draw inspiration from Bollywood weddings like Alia Bhatt–Ranbir Kapoor or Virat–Anushka.</li>
              <li><strong>Personalized Outfits:</strong> Initials embroidered on outfits or coordinated dupattas.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Quick Tips for Brides & Grooms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Do a trial run for makeup and hairstyle before the wedding.</li>
              <li>Plan footwear carefully—comfort is just as important as looks.</li>
              <li>Hydrate and sleep well in the weeks leading up to the big day.</li>
              <li>Keep backup accessories like safety pins, extra dupatta pins, and tissues.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">FAQs on Wedding Beauty & Style</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">1. When should brides and grooms start their beauty routine?</h4>
                <p>At least 3–6 months before the wedding for best results.</p>
              </div>
              <div>
                <h4 className="font-semibold">2. How to choose a wedding outfit?</h4>
                <p>Consider the wedding theme, personal comfort, and body type.</p>
              </div>
              <div>
                <h4 className="font-semibold">3. Are minimalist looks suitable for Indian weddings?</h4>
                <p>Yes! Minimalist bridal and groom looks are becoming increasingly popular.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Conclusion</h2>
            <p>Your wedding day is one of the most important days of your life, and looking your best is a reflection of not just style, but also tradition and personality. By balancing timeless Indian wedding beauty rituals with modern style trends, brides and grooms can create unforgettable looks that reflect who they truly are.</p>
          </div>
        </article>
      </div>
    </>
  );
};

export default BeautyStyleGuide;