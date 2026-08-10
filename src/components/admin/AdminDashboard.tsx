import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, BarChart3, Settings, Image, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useTeam } from '@/contexts/TeamContext';

const AdminDashboard = () => {
  const { teamMembers } = useTeam();
  const [stats, setStats] = useState([
    {
      title: 'Portfolio Items',
      value: '0',
      icon: Image,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      loading: true
    },
    {
      title: 'Blog Posts',
      value: '0',
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      loading: true
    },
    {
      title: 'Authors',
      value: '0',
      icon: UserIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      loading: true
    },
    {
      title: 'Team Members',
      value: '0',
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      loading: true
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<Array<{ type: string; message: string; time: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const fetchDashboardData = async () => {
    try {
      // Fetch portfolio items count
      const { count: portfolioCount, error: portfolioError } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true });

      // Fetch blog posts count
      const { count: blogCount, error: blogError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Fetch authors count
      const { count: authorCount, error: authorError } = await supabase
        .from('authors')
        .select('*', { count: 'exact', head: true });

      if (portfolioError) throw portfolioError;
      if (blogError) throw blogError;
      if (authorError) throw authorError;

      setStats([
        {
          title: 'Portfolio Items',
          value: portfolioCount?.toString() || '0',
          icon: Image,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          loading: false
        },
        {
          title: 'Blog Posts',
          value: blogCount?.toString() || '0',
          icon: FileText,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          loading: false
        },
        {
          title: 'Authors',
          value: authorCount?.toString() || '0',
          icon: UserIcon,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          loading: false
        },
        {
          title: 'Team Members',
          value: teamMembers.length.toString(),
          icon: Users,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          loading: false
        }
      ]);

      // Fetch recent activity from multiple sources
      const [recentPortfolio, recentBlog] = await Promise.all([
        supabase
          .from('portfolio_items')
          .select('title, created_at')
          .order('created_at', { ascending: false })
          .limit(2),
        supabase
          .from('blog_posts')
          .select('title, created_at')
          .order('created_at', { ascending: false })
          .limit(2)
      ]);

      const activities: Array<{ type: string; message: string; time: string }> = [];
      
      if (!recentPortfolio.error && recentPortfolio.data) {
        recentPortfolio.data.forEach(item => {
          activities.push({
            type: 'portfolio',
            message: `Portfolio item "${item.title}" was added`,
            time: new Date(item.created_at).toLocaleDateString()
          });
        });
      }

      if (!recentBlog.error && recentBlog.data) {
        recentBlog.data.forEach(item => {
          activities.push({
            type: 'blog',
            message: `Blog post "${item.title}" was created`,
            time: new Date(item.created_at).toLocaleDateString()
          });
        });
      }

      // Sort by date and take latest 3
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activities.slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set loading to false even on error
      setStats(prev => prev.map(stat => ({ ...stat, loading: false })));
    } finally {
      setLoading(false);
    }
  };

const quickActions = [
    {
      title: 'Manage Portfolio',
      description: 'Add, edit, or remove portfolio items',
      icon: Image,
      link: '/admin/dashboard/portfolio',
      color: 'text-blue-400'
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      icon: FileText,
      link: '/admin/dashboard/blog',
      color: 'text-green-400'
    },
    {
      title: 'Author Management',
      description: 'Manage blog authors and profiles',
      icon: UserIcon,
      link: '/admin/dashboard/authors',
      color: 'text-purple-400'
    },
    {
      title: 'Team Management',
      description: 'Manage team member profiles',
      icon: Users,
      link: '/admin/dashboard/team',
      color: 'text-orange-400'
    },
    {
      title: 'Analytics',
      description: 'View site analytics and reports',
      icon: BarChart3,
      link: '/admin/dashboard/analytics',
      color: 'text-yellow-400'
    },
    {
      title: 'Settings',
      description: 'Configure application settings',
      icon: Settings,
      link: '/admin/dashboard/settings',
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage your DroneLink application</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-slate-700/50`}>
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{action.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;