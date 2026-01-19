import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, Eye, Clock, Tag, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Author {
  name: string;
  profile_image_url: string;
  bio: string;
}

interface Category {
  name: string;
  slug: string;
  color: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  author_name: string;
  author_profile_image: string;
  author_bio: string;
  category_name: string;
  category_slug: string;
  category_color: string;
  published_at: string;
  reading_time_minutes: number;
  view_count: number;
  is_featured: boolean;
  tags: BlogTag[];
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTags]);

  const fetchBlogData = async () => {
    try {
      const [postsRes, categoriesRes, tagsRes, featuredRes] = await Promise.all([
        supabase
          .from('blog_posts_with_details')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false }),
        supabase
          .from('blog_categories')
          .select('*')
          .order('name'),
        supabase
          .from('blog_tags')
          .select('*')
          .order('name'),
        supabase.rpc('get_featured_posts', { limit_count: 3 })
      ]);

      if (postsRes.error) throw postsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (tagsRes.error) throw tagsRes.error;
      if (featuredRes.error) throw featuredRes.error;

      setPosts(postsRes.data || []);
      setCategories(categoriesRes.data || []);
      setTags(tagsRes.data || []);
      setFeaturedPosts(featuredRes.data || []);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category_slug === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
                       post.tags?.some(tag => selectedTags.includes(tag.slug));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags(prev => 
      prev.includes(tagSlug) 
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center text-white">Loading blog posts...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-xl text-gray-300 mb-8">
            Insights, tutorials, and news from the world of drone technology
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Featured Posts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-slate-700 relative">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-slate-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <Tag className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-400">No image</p>
                          </div>
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">
                        Featured
                      </Badge>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.reading_time_minutes} min read</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        <Link to={`/blog/${post.slug}`} className="hover:text-blue-400 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                            {post.author_profile_image ? (
                              <img
                                src={post.author_profile_image}
                                alt={post.author_name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <span className="text-sm text-gray-300">{post.author_name}</span>
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug} className="text-white">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 4).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.slug)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedTags.includes(tag.slug)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentPosts.map((post) => (
                <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-slate-700 relative">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <Tag className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-gray-400 text-sm">No image</p>
                          </div>
                        </div>
                      )}
                      {post.category_name && (
                        <Badge 
                          className="absolute top-4 left-4"
                          style={{ 
                            backgroundColor: post.category_color + '20',
                            color: post.category_color,
                            borderColor: post.category_color + '40'
                          }}
                        >
                          {post.category_name}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.reading_time_minutes} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.view_count}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        <Link to={`/blog/${post.slug}`} className="hover:text-blue-400 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                            {post.author_profile_image ? (
                              <img
                                src={post.author_profile_image}
                                alt={post.author_name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-300">{post.author_name}</span>
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Read More →
                        </Link>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-700">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs bg-slate-700 text-gray-300">
                              {tag.name}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No posts found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
                ? 'Try adjusting your filters or search terms.'
                : 'No blog posts have been published yet.'}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;