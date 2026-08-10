import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Images, 
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  bucket?: string;
  path?: string;
}

interface ProjectMeta {
  id: string;
  title: string;
  description: string;
  category: 'partnership' | 'club' | 'project';
  image_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const ImageManagement = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [projectMeta, setProjectMeta] = useState<ProjectMeta[]>([]);
  const [selectedImages, setSelectedImages] = useState<UploadedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for new project meta
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'project' as 'partnership' | 'club' | 'project',
    featured: false
  });

  useEffect(() => {
    fetchProjectMeta();
  }, []);

  const handleImageSelect = (images: UploadedFile[]) => {
    setSelectedImages(images);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const imageUrl = selectedImages.length > 0 ? selectedImages[0].url : null;
      
      const { data, error } = await supabase
        .from('project_meta')
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: imageUrl,
          featured: formData.featured,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'project',
        featured: false
      });
      setSelectedImages([]);

      // Refresh the project meta list
      await fetchProjectMeta();

      // Show success message
      alert('Project meta created successfully!');
      
    } catch (err) {
      console.error('Error creating project meta:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project meta');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMeta = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_meta')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjectMeta(data || []);
    } catch (err) {
      console.error('Error fetching project meta:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project meta');
    } finally {
      setLoading(false);
    }
  };

  const deleteProjectMeta = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('project_meta')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjectMeta(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting project meta:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete project meta');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'partnership':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'club':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'project':
        return 'bg-purple-500/20 text-purple-400 border-purple-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Image Management</h1>
          <p className="text-gray-400">Upload images and manage project metadata</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="gallery" className="text-white data-[state=active]:bg-blue-600">
            <Images className="h-4 w-4 mr-2" />
            Image Gallery
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-white data-[state=active]:bg-blue-600">
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </TabsTrigger>
          <TabsTrigger value="meta" className="text-white data-[state=active]:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Project Meta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery 
                onImageSelect={handleImageSelect}
                multiple={true}
                maxSelection={10}
                showUploadButton={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Upload Images</CardTitle>
              <p className="text-gray-400 text-sm">
                Images will be automatically watermarked with the DronelinkMW logo and copyright
              </p>
            </CardHeader>
            <CardContent>
              <ImageUpload 
                onUploadComplete={(files) => {
                  console.log('Uploaded files:', files);
                  // Refresh gallery after upload
                  setActiveTab('gallery');
                }}
                maxFiles={10}
                maxFileSize={10}
                multiple={true}
                showPreview={true}
                enableWatermark={true}
                watermarkOptions={{
                  text: '© DronelinkMW',
                  position: 'bottom-right',
                  opacity: 0.7,
                  scale: 0.15,
                  margin: 20
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form for adding new project meta */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Add Project Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'partnership' | 'club' | 'project' }))}
                      className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="project">Project</option>
                      <option value="partnership">Partnership</option>
                      <option value="club">Club</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white">Featured Image</Label>
                    <div className="mt-2">
                      <ImageGallery 
                        onImageSelect={handleImageSelect}
                        multiple={false}
                        maxSelection={1}
                        showUploadButton={true}
                        trigger={
                          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 w-full">
                            {selectedImages.length > 0 ? 'Change Image' : 'Select Image'}
                          </Button>
                        }
                      />
                      {selectedImages.length > 0 && (
                        <div className="mt-2">
                          <img 
                            src={selectedImages[0].url} 
                            alt="Selected" 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="featured" className="text-white">Featured</Label>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !formData.title || !formData.description}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Project Meta
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* List of existing project meta */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Existing Project Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {projectMeta.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No project meta found</p>
                  ) : (
                    projectMeta.map((item) => (
                      <div key={item.id} className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{item.title}</h3>
                            <Badge className={cn("mt-1", getCategoryColor(item.category))}>
                              {item.category}
                            </Badge>
                            {item.featured && (
                              <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteProjectMeta(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-gray-300 text-sm">{item.description}</p>
                        
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                        
                        <div className="text-xs text-gray-400">
                          Created: {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {projectMeta.length === 0 && (
                  <Button
                    onClick={fetchProjectMeta}
                    variant="outline"
                    className="w-full border-slate-600 text-white hover:bg-slate-700"
                  >
                    Load Project Meta
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageManagement;