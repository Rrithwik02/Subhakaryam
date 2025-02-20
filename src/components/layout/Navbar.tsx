
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, Menu, MessageSquare, HomeIcon, Phone, Info, Plus, ArrowLeft, Briefcase } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSessionContext();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return profile;
    },
    enabled: !!session?.user,
  });

  const showBackButton = location.pathname !== '/';

  const handleProfileClick = () => {
    if (!session) {
      navigate("/login");
      return;
    }

    if (userProfile?.user_type === "service_provider") {
      navigate("/provider/profile");
    } else {
      navigate("/profile");
    }
  };

  const isServiceProvider = userProfile?.user_type === "service_provider";
  const isAdmin = userProfile?.user_type === "admin";

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
      <NavigationMenuList className="hidden md:flex items-center">
        {showBackButton && (
          <NavigationMenuItem>
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </NavigationMenuItem>
        )}
        
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
            onClick={() => navigate("/contact")}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        {!session && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className="text-ceremonial-gold hover:text-ceremonial-gold/90 transition-colors cursor-pointer py-2 px-6 font-semibold"
              onClick={() => navigate("/register/service-provider")}
            >
              Become a Service Provider
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {session && isServiceProvider && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors cursor-pointer py-2 px-6"
              onClick={() => navigate("/dashboard")}
            >
              Provider Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {session && isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors cursor-pointer py-2 px-6"
              onClick={() => navigate("/admin")}
            >
              Admin Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {session && isServiceProvider && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className="text-ceremonial-gold hover:text-ceremonial-gold/90 transition-colors cursor-pointer py-2 px-6"
              onClick={() => navigate("/service/add")}
            >
              Add New Service
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ceremonial-cream border-b border-ceremonial-gold/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {showBackButton && (
              <Button
                variant="ghost"
                className="mr-4 md:hidden"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              className="font-display text-2xl text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors p-0"
              onClick={() => navigate("/")}
            >
              Subhakaryam
            </Button>
          </div>

          <div className="flex items-center gap-8">
            <NavLinks />

            <div className="flex items-center gap-4">
              {session && <NotificationBell />}
              
              <Button
                variant="ghost"
                size="icon"
                className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors"
                onClick={handleProfileClick}
              >
                <UserRound className="h-5 w-5" />
              </Button>
              
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

                    {!session && (
                      <MenuLink 
                        icon={Briefcase}
                        text="Become a Service Provider"
                        onClick={() => navigate("/register/service-provider")}
                        className="text-ceremonial-gold"
                      />
                    )}

                    {session && (
                      <>
                        <Separator className="my-4" />
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
                        {isAdmin && (
                          <MenuLink 
                            icon={Briefcase}
                            text="Admin Dashboard"
                            onClick={() => navigate("/admin")}
                            className="text-ceremonial-maroon"
                          />
                        )}
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
