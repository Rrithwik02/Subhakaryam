import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRound } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Button 
            variant="ghost" 
            className="font-display text-xl text-ceremonial-maroon hover:text-ceremonial-gold"
            onClick={() => navigate("/")}
          >
            Subhakaryam
          </Button>

          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex space-x-4">
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-gray-600 hover:text-ceremonial-gold transition-colors cursor-pointer"
                    onClick={() => navigate("/about")}
                  >
                    About Us
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-gray-600 hover:text-ceremonial-gold transition-colors cursor-pointer"
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
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className="text-gray-600 hover:text-ceremonial-gold transition-colors cursor-pointer"
                    onClick={() => navigate("/contact")}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {session && (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-ceremonial-maroon hover:text-ceremonial-gold"
                  onClick={handleProfileClick}
                >
                  <UserRound className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;