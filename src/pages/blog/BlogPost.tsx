import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const BlogPost = () => {
  const { slug } = useParams();

  // Blog posts data - in real app this would come from CMS/API
  const blogPosts = {
    'hindu-wedding-ceremonies-guide': {
      title: "Complete Guide to Hindu Wedding Ceremonies",
      content: `
        <h2>Introduction</h2>
        <p>Hindu weddings are elaborate celebrations steeped in ancient traditions and rituals. Each ceremony holds deep spiritual significance and brings families together in joyous celebration.</p>
        
        <h2>Pre-Wedding Ceremonies</h2>
        <h3>Roka Ceremony</h3>
        <p>The Roka ceremony marks the formal announcement of the engagement. It's a simple ritual where both families exchange gifts and sweets, symbolizing their acceptance of the union.</p>
        
        <h3>Mehendi Ceremony</h3>
        <p>One of the most colorful pre-wedding events, the Mehendi ceremony involves applying intricate henna designs on the bride's hands and feet. It's believed that the darker the mehendi color, the stronger the love between the couple.</p>
        
        <h3>Sangam/Haldi Ceremony</h3>
        <p>Turmeric paste is applied to both bride and groom in their respective homes. This ritual is believed to purify the couple and give them a natural glow for their wedding day.</p>
        
        <h2>Wedding Day Rituals</h2>
        <h3>Baraat</h3>
        <p>The groom arrives at the wedding venue on a decorated horse or in a car, accompanied by his family and friends dancing to dhol beats.</p>
        
        <h3>Varmala/Jaimala</h3>
        <p>The bride and groom exchange floral garlands, symbolizing their acceptance of each other as life partners.</p>
        
        <h3>Saat Phere (Seven Circles)</h3>
        <p>The couple takes seven rounds around the sacred fire, making vows for their married life. Each circle represents a specific promise they make to each other.</p>
        
        <h3>Sindoor and Mangalsutra</h3>
        <p>The groom applies sindoor (vermillion) to the bride's hair parting and ties the mangalsutra around her neck, marking her as a married woman.</p>
        
        <h2>Post-Wedding Ceremonies</h2>
        <h3>Vidaai</h3>
        <p>An emotional ceremony where the bride bids farewell to her family and embarks on her new journey with her husband's family.</p>
        
        <h3>Griha Pravesh</h3>
        <p>The bride's first entry into her new home, marked by various rituals to welcome her into the family.</p>
        
        <h2>Regional Variations</h2>
        <p>Hindu wedding ceremonies vary significantly across different regions of India. North Indian weddings often include the Chooda ceremony, while South Indian weddings feature the Kashi Yatra ritual.</p>
        
        <h2>Modern Adaptations</h2>
        <p>Contemporary Hindu weddings often blend traditional rituals with modern elements, such as destination weddings, fusion music, and contemporary photography styles while maintaining the essence of sacred traditions.</p>
      `,
      excerpt: "Everything you need to know about traditional Hindu wedding rituals, from pre-wedding ceremonies to post-wedding traditions.",
      category: "Wedding Traditions",
      readTime: "8 min read",
      date: "December 15, 2024",
      author: "Priya Sharma",
      image: "/lovable-uploads/11ac3cd2-aa50-4a44-8bfd-e951d610fb7b.png",
      tags: ["Hindu Wedding", "Traditions", "Ceremonies", "Indian Culture"]
    },
    'griha-pravesh-ritual-guide': {
      title: "Griha Pravesh Puja: Complete Ritual Guide",
      content: `
        <h2>What is Griha Pravesh?</h2>
        <p>Griha Pravesh is a sacred Hindu ceremony performed when entering a new home for the first time. It's believed to purify the space and invite positive energy and prosperity.</p>
        
        <h2>Types of Griha Pravesh</h2>
        <h3>Apoorva Griha Pravesh</h3>
        <p>Performed when entering a newly constructed house for the first time.</p>
        
        <h3>Sapoorva Griha Pravesh</h3>
        <p>Conducted when moving into a pre-owned house or returning to a house after renovation.</p>
        
        <h3>Dwandwah Griha Pravesh</h3>
        <p>Performed when entering a house that was left vacant due to unfortunate events.</p>
        
        <h2>Auspicious Time (Muhurat)</h2>
        <p>The ceremony should be performed on an auspicious day and time according to the Hindu calendar. Consult a pandit to determine the best muhurat based on your birth details.</p>
        
        <h2>Required Materials</h2>
        <ul>
          <li>Kalash (copper pot) filled with water</li>
          <li>Mango leaves</li>
          <li>Coconut</li>
          <li>Flowers (marigold, lotus)</li>
          <li>Incense sticks and lamps</li>
          <li>Rice and turmeric</li>
          <li>Fruits and sweets</li>
          <li>Red cloth</li>
          <li>Sacred thread (janeu)</li>
        </ul>
        
        <h2>Step-by-Step Procedure</h2>
        <h3>1. Purification</h3>
        <p>Clean the entire house thoroughly. Sprinkle Ganga jal (holy water) in all rooms.</p>
        
        <h3>2. Kalash Sthapana</h3>
        <p>Place the kalash at the entrance and perform kalash puja with mantras.</p>
        
        <h3>3. Ganapati Puja</h3>
        <p>Begin with Lord Ganesha worship to remove obstacles and ensure smooth proceedings.</p>
        
        <h3>4. Vastu Puja</h3>
        <p>Worship the Vastu Purush (deity of the house) to ensure harmony and prosperity.</p>
        
        <h3>5. Boiling Milk</h3>
        <p>Boil milk in the kitchen until it overflows, symbolizing abundance and prosperity.</p>
        
        <h3>6. Aarti and Prayers</h3>
        <p>Perform aarti and chant mantras seeking blessings for the family's well-being.</p>
        
        <h2>Important Mantras</h2>
        <p><strong>Ganapati Mantra:</strong> "Om Gam Ganapataye Namaha"</p>
        <p><strong>Griha Pravesh Mantra:</strong> "Om Vaastu Purushaaya Namaha"</p>
        
        <h2>Post-Ceremony Traditions</h2>
        <ul>
          <li>The lady of the house should enter first with her right foot</li>
          <li>Break a coconut at the threshold</li>
          <li>Light a lamp in the prayer room</li>
          <li>Distribute prasad to all attendees</li>
        </ul>
        
        <h2>Modern Considerations</h2>
        <p>While maintaining traditional elements, modern families often adapt the ceremony to fit contemporary lifestyles, ensuring the spiritual essence remains intact.</p>
      `,
      excerpt: "Step-by-step guide to performing Griha Pravesh ceremony for your new home, including required materials and mantras.",
      category: "Home Ceremonies",
      readTime: "6 min read",
      date: "December 10, 2024",
      author: "Pandit Rajesh Sharma",
      image: "/lovable-uploads/4079e9c8-f79f-4bf9-a1f7-1aeeea1f9e30.png",
      tags: ["Griha Pravesh", "Home Ceremony", "Puja", "Vastu"]
    },
    'mehendi-designs-trends': {
      title: "Mehendi Designs: Traditional vs Modern Trends",
      content: `
        <h2>The Art of Mehendi</h2>
        <p>Mehendi, also known as henna, is an ancient art form that has adorned women's hands and feet for centuries. This natural dye creates beautiful temporary tattoos that are an integral part of Indian celebrations.</p>
        
        <h2>Traditional Mehendi Patterns</h2>
        <h3>Rajasthani Style</h3>
        <p>Known for elaborate patterns featuring peacocks, paisleys, and intricate geometric designs. These designs often cover the entire palm and extend to the fingers.</p>
        
        <h3>Arabic Style</h3>
        <p>Characterized by bold, flowing patterns with plenty of negative space. Arabic mehendi often features floral vines and leaves with less filling.</p>
        
        <h3>Bridal Patterns</h3>
        <p>Traditional bridal mehendi includes the groom's name hidden within the design, along with symbols of love, fertility, and prosperity.</p>
        
        <h2>Modern Mehendi Trends</h2>
        <h3>Minimalist Designs</h3>
        <p>Contemporary brides often prefer simple, elegant patterns that are less dense but equally beautiful. These include finger mehendi and small motifs.</p>
        
        <h3>Portrait Mehendi</h3>
        <p>A recent trend where artists create detailed portraits of the couple or religious figures within the mehendi design.</p>
        
        <h3>Colored Mehendi</h3>
        <p>While traditional mehendi is orange-brown, modern variations include colored additions with glitter, stones, and temporary colored henna.</p>
        
        <h3>Mandala Patterns</h3>
        <p>Geometric mandala designs have become increasingly popular for their symmetrical beauty and spiritual significance.</p>
        
        <h2>Application Techniques</h2>
        <h3>Traditional Cone Method</h3>
        <p>The classic method using handmade cones filled with fresh henna paste for precise application.</p>
        
        <h3>Brush Application</h3>
        <p>Some modern artists use fine brushes for detailed work and filling larger areas.</p>
        
        <h3>Stencil Method</h3>
        <p>For beginners or quick applications, stencils can help create consistent patterns.</p>
        
        <h2>Caring for Your Mehendi</h2>
        <ul>
          <li>Keep the paste on for 4-6 hours for deeper color</li>
          <li>Avoid water contact for 12-24 hours after removal</li>
          <li>Apply lemon juice and sugar for better color development</li>
          <li>Use natural oils to maintain the design longer</li>
        </ul>
        
        <h2>Occasion-Based Designs</h2>
        <h3>Wedding Mehendi</h3>
        <p>Elaborate, detailed designs covering hands and feet with traditional motifs and personal elements.</p>
        
        <h3>Festival Mehendi</h3>
        <p>Simpler patterns perfect for celebrations like Karva Chauth, Teej, and Eid.</p>
        
        <h3>Party Mehendi</h3>
        <p>Quick, stylish designs for casual events and gatherings.</p>
        
        <h2>Choosing the Right Artist</h2>
        <p>Select an experienced mehendi artist who understands your vision and can adapt traditional patterns to your personal style. Look at their portfolio and discuss your preferences beforehand.</p>
      `,
      excerpt: "Explore the evolution of mehendi art from traditional patterns to contemporary designs that brides love today.",
      category: "Beauty & Style",
      readTime: "5 min read",
      date: "December 8, 2024",
      author: "Meera Patel",
      image: "/lovable-uploads/8b5f264e-7ce3-4d42-b1bf-46a28d9b54ca.png",
      tags: ["Mehendi", "Henna", "Bridal", "Design Trends"]
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = Object.entries(blogPosts)
    .filter(([key]) => key !== slug)
    .slice(0, 3)
    .map(([key, value]) => ({ slug: key, ...value }));

  return (
    <>
      <Helmet>
        <title>{post.title} | Subhakary Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <link rel="canonical" href={`https://subhakary.com/blog/${slug}`} />
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
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="text-sm text-ceremonial-brown flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-ceremonial-maroon mb-4">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
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

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }} 
              className="text-ceremonial-brown leading-relaxed"
            />
          </div>

          {/* Related Posts */}
          <section className="mt-16">
            <h2 className="text-2xl font-display font-bold text-ceremonial-maroon mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-ceremonial-cream">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="text-xs mb-2">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-semibold text-ceremonial-maroon mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-ceremonial-brown line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  );
};

export default BlogPost;