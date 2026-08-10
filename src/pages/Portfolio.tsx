import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Search, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image_url: string;
  category: string;
  client: string;
  project_date: string;
  technologies: string[];
  is_featured: boolean;
  created_at: string;
}

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(portfolioItems.map(item => item.category)))];

  const filteredItems = portfolioItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredItems = filteredItems.filter(item => item.is_featured);
  const regularItems = filteredItems.filter(item => !item.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading portfolio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Portfolio</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Explore our successful drone projects and see how we've helped clients achieve their goals.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects, clients, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-white mb-2">No portfolio items found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'Portfolio items will appear here once added through the admin panel.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Featured Items */}
            {featuredItems.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredItems.map((item) => (
                    <Link key={item.id} to={`/portfolio/${item.slug}`} className="group">
                      <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 h-full">
                        <div className="aspect-video bg-slate-700 relative overflow-hidden">
                          {item.featured_image_url ? (
                            <img
                              src={item.featured_image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <div className="text-4xl">🖼️</div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-blue-600/90 text-white">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-yellow-500 text-yellow-900">
                              ★ Featured
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                          <p className="text-gray-300 mb-4 line-clamp-3">{item.description}</p>

                          <div className="space-y-3">
                            <div className="text-sm text-gray-400">
                              Client: {item.client}
                            </div>

                            <div className="text-sm text-gray-400">
                              Completed: {new Date(item.project_date).toLocaleDateString()}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {item.technologies.slice(0, 3).map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                                  {tech}
                                </Badge>
                              ))}
                              {item.technologies.length > 3 && (
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  +{item.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                            <span className="text-sm text-blue-400 group-hover:text-blue-300 font-medium">
                              View Project
                            </span>
                            <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Items */}
            {regularItems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">All Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularItems.map((item) => (
                    <Link key={item.id} to={`/portfolio/${item.slug}`} className="group">
                      <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-700/50 hover:border-blue-500/30 transition-all duration-300 h-full">
                        <div className="aspect-video bg-slate-700 relative overflow-hidden">
                          {item.featured_image_url ? (
                            <img
                              src={item.featured_image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <div className="text-4xl">🖼️</div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-blue-600/90 text-white">
                              {item.category}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                          <p className="text-gray-300 mb-4 line-clamp-3">{item.description}</p>

                          <div className="space-y-3">
                            <div className="text-sm text-gray-400">
                              Client: {item.client}
                            </div>

                            <div className="text-sm text-gray-400">
                              Completed: {new Date(item.project_date).toLocaleDateString()}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {item.technologies.slice(0, 3).map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                                  {tech}
                                </Badge>
                              ))}
                              {item.technologies.length > 3 && (
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  +{item.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                            <span className="text-sm text-blue-400 group-hover:text-blue-300 font-medium">
                              View Project
                            </span>
                            <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;