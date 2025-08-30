import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const PhotographyTips = () => {
  return (
    <>
      <Helmet>
        <title>Top Wedding Photography Tips for Picture-Perfect Memories | Subhakaryam</title>
        <meta name="description" content="Discover expert wedding photography tips for stunning shots. From candid moments to perfect lighting, learn how to capture timeless wedding memories." />
        <meta name="keywords" content="wedding photography tips, candid photography, bridal photography, Indian wedding photos, photography techniques" />
        <link rel="canonical" href="https://subhakaryam.org/blog/photography-tips" />
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
              <div className="text-ceremonial-maroon text-6xl">📸</div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Photography Tips</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                8 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              Top Wedding Photography Tips for Picture-Perfect Memories
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Arjun Photography
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  December 25, 2024
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
            <p>A wedding is one of the most cherished events in life—and photographs are the keepsakes that keep those memories alive forever. In Indian weddings, where ceremonies span several days with colorful traditions, capturing the right moments is both an art and a challenge.</p>

            <p>Whether you're a professional wedding photographer, a bride or groom hiring one, or even a guest looking to click Instagram-worthy shots, this guide covers the top wedding photography tips for timeless, picture-perfect memories.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Essential Wedding Photography Tips</h2>
            
            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">1. Know the Rituals & Schedule</h3>
            <p>Indian weddings involve multiple ceremonies: Haldi, Mehendi, Sangeet, Baraat, and the Wedding Day rituals. Understanding the sequence helps photographers anticipate key moments.</p>
            <p><strong>💡 Example:</strong> Be ready for the sindoor ceremony and mangal pheras, as they are once-in-a-lifetime moments.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">2. Scout the Venue in Advance</h3>
            <p>Visit the venue a day before to check:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Lighting conditions.</li>
              <li>Best natural backdrops (gardens, mandaps, entrances).</li>
              <li>Indoor vs. outdoor photo opportunities.</li>
            </ul>
            <p>This preparation ensures no surprises on the big day.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">3. Use Natural Lighting Wisely</h3>
            <p>Golden hour (early morning or sunset) gives the most flattering, soft light. Avoid harsh noon lighting unless shaded areas are available. For evening functions, use external flash or fairy lights to create a dreamy effect.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">4. Candid Over Posed</h3>
            <p>Candid shots often capture raw emotions—tears at Vidaai, laughter during Sangeet, or a shy glance at the mandap. A mix of candid and posed photography tells the full wedding story.</p>
            <p><strong>💡 SEO Keyword:</strong> "candid wedding photography" is one of the most searched wedding terms in India.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">5. Capture the Details</h3>
            <p>Don't just focus on people—capture the little things:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Mehendi designs on hands.</li>
              <li>Jewelry close-ups.</li>
              <li>Mandap decorations.</li>
              <li>Wedding invites or favors.</li>
            </ul>
            <p>These details complete the wedding album.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">6. Focus on Family & Friends</h3>
            <p>While the couple is the highlight, group shots with parents, grandparents, cousins, and friends add warmth to the album.</p>
            <p><strong>💡 Pro Tip:</strong> Organize family portraits quickly before guests get distracted by food or dancing.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">7. Stay Invisible but Present</h3>
            <p>Blend in with the crowd. Avoid directing too much during rituals, but be quick to position yourself for emotional shots.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">8. Use Multiple Cameras & Lenses</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Wide-angle lens:</strong> For mandap shots and group photos.</li>
              <li><strong>50mm lens:</strong> For candid close-ups.</li>
              <li><strong>Telephoto lens:</strong> To capture moments without intruding.</li>
            </ul>
            <p>Backup equipment is a must—weddings don't allow retakes.</p>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">9. Create a Shot List</h3>
            <p>Work with the couple to prepare a list of must-have shots, such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Bridal entry.</li>
              <li>Groom's baraat.</li>
              <li>Ring exchange.</li>
              <li>First dance (if included).</li>
              <li>Group shots with siblings/friends.</li>
            </ul>

            <h3 className="text-xl font-semibold text-ceremonial-maroon mb-3">10. Post-Processing & Editing</h3>
            <p>Editing brings photos to life. Use tools like Lightroom or Photoshop for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Color correction.</li>
              <li>Skin retouching.</li>
              <li>Background enhancements.</li>
              <li>Creating wedding albums.</li>
            </ul>
            <p><strong>💡 Trending Style:</strong> Soft pastel tones and cinematic edits are in demand for wedding albums in 2024.</p>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Tips for Brides & Grooms to Get Great Photos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Choose Outfits Wisely:</strong> Bold colors photograph better under lights.</li>
              <li><strong>Be Natural:</strong> Don't over-pose—authentic smiles look best.</li>
              <li><strong>Communicate with Photographer:</strong> Share personal stories so they know what to highlight.</li>
              <li><strong>Relax:</strong> The more comfortable you are, the better the photos.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Modern Wedding Photography Trends</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Drone Photography</strong> – Aerial shots of baraat, mandap, and large gatherings.</li>
              <li><strong>Cinematic Wedding Films</strong> – Storytelling through slow-motion videos, music, and voiceovers.</li>
              <li><strong>Black & White Portraits</strong> – Emotional moments look timeless in monochrome.</li>
              <li><strong>Instagram Reels & Short Clips</strong> – Couples now request reels for quick social media sharing.</li>
              <li><strong>Photo Booths & Props</strong> – Fun corners with hashtags for guests to enjoy.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Mistakes to Avoid in Wedding Photography</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Missing key rituals due to poor planning.</li>
              <li>Over-editing photos, which makes them look artificial.</li>
              <li>Not having backup equipment (batteries, memory cards, lenses).</li>
              <li>Ignoring candid emotions in pursuit of posed perfection.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">FAQs on Wedding Photography</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">1. How much does wedding photography cost in India?</h4>
                <p>It can range anywhere between ₹50,000 to ₹5,00,000 depending on location, duration, and photographer's experience.</p>
              </div>
              <div>
                <h4 className="font-semibold">2. What's better: candid or traditional photography?</h4>
                <p>A mix of both works best—candid captures emotions, while traditional ensures important posed shots are covered.</p>
              </div>
              <div>
                <h4 className="font-semibold">3. How many photos are usually taken at an Indian wedding?</h4>
                <p>Anywhere between 2,000–5,000 images, depending on the length of ceremonies.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-ceremonial-maroon mb-4 mt-8">Conclusion</h2>
            <p>Wedding photography is not just about pictures—it's about capturing love, emotions, and timeless memories. By planning ahead, focusing on details, and embracing modern trends, both photographers and couples can create magical wedding albums that will be cherished for generations.</p>
          </div>
        </article>
      </div>
    </>
  );
};

export default PhotographyTips;