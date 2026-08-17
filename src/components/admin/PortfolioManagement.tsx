import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Image as ImageIcon, Star, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageGallery from './ImageGallery';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featured_image_url: string;
  category: string;
  client: string;
  project_date: string;
  technologies: string[];
  tags: string[];
  project_url: string;
  github_url: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

const PortfolioManagement = () => {
  const location = useLocation();
  const params = useParams();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    featured_image_url: '',
    category: '',
    client: '',
    project_date: '',
    technologies: '',
    tags: '',
    project_url: '',
    github_url: '',
    is_featured: false,
    is_published: true
  });

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  // Auto-open add/edit dialog based on URL
  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      openAddDialog();
    } else if (params.projectId) {
      const item = portfolioItems.find(i => i.id === params.projectId);
      if (item) {
        handleEdit(item);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, params.projectId, portfolioItems]);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const technologies = formData.technologies.split(',').map(tech => tech.trim());
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            title: formData.title,
            slug,
            description: formData.description,
            content: formData.content,
            featured_image_url: formData.featured_image_url,
            category: formData.category,
            client: formData.client,
            project_date: formData.project_date,
            technologies,
            tags,
            project_url: formData.project_url,
            github_url: formData.github_url,
            is_featured: formData.is_featured,
            is_published: formData.is_published
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_items')
          .insert([{
            title: formData.title,
            slug,
            description: formData.description,
            content: formData.content,
            featured_image_url: formData.featured_image_url,
            category: formData.category,
            client: formData.client,
            project_date: formData.project_date,
            technologies,
            tags,
            project_url: formData.project_url,
            github_url: formData.github_url,
            is_featured: formData.is_featured,
            is_published: formData.is_published
          }]);

        if (error) throw error;
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchPortfolioItems();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content,
      featured_image_url: item.featured_image_url,
      category: item.category,
      client: item.client,
      project_date: item.project_date,
      technologies: item.technologies.join(', '),
      tags: (item.tags || []).join(', '),
      project_url: item.project_url || '',
      github_url: item.github_url || '',
      is_featured: item.is_featured || false,
      is_published: item.is_published !== false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPortfolioItems();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
  };

  // Pick a featured image from the images gallery (uploaded to the 'images' bucket)
  const handleSelectImage = (images: any[]) => {
    if (images && images.length > 0) {
      setFormData((prev) => ({ ...prev, featured_image_url: images[0].url }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      featured_image_url: '',
      category: '',
      client: '',
      project_date: '',
      technologies: '',
      tags: '',
      project_url: '',
      github_url: '',
      is_featured: false,
      is_published: true
    });
  };

  const openAddDialog = () => {
    setEditingItem(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Management</h1>
          <p className="text-gray-400">Manage your portfolio items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., Aerial Survey, GIS Mapping"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={5}
                  placeholder="Full project details"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
                  <Input
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Project Date</label>
                  <Input
                    type="date"
                    value={formData.project_date}
                    onChange={(e) => setFormData({...formData, project_date: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Featured Image</label>
                {formData.featured_image_url && (
                  <img
                    src={formData.featured_image_url}
                    alt="Featured image preview"
                    className="mb-3 w-full h-40 object-cover rounded-lg bg-slate-700"
                  />
                )}
                <Input
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mb-2"
                  placeholder="https://example.com/image.jpg  (or select from gallery below)"
                  required
                />
                <ImageGallery
                  multiple={false}
                  maxSelection={1}
                  onImageSelect={handleSelectImage}
                  trigger={
                    <Button type="button" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      <ImageIcon className="w-4 h-4 mr-2" /> Select from Gallery
                    </Button>
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Technologies</label>
                <Input
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Drone X7, GIS Software, Photogrammetry (comma-separated)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Urban Planning, Crop Health, 3D Modeling (comma-separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Project URL</label>
                  <Input
                    value={formData.project_url}
                    onChange={(e) => setFormData({...formData, project_url: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://live-project.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
                  <Input
                    value={formData.github_url}
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://github.com/project"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-300 flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    Featured Project
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-300 flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-green-400" />
                    Published
                  </span>
                </label>
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
                  {editingItem ? 'Update' : 'Add'} Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <Card key={item.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-400">{item.category}</p>
                    {item.is_featured && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </span>
                    )}
                    {item.is_published === false && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                        <Eye className="h-3 w-3 mr-1" /> Draft
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(item)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
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
                  {item.featured_image_url ? (
                    <img
                      src={item.featured_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Client: {item.client}</span>
                  <span>{new Date(item.project_date).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700 text-xs text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-slate-700 text-xs text-gray-400 rounded">
                      +{item.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolioItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No portfolio items yet</h3>
          <p className="text-gray-400 mb-4">Get started by adding your first portfolio item.</p>
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default PortfolioManagement;