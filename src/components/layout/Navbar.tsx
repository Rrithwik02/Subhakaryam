import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

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
        </div>
      </div>
    </div>
  );
};

export default Navbar;