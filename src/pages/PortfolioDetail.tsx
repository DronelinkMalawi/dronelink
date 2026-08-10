import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featured_image_url: string;
  images: string[];
  category: string;
  tags: string[];
  client: string;
  project_date: string;
  technologies: string[];
  project_url: string;
  github_url: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchPortfolioItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchPortfolioItem = async () => {
    try {
      // Fetch the portfolio item by slug
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setItem(data);

      // Increment view count
      if (data) {
        await supabase
          .from('portfolio_items')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);
      }

      // Fetch related items in the same category
      if (data?.category) {
        const { data: related, error: relatedError } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('category', data.category)
          .eq('is_published', true)
          .neq('id', data.id)
          .limit(3);

        if (!relatedError) {
          setRelatedItems(related || []);
        }
      }
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading project...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">The portfolio item you're looking for doesn't exist or has been removed.</p>
          <Link to="/portfolio">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = [item.featured_image_url, ...(item.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link to="/portfolio" className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-blue-600 text-white">{item.category}</Badge>
            {item.is_featured && (
              <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>
            )}
            {item.tags?.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="border-slate-600 text-slate-300">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{item.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl">{item.description}</p>
        </div>

        {/* Main Image */}
        <div className="mb-12">
          <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            {allImages[activeImage] ? (
              <img
                src={allImages[activeImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-6xl">🖼️</div>
              </div>
            )}
          </div>

          {/* Image Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    activeImage === index ? 'border-blue-500' : 'border-transparent hover:border-slate-600'
                  }`}
                >
                  <img src={img} alt={`${item.title} - Image ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
              <div className="prose prose-invert max-w-none">
                {item.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Project Details</h3>
              <div className="space-y-4">
                {item.client && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Client</p>
                    <p className="text-white font-medium">{item.client}</p>
                  </div>
                )}
                {item.project_date && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
                    <p className="text-white font-medium">{new Date(item.project_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Views</p>
                  <p className="text-white font-medium">{item.view_count || 0}</p>
                </div>
              </div>
            </div>

            {/* Technologies */}
            {item.technologies && item.technologies.length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, index) => (
                    <Badge key={index} className="bg-slate-700 text-gray-200 border-slate-600">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(item.project_url || item.github_url) && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Project Links</h3>
                <div className="space-y-3">
                  {item.project_url && (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-slate-700/50 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                    >
                      <span>Live Project</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-4 py-3 bg-slate-700/50 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                    >
                      <span>Source Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Need Something Similar?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Let's discuss how we can help with your project.
              </p>
              <Link to="/get-quote">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold">
                  Get a Quote
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedItems.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((related) => (
                <Link key={related.id} to={`/portfolio/${related.slug}`}>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-700/50 transition-colors group">
                    <div className="aspect-video bg-slate-700 relative overflow-hidden">
                      {related.featured_image_url ? (
                        <img
                          src={related.featured_image_url}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-4xl">🖼️</div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-1 line-clamp-1">{related.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{related.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioDetail;