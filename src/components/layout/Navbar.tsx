
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, Menu, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ceremonial-cream/95 backdrop-blur-md border-b border-ceremonial-maroon/10 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent"
            onClick={() => navigate("/")}
          >
            <img 
              src="/logo.png" 
              alt="Subhakary Logo" 
              className="h-10 transition-transform hover:scale-105"
            />
          </Button>

          {/* CENTER: Menu Items in Pill Container */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-ceremonial-maroon/10 rounded-full px-3 py-2">
            <button
              onClick={() => navigate("/about")}
              className="text-ceremonial-maroon/80 hover:text-ceremonial-maroon transition-all text-sm font-medium px-4 py-2 rounded-full hover:bg-ceremonial-maroon/5"
            >
              {t('nav.about')}
            </button>
            
            <button
              onClick={() => navigate("/services")}
              className="text-ceremonial-maroon/80 hover:text-ceremonial-maroon transition-all text-sm font-medium px-4 py-2 rounded-full hover:bg-ceremonial-maroon/5"
            >
              {t('nav.services')}
            </button>

            <button
              onClick={() => navigate("/blog")}
              className="text-ceremonial-maroon/80 hover:text-ceremonial-maroon transition-all text-sm font-medium px-4 py-2 rounded-full hover:bg-ceremonial-maroon/5"
            >
              {t('nav.blog')}
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="text-ceremonial-maroon/80 hover:text-ceremonial-maroon transition-all text-sm font-medium px-4 py-2 rounded-full hover:bg-ceremonial-maroon/5"
            >
              {t('nav.contact')}
            </button>

            <button
              onClick={() => navigate("/track-booking")}
              className="text-ceremonial-maroon/80 hover:text-ceremonial-maroon transition-all text-sm font-medium px-4 py-2 rounded-full hover:bg-ceremonial-maroon/5"
            >
              {t('nav.trackBooking')}
            </button>
          </nav>

          {/* RIGHT: Login + Join Us Button + Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notification Bell - Only for Logged In Users */}
            {session && <NotificationBell />}

            {/* User Menu or Auth Buttons */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 transition-all"
                    aria-label={t('nav.profile')}
                  >
                    <UserRound className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-ceremonial-cream border-ceremonial-maroon/20 min-w-[200px]"
                >
                  <DropdownMenuItem 
                    onClick={handleProfileClick}
                    className="text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                  >
                    <UserRound className="mr-2 h-4 w-4" />
                    <span>{t('nav.profile')}</span>
                  </DropdownMenuItem>
                  {(isAdmin || isServiceProvider) && (
                    <DropdownMenuItem 
                      onClick={() => navigate('/dashboard')}
                      className="text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('nav.dashboard')}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-ceremonial-maroon/10" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="hidden lg:inline-flex text-ceremonial-maroon/80 hover:text-ceremonial-maroon transition-all text-sm font-medium px-4 py-2"
                >
                  {t('nav.signIn')}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg transition-all"
                >
                  {t('nav.joinUs')}
                </button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                  aria-label={t('nav.menu')}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-ceremonial-cream w-[300px] sm:w-[400px] text-ceremonial-maroon">
                <nav className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    className="justify-start text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                    onClick={() => navigate("/")}
                  >
                    {t('nav.home')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                    onClick={() => navigate("/about")}
                  >
                    {t('nav.about')}
                  </Button>
                  
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="justify-start text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                      >
                        {t('nav.services')}
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-2 mt-2">
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/photography")}
                      >
                        {t('nav.services_photography')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/catering")}
                      >
                        {t('nav.services_catering')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/decoration")}
                      >
                        {t('nav.services_decoration')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/pooja")}
                      >
                        {t('nav.services_pooja')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/mehendi")}
                      >
                        {t('nav.services_mehendi')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/music")}
                      >
                        {t('nav.services_music')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/function-halls")}
                      >
                        {t('nav.services_halls')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-sm text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5 w-full"
                        onClick={() => navigate("/services/bundles")}
                      >
                        {t('nav.services_bundles')}
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>

                  <Button
                    variant="ghost"
                    className="justify-start text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                    onClick={() => navigate("/blog")}
                  >
                    {t('nav.blog')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                    onClick={() => navigate("/contact")}
                  >
                    {t('nav.contact')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                    onClick={() => navigate("/track-booking")}
                  >
                    {t('nav.trackBooking')}
                  </Button>

                  {!session && (
                    <>
                      <Separator className="my-2 bg-ceremonial-maroon/10" />
                      <Button
                        variant="ghost"
                        className="justify-start text-ceremonial-maroon/80 hover:text-ceremonial-maroon hover:bg-ceremonial-maroon/5"
                        onClick={() => navigate("/auth/login")}
                      >
                        {t('nav.signIn')}
                      </Button>
                      <button
                        className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white rounded-full shadow-lg px-6 py-3 text-sm font-semibold transition-all"
                        onClick={() => navigate("/register")}
                      >
                        {t('nav.joinUs')}
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;