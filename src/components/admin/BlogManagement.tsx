import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Calendar, User, Eye, FileText, Search, Filter, FolderOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ImageGallery from './ImageGallery';

interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  profile_image_url: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_id: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  meta_title: string;
  meta_description: string;
  reading_time_minutes: number;
  view_count: number;
  like_count: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  author?: Author;
  category?: Category;
  tags?: Tag[];
}

const BlogManagement = () => {
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentUserAuthor, setCurrentUserAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    author_id: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title: '',
    meta_description: '',
    reading_time_minutes: 5,
    is_featured: false,
    tags: [] as string[]
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open add/edit dialog based on URL
  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      // Navigated to add new post page - open the dialog
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        featured_image_url: '',
        author_id: currentUserAuthor?.id || '',
        category_id: '',
        status: 'draft',
        meta_title: '',
        meta_description: '',
        reading_time_minutes: 5,
        is_featured: false,
        tags: []
      });
      setIsDialogOpen(true);
    } else if (params.postId) {
      // Navigated to edit post page - find and load the post
      const post = blogPosts.find(p => p.id === params.postId);
      if (post) {
        handleEdit(post);
      }
    }
  }, [location.pathname, params.postId, blogPosts, currentUserAuthor]);

  const fetchData = async () => {
    try {
      // First, ensure the current user has an author record
      if (user) {
        await ensureUserAuthor();
      }

      const [postsRes, authorsRes, categoriesRes, tagsRes] = await Promise.all([
        supabase
          .from('blog_posts_with_details')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('authors')
          .select('*')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('blog_categories')
          .select('*')
          .order('name'),
        supabase
          .from('blog_tags')
          .select('*')
          .order('name')
      ]);

      if (postsRes.error) throw postsRes.error;
      if (authorsRes.error) throw authorsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (tagsRes.error) throw tagsRes.error;

      // Map the view data to include nested author/category objects
      const mappedPosts = (postsRes.data || []).map((post) => ({
        ...post,
        author: post.author_name ? {
          id: post.author_id,
          name: post.author_name,
          email: post.author_email,
          bio: post.author_bio,
          profile_image_url: post.author_profile_image,
          is_active: true
        } : undefined,
        category: post.category_name ? {
          id: post.category_id,
          name: post.category_name,
          slug: post.category_slug,
          color: post.category_color || '#3B82F6'
        } : undefined,
        tags: Array.isArray(post.tags) ? post.tags : []
      })) as BlogPost[];

      setBlogPosts(mappedPosts);
      setAuthors(authorsRes.data || []);
      setCategories(categoriesRes.data || []);
      setTags(tagsRes.data || []);

      // Set current user author and auto-select in form
      if (user) {
        const userAuthor = authorsRes.data?.find(author => author.email === user.email);
        setCurrentUserAuthor(userAuthor || null);
        if (userAuthor) {
          setFormData(prev => ({ ...prev, author_id: userAuthor.id }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ensureUserAuthor = async () => {
    if (!user) return;

    try {
      // Check if author already exists for this user
      const { data: existingAuthor } = await supabase
        .from('authors')
        .select('*')
        .eq('email', user.email)
        .single();

      if (existingAuthor) {
        setCurrentUserAuthor(existingAuthor);
        return existingAuthor;
      }

      // Create new author record for the user
      const { data: newAuthor, error } = await supabase
        .from('authors')
        .insert({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
          email: user.email,
          bio: user.user_metadata?.bio || '',
          profile_image_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentUserAuthor(newAuthor);
      return newAuthor;
    } catch (error) {
      console.error('Error ensuring user author:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image_url: formData.featured_image_url,
        author_id: formData.author_id,
        category_id: formData.category_id || null,
        status: formData.status,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
        reading_time_minutes: formData.reading_time_minutes,
        is_featured: formData.is_featured,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      let postId: string;
      
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        postId = editingPost.id;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select();

        if (error) throw error;
        postId = data[0].id;
      }

      // Handle tags - always delete existing then re-insert if any selected
      // Delete existing tag relationships
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', postId);

      // Insert new tag relationships if any tags selected
      if (formData.tags.length > 0) {
        const tagRelations = formData.tags.map(tagId => ({
          post_id: postId,
          tag_id: tagId
        }));

        await supabase
          .from('blog_post_tags')
          .insert(tagRelations);
      }

      setIsDialogOpen(false);
      setEditingPost(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image_url: post.featured_image_url || '',
      author_id: post.author_id,
      category_id: post.category_id || '',
      status: post.status,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      reading_time_minutes: post.reading_time_minutes || 5,
      is_featured: post.is_featured,
      tags: post.tags?.map(tag => tag.id) || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      // Delete tag relationships first
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', id);

      // Delete the post
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featured_image_url: '',
      author_id: currentUserAuthor?.id || '',
      category_id: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      reading_time_minutes: 5,
      is_featured: false,
      tags: []
    });
    setEditingPost(null);
  };

  const openAddDialog = () => {
    setEditingPost(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesTags = selectedTags.length === 0 || 
                       post.tags?.some(tag => selectedTags.includes(tag.id));
    
    return matchesSearch && matchesStatus && matchesTags;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading blog posts...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
          <p className="text-gray-400">Manage your blog posts and content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">Author</Label>
                  <div className="bg-slate-700 border-slate-600 rounded-lg p-3 flex items-center space-x-3">
                    {currentUserAuthor?.profile_image_url ? (
                      <img
                        src={currentUserAuthor.profile_image_url}
                        alt={currentUserAuthor.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{currentUserAuthor?.name || 'Loading...'}</p>
                      <p className="text-gray-400 text-sm">{currentUserAuthor?.email || user?.email}</p>
                    </div>
                  </div>
                  <input type="hidden" value={currentUserAuthor?.id || ''} />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={2}
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-1">Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={8}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-white">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({...formData, status: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="draft" className="text-white">Draft</SelectItem>
                      <SelectItem value="published" className="text-white">Published</SelectItem>
                      <SelectItem value="archived" className="text-white">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-1">Tags</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={tag.id}
                        checked={formData.tags.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, tags: [...formData.tags, tag.id]});
                          } else {
                            setFormData({...formData, tags: formData.tags.filter(id => id !== tag.id)});
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-blue-600"
                      />
                      <Label htmlFor={tag.id} className="text-sm text-gray-300">{tag.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-1">Featured Image</Label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {formData.featured_image_url && (
                    <div className="relative">
                      <img
                        src={formData.featured_image_url}
                        alt="Featured image preview"
                        className="w-full h-48 object-cover rounded-lg border border-slate-600"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({...formData, featured_image_url: ''})}
                        className="absolute top-2 right-2 bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Image Selection Buttons */}
                  <div className="flex space-x-2">
                    <ImageGallery
                      onImageSelect={(images) => {
                        if (images.length > 0) {
                          setFormData({...formData, featured_image_url: images[0].url});
                        }
                      }}
                      multiple={false}
                      trigger={
                        <Button type="button" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Select from Gallery
                        </Button>
                      }
                    />
                    
                    <div className="flex-1">
                      <Input
                        value={formData.featured_image_url}
                        onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Or enter image URL..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">Reading Time (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.reading_time_minutes}
                    onChange={(e) => setFormData({...formData, reading_time_minutes: parseInt(e.target.value) || 5})}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="featured" className="text-sm text-gray-300">Featured Post</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">SEO Meta Title</Label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Optional: Custom meta title"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">SEO Meta Description</Label>
                  <Textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={2}
                    placeholder="Optional: Custom meta description"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingPost ? 'Update' : 'Add'} Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-white">All</SelectItem>
              <SelectItem value="published" className="text-white">Published</SelectItem>
              <SelectItem value="draft" className="text-white">Draft</SelectItem>
              <SelectItem value="archived" className="text-white">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                    {post.is_featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white text-lg line-clamp-2">{post.title}</CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{post.author?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.view_count}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(post)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center">
                  {post.featured_image_url ? (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                {post.excerpt && (
                  <p className="text-sm text-gray-300 line-clamp-2">{post.excerpt}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs bg-slate-700 text-gray-300">
                        {tag.name}
                      </Badge>
                    ))}
                    {post.tags && post.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{post.tags.length - 3} more</span>
                    )}
                  </div>
                  {post.category && (
                    <Badge 
                      variant="outline" 
                      className="text-xs border-slate-600 text-gray-400"
                      style={{ borderColor: post.category.color }}
                    >
                      {post.category.name}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-slate-700">
                  <span>Reading time: {post.reading_time_minutes} min</span>
                  <span>{post.content.length} characters</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No blog posts found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters or search terms.' 
              : 'Get started by adding your first blog post.'}
          </p>
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;