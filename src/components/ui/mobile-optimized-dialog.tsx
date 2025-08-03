import { DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface MobileOptimizedDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  children: React.ReactNode;
}

export const MobileOptimizedDialogContent = forwardRef<
  React.ElementRef<typeof DialogContent>,
  MobileOptimizedDialogContentProps
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  
  return (
    <DialogContent
      ref={ref}
      className={cn(
        "flex flex-col",
        isMobile 
          ? "h-[100vh] max-h-[100vh] w-[100vw] max-w-[100vw] rounded-none p-4" 
          : "sm:max-w-[700px] max-h-[90vh]",
        className
      )}
      {...props}
    >
      {children}
    </DialogContent>
  );
});

MobileOptimizedDialogContent.displayName = "MobileOptimizedDialogContent";