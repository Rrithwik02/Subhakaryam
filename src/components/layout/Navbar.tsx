
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, Menu, MessageSquare, HomeIcon, Phone, Info, Plus, Briefcase, LogOut, Search, ChevronDown } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!session?.user) return false;
      
      const { data, error } = await supabase.rpc(
        'is_user_admin',
        { user_id: session.user.id }
      );

      if (error) throw error;
      return data || false;
    },
    enabled: !!session?.user,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return profile;
    },
    enabled: !!session?.user,
  });

  // Check if user is an approved service provider
  const { data: serviceProvider } = useQuery({
    queryKey: ["service-provider-status"],
    queryFn: async () => {
      if (!session?.user || userProfile?.user_type !== "service_provider") return null;
      
      const { data, error } = await supabase
        .from("service_providers")
        .select("status")
        .eq("profile_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user && userProfile?.user_type === "service_provider",
  });

  const handleProfileClick = () => {
    if (!session) {
      navigate("/auth/login");
      return;
    }

    if (userProfile?.user_type === "service_provider") {
      navigate("/provider/profile");
    } else {
      navigate("/profile");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.clear();
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/auth/login', { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  const isServiceProvider = userProfile?.user_type === "service_provider" && serviceProvider?.status === "approved";
  const isAdminUser = isAdmin || false;
  const isGuest = userProfile?.user_type === "guest" || !userProfile?.user_type;

  const MenuLink = ({ icon: Icon, text, onClick, className = "" }) => (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-2 px-4 py-6 text-lg font-medium text-foreground hover:text-primary hover:bg-accent/50 transition-colors ${className}`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      {text}
    </Button>
  );

  const NavLinks = () => (
    <NavigationMenu>
      <NavigationMenuList className="hidden md:flex">
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-gray-300 hover:text-white transition-colors cursor-pointer py-2 px-4 font-medium"
            onClick={() => navigate("/about")}
          >
            {t('nav.about')}
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-300 hover:text-white font-medium px-4">
                {t('nav.services')}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-strong shadow-premium-lg border-ceremonial-gold/20">
              <DropdownMenuItem onClick={() => navigate('/services/pooja-services')}>
                Pooja Services
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/services/wedding-photography')}>
                Wedding Photography
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/services/mehendi-artists')}>
                Mehendi Artists
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/search?service=makeup')}>
                Makeup Artists
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/services/catering')}>
                Catering Services
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/services/music')}>
                Music Services
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/services/decoration')}>
                Decoration Services
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/services/function-hall')}>
                Function Hall
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/bundles')}>
                Service Bundles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-gray-300 hover:text-white transition-colors cursor-pointer py-2 px-4 font-medium"
            onClick={() => navigate("/blog")}
          >
            {t('nav.blog')}
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-gray-300 hover:text-white transition-colors cursor-pointer py-2 px-4 font-medium"
            onClick={() => navigate("/contact")}
          >
            {t('nav.contact')}
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        {/* Track Booking Link */}
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-gray-300 hover:text-white transition-colors cursor-pointer py-2 px-4 font-medium"
            onClick={() => navigate("/track-booking")}
          >
            <Search className="h-4 w-4 inline-block mr-2" />
            {t('nav.trackBooking')}
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Dashboard Dropdown */}
        {session && (isAdminUser || isServiceProvider) && (
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white font-medium px-4">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {t('nav.dashboard')}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-strong shadow-premium border-ceremonial-gold/20">
                {isAdminUser && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="text-foreground hover:bg-accent">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                {isServiceProvider && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-foreground hover:bg-accent">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Provider Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/service/add")} className="text-foreground hover:bg-accent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Service
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        )}

        {/* Become a Service Provider Link (show when logged in as guest) */}
        {session && isGuest && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className="text-gray-300 hover:text-white transition-colors cursor-pointer py-2 px-4 font-medium"
              onClick={() => navigate("/register/service-provider")}
            >
              <Briefcase className="h-4 w-4 inline-block mr-2" />
              Become a Provider
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1f] border-b border-white/10 shadow-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent"
            onClick={() => navigate("/")}
          >
            <img 
              src="/logo.png" 
              alt="Subhakary Logo" 
              className="h-12"
            />
          </Button>

          <div className="flex items-center gap-8">
            <NavLinks />

            <div className="flex items-center gap-4">
              {session && <NotificationBell />}
              
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:ring-2 focus:ring-primary">
                      <UserRound className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-strong shadow-premium border-ceremonial-gold/20">
                    <DropdownMenuItem onClick={handleProfileClick} className="text-foreground hover:bg-accent">
                      <UserRound className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] font-medium"
                    onClick={() => navigate("/auth/login")}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 transition-colors min-h-[44px] font-medium rounded-lg px-6"
                    onClick={() => navigate("/register")}
                  >
                    Join Us
                  </Button>
                </div>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-300 hover:text-white transition-colors focus:ring-2 focus:ring-primary"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full h-full p-0 glass-dark border-l-0 animate-in slide-in-from-right duration-300">
                  <SheetHeader className="p-6 glass border-b border-ceremonial-gold/20">
                    <SheetTitle className="text-2xl font-display text-ceremonial-maroon text-glass-shadow">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-4 overflow-y-auto h-[calc(100vh-100px)]">
                    <MenuLink 
                      icon={HomeIcon} 
                      text="Home" 
                      onClick={() => navigate("/")} 
                    />
                    <MenuLink 
                      icon={Search} 
                      text="Track Booking" 
                      onClick={() => navigate("/track-booking")} 
                      className="text-primary"
                    />
                    <MenuLink 
                      icon={Info} 
                      text="About Us" 
                      onClick={() => navigate("/about")} 
                    />
                    <MenuLink 
                      icon={MessageSquare} 
                      text="Services" 
                      onClick={() => navigate("/services")} 
                    />
                    <MenuLink 
                      icon={Phone} 
                      text="Contact" 
                      onClick={() => navigate("/contact")} 
                    />

                    <Separator className="my-4" />
                    
                    {/* Mobile Auth Section */}
                    {session ? (
                      <>
                        <MenuLink 
                          icon={UserRound}
                          text="Profile"
                          onClick={handleProfileClick}
                        />
                        {isGuest && (
                          <MenuLink 
                            icon={Briefcase}
                            text="Become a Service Provider"
                            onClick={() => navigate("/register/service-provider")}
                            className="text-primary"
                          />
                        )}
                        {isAdminUser && (
                          <MenuLink 
                            icon={HomeIcon}
                            text="Admin Dashboard"
                            onClick={() => navigate("/admin")}
                            className="text-primary"
                          />
                        )}
                        {isServiceProvider && (
                          <>
                            <MenuLink 
                              icon={Briefcase}
                              text="Provider Dashboard"
                              onClick={() => navigate("/dashboard")}
                              className="text-primary"
                            />
                            <MenuLink 
                              icon={Plus}
                              text="Add New Service"
                              onClick={() => navigate("/service/add")}
                              className="text-primary"
                            />
                          </>
                        )}
                        <Separator className="my-4" />
                        <MenuLink 
                          icon={LogOut}
                          text="Sign Out"
                          onClick={handleSignOut}
                          className="text-destructive hover:text-destructive/90"
                        />
                      </>
                    ) : (
                      <>
                        <MenuLink 
                          icon={UserRound}
                          text="Sign In"
                          onClick={() => navigate("/auth/login")}
                          className="text-primary"
                        />
                        <MenuLink 
                          icon={Plus}
                          text="Join Us"
                          onClick={() => navigate("/register")}
                          className="text-primary"
                        />
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
