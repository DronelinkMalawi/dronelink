import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Images,
  Plus,
  Upload,
  FolderOpen,
  Users,
  User,
  BarChart3,
  Settings
} from 'lucide-react';

interface NavAction {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  description?: string;
  actions?: NavAction[];
}

interface AdminNavigationProps {
  orientation?: 'horizontal' | 'vertical';
  showActions?: boolean;
  className?: string;
}

const AdminNavigation = ({ 
  orientation = 'horizontal', 
  showActions = true,
  className 
}: AdminNavigationProps) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Admin dashboard'
    },
    {
      label: 'Blog',
      href: '/admin/dashboard/blog',
      icon: <FileText className="h-4 w-4" />,
      description: 'Manage blog posts',
      actions: [
        {
          label: 'New Post',
          href: '/admin/dashboard/blog/new',
          icon: <Plus className="h-3 w-3" />
        }
      ]
    },
    {
      label: 'Images',
      href: '/admin/dashboard/images',
      icon: <Images className="h-4 w-4" />,
      description: 'Manage image gallery',
      actions: [
        {
          label: 'Upload Images',
          href: '/admin/dashboard/images/upload',
          icon: <Upload className="h-3 w-3" />
        }
      ]
    },
    {
      label: 'Portfolio',
      href: '/admin/dashboard/portfolio',
      icon: <FolderOpen className="h-4 w-4" />,
      description: 'Manage portfolio projects',
      actions: [
        {
          label: 'Add Project',
          href: '/admin/dashboard/portfolio/new',
          icon: <Plus className="h-3 w-3" />
        },
        {
          label: 'Upload Images',
          href: '/admin/dashboard/portfolio/upload',
          icon: <Upload className="h-3 w-3" />
        }
      ]
    },
    {
      label: 'Team',
      href: '/admin/dashboard/team',
      icon: <Users className="h-4 w-4" />,
      description: 'Manage team members',
      actions: [
        {
          label: 'Add Member',
          href: '/admin/dashboard/team/new',
          icon: <Plus className="h-3 w-3" />
        }
      ]
    },
    {
      label: 'Authors',
      href: '/admin/dashboard/authors',
      icon: <User className="h-4 w-4" />,
      description: 'Manage blog authors',
      actions: [
        {
          label: 'Add Author',
          href: '/admin/dashboard/authors/new',
          icon: <Plus className="h-3 w-3" />
        }
      ]
    },
    {
      label: 'Analytics',
      href: '/admin/dashboard/analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'View analytics'
    },
    {
      label: 'Settings',
      href: '/admin/dashboard/settings',
      icon: <Settings className="h-4 w-4" />,
      description: 'Site settings'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  if (orientation === 'vertical') {
    return (
      <nav className={cn("space-y-2", className)}>
        {navItems.map((item) => (
          <div key={item.href} className="space-y-1">
            <Link to={item.href}>
<Button
              variant={isActive(item.href) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive(item.href) 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:text-white hover:bg-slate-700"
              )}
            >
              {React.cloneElement(item.icon as React.ReactElement, { className: "h-4 w-4 mr-3" })}
              <span>{item.label}</span>
            </Button>
            </Link>
            
            {showActions && item.actions && isActive(item.href) && (
              <div className="ml-8 space-y-1">
                {item.actions.map((action) => (
                  <Link key={action.href} to={action.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-700"
                    >
                      {React.cloneElement(action.icon as React.ReactElement, { className: "h-3 w-3 mr-2" })}
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("flex items-center space-x-1", className)}>
      {navItems.map((item) => (
        <div key={item.href} className="relative group">
          <Link to={item.href}>
            <Button
              variant={isActive(item.href) ? "default" : "ghost"}
              className={cn(
                "flex items-center space-x-2",
                isActive(item.href) 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:text-white hover:bg-slate-700"
              )}
            >
              {React.cloneElement(item.icon as React.ReactElement, { className: "h-4 w-4" })}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          </Link>

          {/* Tooltip */}
          {item.description && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {item.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}

          {/* Action buttons dropdown */}
          {showActions && item.actions && (
            <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 min-w-[150px]">
              <div className="py-1">
                {item.actions.map((action) => (
                  <Link key={action.href} to={action.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
                    >
                      {React.cloneElement(action.icon as React.ReactElement, { className: "h-3 w-3 mr-2" })}
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default AdminNavigation;