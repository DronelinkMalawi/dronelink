import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

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
    <section className="py-24 lg:py-28 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-400/90">
              <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
              Portfolio
            </p>
            <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Featured projects
            </h2>
            <p className="mt-4 text-lg text-slate-300/90">
              A selection of missions that show what precision aerial data can deliver.
            </p>
          </div>
          <Link to="/portfolio" className="shrink-0">
            <Button variant="outline" className="border border-white/15 text-white hover:bg-slate-800">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading projects...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.slug}`}
                className="group rounded-2xl bg-slate-900 border border-white/10 overflow-hidden hover:border-cyan-400/40 transition-colors h-full"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-800">
                  {item.featured_image_url ? (
                    <img
                      src={item.featured_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  )}
                  {item.category && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-cyan-500/15 text-cyan-300 rounded-full">{item.category}</Badge>
                    </div>
                  )}
                  {item.is_featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-yellow-900 rounded-full">Featured</Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-slate-950/40 flex items-center justify-center rounded-2xl">
                    <span className="text-white bg-slate-950/70 rounded-full p-3">
                      <ArrowUpRight className="w-6 h-6" />
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                    {item.client && <span>{item.client}</span>}
                    {item.project_date && <span>{new Date(item.project_date).getFullYear()}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-14">
            <div className="text-5xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-slate-400">Featured projects will appear here once added.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioShowcase;