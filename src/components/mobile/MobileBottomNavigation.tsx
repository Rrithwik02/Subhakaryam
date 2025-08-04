import { Home, Search, Heart, User, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMobileFeatures } from '@/hooks/use-mobile-features';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Heart, label: 'Favorites', path: '/profile?tab=favorites' },
  { icon: MessageCircle, label: 'Messages', path: '/profile?tab=messages' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function MobileBottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { triggerHaptic } = useMobileFeatures();

  const handleNavigation = (path: string) => {
    triggerHaptic('light');
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors",
                "min-w-[60px] min-h-[50px]",
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", active && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}