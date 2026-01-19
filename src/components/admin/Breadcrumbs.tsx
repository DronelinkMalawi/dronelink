import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumbs = ({ 
  items: propItems, 
  separator = <ChevronRight className="h-4 w-4" />, 
  className 
}: BreadcrumbsProps) => {
  const location = useLocation();

  // Auto-generate breadcrumbs based on current route if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/admin', icon: <Home className="h-4 w-4" /> }
    ];

    if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'admin')) {
      return breadcrumbs;
    }

    // Skip 'admin' segment if present
    const startIndex = pathSegments[0] === 'admin' ? 1 : 0;
    let currentPath = '/admin';

    for (let i = startIndex; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;
      
      // Format the segment name
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Special cases for better formatting
      switch (segment) {
        case 'portfolio':
          label = 'Portfolio';
          break;
        case 'team':
          label = 'Team Management';
          break;
        case 'blog':
          label = 'Blog Management';
          break;
        case 'authors':
          label = 'Authors';
          break;
        case 'analytics':
          label = 'Analytics';
          break;
        case 'settings':
          label = 'Settings';
          break;
      }

      // Only make it a link if it's not the last item
      const isLast = i === pathSegments.length - 1;
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    }

    return breadcrumbs;
  };

  const items = propItems || generateBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500">{separator}</span>}
          {item.href ? (
            <Link
              to={item.href}
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 text-white font-medium">
              {item.icon}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;