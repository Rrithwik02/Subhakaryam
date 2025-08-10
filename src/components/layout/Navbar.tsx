
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, Menu, MessageSquare, HomeIcon, Phone, Info, Plus, Briefcase, LogOut } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();

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
  const isAdmin = userProfile?.user_type === "admin";
  const isGuest = userProfile?.user_type === "guest" || !userProfile?.user_type;

  const MenuLink = ({ icon: Icon, text, onClick, className = "" }) => (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-2 px-4 py-6 text-lg font-medium text-gray-700 hover:text-ceremonial-maroon hover:bg-ceremonial-cream/50 transition-colors ${className}`}
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
            className="text-gray-700 hover:text-ceremonial-maroon transition-colors cursor-pointer py-2 px-6"
            onClick={() => navigate("/about")}
          >
            About Us
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-gray-700 hover:text-ceremonial-maroon transition-colors cursor-pointer py-2 px-6"
            onClick={() => navigate("/services")}
          >
            Services
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-gray-700 hover:text-ceremonial-maroon transition-colors cursor-pointer py-2 px-6"
            onClick={() => navigate("/blog")}
          >
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-gray-700 hover:text-ceremonial-maroon transition-colors cursor-pointer py-2 px-6"
            onClick={() => navigate("/contact")}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Become a Service Provider Link (show when logged in as guest) */}
        {session && isGuest && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className="text-ceremonial-gold hover:text-ceremonial-gold/90 transition-colors cursor-pointer py-2 px-6 font-semibold"
              onClick={() => navigate("/register/service-provider")}
            >
              <Briefcase className="h-4 w-4 inline-block mr-2" />
              Become a Service Provider
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {/* Dashboard Links */}
        {session && (
          <>
            {isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors cursor-pointer py-2 px-6"
                  onClick={() => navigate("/admin")}
                >
                  <HomeIcon className="h-4 w-4 inline-block mr-2" />
                  Admin Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {isServiceProvider && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors cursor-pointer py-2 px-6"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Briefcase className="h-4 w-4 inline-block mr-2" />
                    Provider Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-ceremonial-gold hover:text-ceremonial-gold/90 transition-colors cursor-pointer py-2 px-6"
                    onClick={() => navigate("/service/add")}
                  >
                    <Plus className="h-4 w-4 inline-block mr-2" />
                    Add New Service
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ceremonial-cream border-b border-ceremonial-gold/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent"
            onClick={() => navigate("/")}
          >
            <img 
              src="/lovable-uploads/eae6e160-ff8e-40a8-b8b9-5d3f1eaafee1.png" 
              alt="Subhakaryam Logo" 
              className="h-12"
            />
          </Button>

          <div className="flex items-center gap-8">
            <NavLinks />

            <div className="flex items-center gap-4">
              {session && <NotificationBell />}
              
              {session ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors"
                    onClick={handleProfileClick}
                  >
                    <UserRound className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-2 text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white transition-colors"
                    onClick={() => navigate("/auth/login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white transition-colors"
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
                    className="md:hidden text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-white p-0">
                  <SheetHeader className="p-6 bg-ceremonial-cream">
                    <SheetTitle className="text-2xl font-display text-ceremonial-maroon">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-4">
                    <MenuLink 
                      icon={HomeIcon} 
                      text="Home" 
                      onClick={() => navigate("/")} 
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
                            className="text-ceremonial-gold"
                          />
                        )}
                        {isAdmin && (
                          <MenuLink 
                            icon={HomeIcon}
                            text="Admin Dashboard"
                            onClick={() => navigate("/admin")}
                            className="text-ceremonial-maroon"
                          />
                        )}
                        {isServiceProvider && (
                          <>
                            <MenuLink 
                              icon={Briefcase}
                              text="Provider Dashboard"
                              onClick={() => navigate("/dashboard")}
                              className="text-ceremonial-maroon"
                            />
                            <MenuLink 
                              icon={Plus}
                              text="Add New Service"
                              onClick={() => navigate("/service/add")}
                              className="text-ceremonial-gold"
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
                          className="text-ceremonial-gold"
                        />
                        <MenuLink 
                          icon={Plus}
                          text="Join Us"
                          onClick={() => navigate("/register")}
                          className="text-ceremonial-maroon"
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
