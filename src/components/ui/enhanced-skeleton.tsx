import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "shimmer" | "pulse"
}

function EnhancedSkeleton({
  className,
  variant = "shimmer",
  ...props
}: SkeletonProps) {
  const variants = {
    default: "animate-pulse bg-muted",
    shimmer: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer",
    pulse: "animate-pulse-gold bg-primary/10"
  }

  return (
    <div
      className={cn(
        "rounded-md",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

// Service Card Skeleton Component
function ServiceCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl shadow-md p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <EnhancedSkeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <EnhancedSkeleton className="h-4 w-3/4" />
          <EnhancedSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <EnhancedSkeleton className="h-3 w-full" />
        <EnhancedSkeleton className="h-3 w-2/3" />
      </div>
      <div className="flex justify-between items-center">
        <EnhancedSkeleton className="h-4 w-20" />
        <EnhancedSkeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  )
}

export { EnhancedSkeleton, ServiceCardSkeleton }