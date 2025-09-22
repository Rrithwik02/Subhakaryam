import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';

interface PWAInstallProps {
  className?: string;
}

const PWAInstall = ({ className }: PWAInstallProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check for iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if dismissed in this session
  if (sessionStorage.getItem('pwa-install-dismissed') || isInstalled || !isVisible) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-ceremonial-gold rounded-full p-2">
            <Bell className="h-4 w-4 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-900 mb-1">
              Install Subhakaryam App
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              {isIOS 
                ? 'Add to your home screen for a better experience!'
                : 'Install our app for quick access and notifications!'
              }
            </p>
            
            <div className="flex gap-2">
              {isIOS ? (
                <div className="text-xs text-gray-500">
                  Tap the Share button and select "Add to Home Screen"
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleInstall}
                  className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white text-xs px-3 py-1"
                >
                  Install
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-xs px-2 py-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstall;