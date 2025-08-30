import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const BlogIndex = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "Complete Guide to Hindu Wedding Ceremonies",
      excerpt: "Everything you need to know about traditional Hindu wedding rituals, from pre-wedding ceremonies to post-wedding traditions.",
      category: "Wedding Traditions",
      readTime: "8 min read",
      date: "December 15, 2024",
      image: "/lovable-uploads/11ac3cd2-aa50-4a44-8bfd-e951d610fb7b.png"
    },
    {
      id: 2,
      title: "Griha Pravesh Puja: Complete Ritual Guide",
      excerpt: "Step-by-step guide to performing Griha Pravesh ceremony for your new home, including required materials and mantras.",
      category: "Home Ceremonies",
      readTime: "6 min read", 
      date: "December 10, 2024",
      image: "/lovable-uploads/4079e9c8-f79f-4bf9-a1f7-1aeeea1f9e30.png"
    },
    {
      id: 3,
      title: "Mehendi Designs: Traditional vs Modern Trends",
      excerpt: "Explore the evolution of mehendi art from traditional patterns to contemporary designs that brides love today.",
      category: "Beauty & Style",
      readTime: "5 min read",
      date: "December 8, 2024", 
      image: "/lovable-uploads/8b5f264e-7ce3-4d42-b1bf-46a28d9b54ca.png"
    }
  ];

  const categories = [
    "Wedding Traditions", "Home Ceremonies", "Festival Celebrations", 
    "Beauty & Style", "Photography Tips", "Catering Ideas", "Decoration Trends"
  ];

  const recentPosts = [
    { title: "Best Photography Poses for Indian Weddings", date: "December 12, 2024", category: "Photography Tips" },
    { title: "Traditional South Indian Wedding Menu Planning", date: "December 9, 2024", category: "Catering Ideas" },
    { title: "Navratri Decoration Ideas for 2024", date: "December 5, 2024", category: "Decoration Trends" },
    { title: "Satyanarayan Puja: When and How to Perform", date: "December 3, 2024", category: "Home Ceremonies" },
    { title: "Choosing the Perfect Wedding Photographer", date: "November 28, 2024", category: "Photography Tips" }
  ];

  return (
    <>
      <Helmet>
        <title>Indian Wedding & Ceremony Blog | Tradition Guides | Subhakaryam</title>
        <meta name="description" content="Expert guides on Hindu wedding ceremonies, pooja rituals, festival celebrations, and traditional customs. Learn about Indian traditions, ceremony planning, and cultural practices." />
        <meta name="keywords" content="hindu wedding traditions, pooja rituals, indian ceremonies, festival celebrations, wedding planning blog, traditional customs" />
        <link rel="canonical" href="https://subhakaryam.org/blog" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-ceremonial-cream to-white">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ceremonial-maroon mb-4">
                Tradition & Culture Blog
              </h1>
              <p className="text-xl text-ceremonial-brown max-w-3xl mx-auto mb-8">
                Discover the rich heritage of Indian traditions, wedding customs, and ceremonial practices. 
                Get expert guidance on performing rituals, planning celebrations, and preserving cultural values.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-ceremonial-cream">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-ceremonial-brown flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-ceremonial-maroon line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-ceremonial-brown">
                      <Calendar className="h-4 w-4 mr-2" />
                      {post.date}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    <Link to={`/blog/${post.id === 1 ? 'timeless-wedding-traditions' : post.id === 2 ? 'essential-home-ceremonies' : 'beauty-style-guide'}`}>
                      <Button variant="outline" className="w-full group">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Explore by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="bg-white hover:bg-ceremonial-gold hover:text-white transition-colors"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-ceremonial-maroon">
              Recent Articles
            </h2>
            <div className="space-y-6">
              {recentPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-ceremonial-maroon mb-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-ceremonial-brown">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {post.date}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <Link to={`/blog/${index === 0 ? 'photography-tips' : index === 1 ? 'catering-ideas' : index === 2 ? 'decoration-trends' : index === 3 ? 'festival-celebrations' : 'beauty-style-guide'}`}>
                        <Button variant="ghost" size="sm" className="mt-4 md:mt-0 group">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 px-4 bg-ceremonial-cream">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-display font-bold mb-4 text-ceremonial-maroon">
              Stay Updated with Tradition
            </h2>
            <p className="text-ceremonial-brown mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest articles on Indian traditions, 
              ceremony guides, and cultural insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-ceremonial-brown/20 focus:outline-none focus:ring-2 focus:ring-ceremonial-gold"
              />
              <Button className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogIndex;