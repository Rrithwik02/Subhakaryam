import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobileFeatures } from '@/hooks/use-mobile-features';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function ShareButton({ 
  title = "Check out this service", 
  text, 
  url, 
  variant = "outline",
  size = "sm",
  className 
}: ShareButtonProps) {
  const { shareContent, triggerHaptic, isNative } = useMobileFeatures();

  const handleShare = async () => {
    try {
      triggerHaptic('light');
      const shareUrl = url || window.location.href;
      await shareContent({
        title,
        text,
        url: shareUrl
      });
    } catch (error) {
      // Fallback to web share API or copy to clipboard
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text,
            url: url || window.location.href
          });
        } catch (shareError) {
          // User cancelled sharing
        }
      } else {
        // Copy to clipboard as fallback
        await navigator.clipboard.writeText(url || window.location.href);
      }
    }
  };

  // Only show on mobile or if web share API is available
  if (!isNative && !navigator.share) {
    return null;
  }

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={className}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}