import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, Menu } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const navigate = useNavigate();
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

  const NavLinks = () => (
    <>
      <NavigationMenuLink 
        className="text-gray-700 hover:text-ceremonial-maroon transition-colors cursor-pointer py-2 px-6"
        onClick={() => navigate("/about")}
      >
        About Us
      </NavigationMenuLink>
      <NavigationMenuLink 
        className="text-gray-700 hover:text-ceremonial-maroon transition-colors cursor-pointer py-2 px-6"
        onClick={() => {
          const servicesSection = document.getElementById('services-section');
          if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            navigate("/#services");
          }
        }}
      >
        Services
      </NavigationMenuLink>
      <NavigationMenuLink 
        className="text-gray-700 hover:text-ceremonial-maroon transition-colors cursor-pointer py-2 px-6"
        onClick={() => navigate("/contact")}
      >
        Contact
      </NavigationMenuLink>
    </>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ceremonial-cream border-b border-ceremonial-gold/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Button 
            variant="ghost" 
            className="font-display text-2xl text-ceremonial-maroon hover:text-ceremonial-maroon/90 transition-colors p-0"
            onClick={() => navigate("/")}
          >
            Subhakaryam
          </Button>

          <div className="flex items-center gap-8">
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="flex space-x-2">
                <NavigationMenuItem>
                  <NavLinks />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

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
                <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-ceremonial-cream">
                  <nav className="flex flex-col gap-2 mt-8">
                    <NavLinks />
                  </nav>
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