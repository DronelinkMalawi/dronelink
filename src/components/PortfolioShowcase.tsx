import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image_url: string;
  category: string;
  client: string;
  project_date: string;
  is_featured: boolean;
}

const PortfolioShowcase = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-block mb-4 border border-cyan-500/30 px-4 py-2 text-sm font-medium tracking-wide text-cyan-400">
              PORTFOLIO
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Featured <span className="text-cyan-400">Projects</span>
            </h2>
          </div>
          <Link to="/portfolio" className="mt-6 md:mt-0">
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:text-white">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading projects...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <Link key={item.id} to={`/portfolio/${item.slug}`} className="group">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:bg-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 h-full">
                  <div className="aspect-video bg-slate-700 relative overflow-hidden">
                    {item.featured_image_url ? (
                      <img
                        src={item.featured_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🖼️</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-cyan-600/90 text-white">
                        {item.category}
                      </Badge>
                    </div>
                    {item.is_featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-yellow-900">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {item.client && <span>{item.client}</span>}
                      {item.project_date && <span>{new Date(item.project_date).getFullYear()}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-gray-400">
              Featured projects will appear here once added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioShowcase;