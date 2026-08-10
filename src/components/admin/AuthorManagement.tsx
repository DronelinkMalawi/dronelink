import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, User, Mail, Twitter, Linkedin, Globe, Instagram, Search, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  profile_image_url: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  post_count?: number;
}

const AuthorManagement = () => {
  const location = useLocation();
  const params = useParams();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profile_image_url: '',
    social_links: {
      twitter: '',
      linkedin: '',
      website: '',
      instagram: ''
    } as {
      twitter?: string;
      linkedin?: string;
      website?: string;
      instagram?: string;
    },
    is_active: true
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  // Auto-open add/edit dialog based on URL
  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      openAddDialog();
    } else if (params.authorId) {
      const author = authors.find(a => a.id === params.authorId);
      if (author) {
        handleEdit(author);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, params.authorId, authors]);

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select(`
          *,
          blog_posts(count)
        `)
        .order('name');

      if (error) throw error;
      
      const authorsWithPostCount = (data || []).map(author => ({
        ...author,
        post_count: author.blog_posts?.[0]?.count || 0
      }));
      
      setAuthors(authorsWithPostCount);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authorData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        profile_image_url: formData.profile_image_url,
        social_links: formData.social_links,
        is_active: formData.is_active
      };

      if (editingAuthor) {
        const { error } = await supabase
          .from('authors')
          .update(authorData)
          .eq('id', editingAuthor.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('authors')
          .insert([authorData]);

        if (error) throw error;
      }

      setIsDialogOpen(false);
      setEditingAuthor(null);
      resetForm();
      fetchAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio,
      profile_image_url: author.profile_image_url,
      social_links: author.social_links || {
        twitter: '',
        linkedin: '',
        website: '',
        instagram: ''
      },
      is_active: author.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const author = authors.find(a => a.id === id);
    if (author && author.post_count && author.post_count > 0) {
      alert(`Cannot delete author ${author.name} because they have ${author.post_count} blog posts. Please reassign or delete the posts first.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this author?')) return;

    try {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      profile_image_url: '',
      social_links: {
        twitter: '',
        linkedin: '',
        website: '',
        instagram: ''
      },
      is_active: true
    });
  };

  const openAddDialog = () => {
    setEditingAuthor(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-white">Loading authors...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Author Management</h1>
          <p className="text-gray-400">Manage blog authors and their profiles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Author
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingAuthor ? 'Edit Author' : 'Add New Author'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-1">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-1">Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                  placeholder="Brief author biography"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-1">Profile Image URL</Label>
                <Input
                  value={formData.profile_image_url}
                  onChange={(e) => setFormData({...formData, profile_image_url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://example.com/author-image.jpg"
                />
              </div>

              <div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-300 mb-2">Social Links</Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.social_links.twitter}
                      onChange={(e) => setFormData({
                        ...formData, 
                        social_links: {...formData.social_links, twitter: e.target.value}
                      })}
                      className="bg-slate-700 border-slate-600 text-white pl-10"
                      placeholder="Twitter username"
                    />
                  </div>
                  
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.social_links.linkedin}
                      onChange={(e) => setFormData({
                        ...formData, 
                        social_links: {...formData.social_links, linkedin: e.target.value}
                      })}
                      className="bg-slate-700 border-slate-600 text-white pl-10"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                  
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.social_links.website}
                      onChange={(e) => setFormData({
                        ...formData, 
                        social_links: {...formData.social_links, website: e.target.value}
                      })}
                      className="bg-slate-700 border-slate-600 text-white pl-10"
                      placeholder="Website URL"
                    />
                  </div>
                  
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.social_links.instagram}
                      onChange={(e) => setFormData({
                        ...formData, 
                        social_links: {...formData.social_links, instagram: e.target.value}
                      })}
                      className="bg-slate-700 border-slate-600 text-white pl-10"
                      placeholder="Instagram username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="active" className="text-sm text-gray-300">Active Author</Label>
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
                  {editingAuthor ? 'Update' : 'Add'} Author
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white flex-1"
        />
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => (
          <Card key={author.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    {author.profile_image_url ? (
                      <img
                        src={author.profile_image_url}
                        alt={author.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{author.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={author.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
                        {author.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {author.post_count !== undefined && (
                        <Badge variant="secondary" className="bg-slate-700 text-gray-300">
                          {author.post_count} posts
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(author)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(author.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    disabled={author.post_count && author.post_count > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="h-3 w-3" />
                  <span>{author.email}</span>
                </div>
                
                {author.bio && (
                  <p className="text-sm text-gray-300 line-clamp-2">{author.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {author.social_links?.twitter && (
                    <a
                      href={`https://twitter.com/${author.social_links.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {author.social_links?.linkedin && (
                    <a
                      href={author.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {author.social_links?.website && (
                    <a
                      href={author.social_links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  {author.social_links?.instagram && (
                    <a
                      href={`https://instagram.com/${author.social_links.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 pt-2 border-t border-slate-700">
                  <div>Created: {new Date(author.created_at).toLocaleDateString()}</div>
                  <div>Updated: {new Date(author.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAuthors.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No authors found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Get started by adding your first author.'}
          </p>
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add First Author
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthorManagement;