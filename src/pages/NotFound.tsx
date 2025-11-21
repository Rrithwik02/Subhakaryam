import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, Sparkles, Mail } from 'lucide-react';
import { NotFoundSearch } from '@/components/search/NotFoundSearch';
import { getSuggestedPages, getPopularPages } from '@/utils/searchUtils';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const suggestedPages = getSuggestedPages(location.pathname);
  const popularPages = getPopularPages();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl w-full">
        <Card className="text-center shadow-xl">
          <CardHeader className="space-y-6 pb-8">
            {/* Animated 404 */}
            <div className="relative">
              <div className="text-8xl font-bold text-primary mb-4 animate-pulse">404</div>
              <Sparkles className="absolute top-0 right-1/4 h-8 w-8 text-primary animate-bounce" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
              <p className="text-muted-foreground text-lg">
                Oops! The page you're looking for seems to have wandered off.
              </p>
            </div>

            {/* Requested Path */}
            {location.pathname && (
              <div className="bg-muted/50 border border-border p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">You were looking for:</p>
                <code className="font-mono text-sm text-foreground">{location.pathname}</code>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-8 pb-8">
            {/* Search Bar */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowSearch(!showSearch)}
                className="w-full h-14 text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Search for what you need...
              </Button>
              
              {showSearch && (
                <div className="pt-4">
                  <NotFoundSearch onClose={() => setShowSearch(false)} />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!showSearch && (
              <>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      if (window.history.length > 1) {
                        navigate(-1);
                      } else {
                        navigate('/');
                      }
                    }}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    size="lg"
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>

                {/* Suggested Pages */}
                {suggestedPages.length > 0 && (
                  <div className="pt-6 border-t">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Did you mean?</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {suggestedPages.map((page) => (
                        <Button
                          key={page.path}
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(page.path)}
                          className="text-sm justify-start"
                        >
                          {page.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Destinations */}
                <div className="pt-6 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">Popular Pages</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {popularPages.map((page) => (
                      <Button
                        key={page.path}
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(page.path)}
                        className="text-sm"
                      >
                        {page.title}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Help Section */}
                <div className="pt-6 border-t bg-muted/30 -mx-6 px-6 py-4 rounded-b-lg">
                  <p className="text-sm text-muted-foreground mb-3">Need help finding something?</p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/contact')}
                      className="text-sm"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Contact Support
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/about')}
                      className="text-sm"
                    >
                      About Us
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          If you believe this is an error, please <button onClick={() => navigate('/contact')} className="text-primary hover:underline">contact us</button>
        </p>
      </div>
    </div>
  );
};

export default NotFound;