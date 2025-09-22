import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm text-ceremonial-brown", className)}
    >
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 && <Home className="h-4 w-4 mr-1" />}
          
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-ceremonial-gold transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ceremonial-maroon font-medium">
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;