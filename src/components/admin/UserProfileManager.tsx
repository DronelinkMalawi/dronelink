import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Edit, 
  Save, 
  Camera, 
  Upload, 
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  profile_image_url: string;
  social_links: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

const UserProfileManager = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    linkedin: '',
    twitter: '',
    github: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's author profile
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('email', user?.email)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name,
          bio: data.bio || '',
          linkedin: data.social_links?.linkedin || '',
          twitter: data.social_links?.twitter || '',
          github: data.social_links?.github || '',
          website: data.social_links?.website || ''
        });
        setImagePreview(data.profile_image_url || '');
      } else {
        // Create profile if it doesn't exist
        await createProfile();
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('authors')
        .insert({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
          email: user.email,
          bio: '',
          profile_image_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
          social_links: {},
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        name: data.name,
        bio: data.bio || '',
        linkedin: data.social_links?.linkedin || '',
        twitter: data.social_links?.twitter || '',
        github: data.social_links?.github || '',
        website: data.social_links?.website || ''
      });
      setImagePreview(data.profile_image_url || '');
    } catch (err) {
      console.error('Error creating profile:', err);
      throw err;
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setUploading(true);
    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `author-profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedImage);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let profileImageUrl = profile.profile_image_url;

      if (selectedImage) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          profileImageUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from('authors')
        .update({
          name: formData.name,
          bio: formData.bio,
          profile_image_url: profileImageUrl,
          social_links: {
            linkedin: formData.linkedin || null,
            twitter: formData.twitter || null,
            github: formData.github || null,
            website: formData.website || null
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Refresh profile data
      await fetchUserProfile();
      setEditing(false);
      setSelectedImage(null);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        bio: profile.bio || '',
        linkedin: profile.social_links?.linkedin || '',
        twitter: profile.social_links?.twitter || '',
        github: profile.social_links?.github || '',
        website: profile.social_links?.website || ''
      });
      setImagePreview(profile.profile_image_url || '');
    }
    setEditing(false);
    setSelectedImage(null);
    setError(null);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(profile?.profile_image_url || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              User Profile
            </CardTitle>
            {!editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={imagePreview} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {formData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {editing && (
                <div className="absolute -bottom-2 -right-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </label>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{formData.name}</h3>
              <p className="text-gray-400 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {user?.email}
              </p>
              <Badge variant="outline" className="mt-2 border-blue-500 text-blue-400">
                Author
              </Badge>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-white">Full Name</Label>
              {editing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              ) : (
                <p className="text-gray-300 mt-1">{formData.name}</p>
              )}
            </div>

            <div>
              <Label className="text-white">Email</Label>
              <p className="text-gray-300 mt-1">{user?.email}</p>
            </div>

            <div className="md:col-span-2">
              <Label className="text-white">Bio</Label>
              {editing ? (
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-300 mt-1">
                  {formData.bio || 'No bio added yet.'}
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Social Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">LinkedIn</Label>
                {editing ? (
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="https://linkedin.com/in/username"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">
                    {formData.linkedin || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white">Twitter</Label>
                {editing ? (
                  <Input
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="https://twitter.com/username"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">
                    {formData.twitter || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white">GitHub</Label>
                {editing ? (
                  <Input
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="https://github.com/username"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">
                    {formData.github || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white">Website</Label>
                {editing ? (
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">
                    {formData.website || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-700">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileManager;