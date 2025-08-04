import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useMobileFeatures } from '@/hooks/use-mobile-features';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function PullToRefresh({ onRefresh, children, className = '' }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const { triggerHaptic, isNative } = useMobileFeatures();

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const pullDistance = Math.max(0, Math.min(currentY.current - startY.current, MAX_PULL));

    if (pullDistance > 0) {
      e.preventDefault();
      setPullDistance(pullDistance);
      setIsPulling(pullDistance > PULL_THRESHOLD);
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling && !isRefreshing) {
      setIsRefreshing(true);
      triggerHaptic('medium');
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    if (!isNative) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isNative]);

  return (
    <div className={`relative ${className}`}>
      {/* Pull indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center bg-background/90 backdrop-blur-sm z-50 transition-all duration-200"
          style={{ 
            height: Math.max(pullDistance, isRefreshing ? 60 : 0),
            transform: `translateY(${isRefreshing ? 0 : pullDistance - 60}px)`
          }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw 
              className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''} ${isPulling ? 'text-primary' : ''}`} 
            />
            <span className="text-sm font-medium">
              {isRefreshing ? 'Refreshing...' : isPulling ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}