import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Trash2, Mail, Phone, Upload, X, Camera } from 'lucide-react';
import { useTeam } from '@/contexts/TeamContext';
import { supabase } from '@/lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  bio?: string;
  profile_image_url?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    [key: string]: string;
  };
  department?: string;
  hire_date?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  expertise?: string[];
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

const TeamManagement = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, loading, error } = useTeam();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    department: '',
    expertise: [],
    is_active: true,
    is_featured: false,
    sort_order: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleAddMember = async () => {
    if (formData.name && formData.role && formData.email) {
      let profileImageUrl = '';

      if (selectedImage) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          profileImageUrl = uploadedUrl;
        }
      }

      await addTeamMember({
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        profile_image_url: profileImageUrl,
        department: formData.department,
        expertise: formData.expertise || [],
        is_active: formData.is_active ?? true,
        is_featured: formData.is_featured ?? false,
        sort_order: formData.sort_order ?? 0,
        social_links: {},
        certifications: []
      });
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setImagePreview(member.profile_image_url || '');
  };

const handleUpdateMember = async () => {
    if (editingMember && formData.name && formData.role && formData.email) {
      let profileImageUrl = editingMember.profile_image_url;

      if (selectedImage) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          profileImageUrl = uploadedUrl;
        }
      }

      // Only send editable fields - exclude id, created_at, updated_at
      const { id: _id, created_at: _createdAt, updated_at: _updatedAt, profile_image_url: _oldImage, ...cleanData } = formData as Record<string, unknown>;

      await updateTeamMember(editingMember.id, {
        ...cleanData,
        profile_image_url: profileImageUrl
      });
      setEditingMember(null);
      resetForm();
    }
  };

const handleDeleteMember = async (id: string) => {
    await deleteTeamMember(id);
  };

const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      bio: '',
      department: '',
      expertise: [],
      is_active: true,
      is_featured: false,
      sort_order: 0
    });
    setSelectedImage(null);
    setImagePreview('');
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
      const filePath = `team-members/${fileName}`;

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

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white">Loading team members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
          <p className="text-gray-400">Manage your team members and their performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Team Member</DialogTitle>
            </DialogHeader>

            {/* Image Upload Section */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {imagePreview && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
              {uploading && (
                <p className="text-sm text-blue-400">Uploading image...</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-white">Role</Label>
                <Input
                  id="role"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
<div>
                 <Label htmlFor="phone" className="text-white">Phone</Label>
                 <Input
                   id="phone"
                   value={formData.phone || ''}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   className="bg-slate-700 border-slate-600 text-white"
                 />
               </div>
               <div>
                 <Label htmlFor="department" className="text-white">Department</Label>
                 <Input
                   id="department"
                   value={formData.department || ''}
                   onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                   className="bg-slate-700 border-slate-600 text-white"
                 />
               </div>
               <div>
                 <Label htmlFor="is_active" className="text-white">Status</Label>
                 <Select value={formData.is_active ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, is_active: value === 'active' })}>
                   <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="active">Active</SelectItem>
                     <SelectItem value="inactive">Inactive</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
              <div className="col-span-2">
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700">
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
<div className="flex items-start justify-between">
                 <div className="flex items-center space-x-3">
                   <Avatar>
                     <AvatarImage src={member.profile_image_url} />
                     <AvatarFallback className="bg-blue-600 text-white">
                       {member.name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <CardTitle className="text-white text-lg">{member.name}</CardTitle>
                     <p className="text-blue-400 text-sm">{member.role}</p>
                   </div>
                 </div>
                 <Badge variant={member.is_active ? 'default' : 'secondary'} className="text-xs">
                   {member.is_active ? 'Active' : 'Inactive'}
                 </Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
<div className="space-y-2">
                 <div className="flex items-center text-sm text-gray-300">
                   <Mail className="h-4 w-4 mr-2" />
                   {member.email}
                 </div>
                 {member.phone && (
                   <div className="flex items-center text-sm text-gray-300">
                     <Phone className="h-4 w-4 mr-2" />
                     {member.phone}
                   </div>
                 )}
                 {member.department && (
                   <div className="flex items-center text-sm text-gray-300">
                     <Users className="h-4 w-4 mr-2" />
                     {member.department}
                   </div>
                 )}
               </div>

               {member.expertise && member.expertise.length > 0 && (
                 <div>
                   <p className="text-sm text-gray-300 mb-2">Expertise:</p>
                   <div className="flex flex-wrap gap-1">
                     {member.expertise.map((skill, index) => (
                       <Badge key={index} variant="outline" className="text-xs">
                         {skill}
                       </Badge>
                     ))}
                   </div>
                 </div>
               )}

               {member.bio && (
                 <p className="text-sm text-gray-400">{member.bio}</p>
               )}

               <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                 <span className="text-xs text-gray-500">Joined: {new Date(member.created_at).toLocaleDateString()}</span>
                 <div className="flex space-x-2">
                   <Button
                     size="sm"
                     variant="outline"
                     onClick={() => handleEditMember(member)}
                     className="h-8 w-8 p-0"
                   >
                     <Edit className="h-4 w-4" />
                   </Button>
                   <Button
                     size="sm"
                     variant="outline"
                     onClick={() => handleDeleteMember(member.id)}
                     className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Team Member</DialogTitle>
            </DialogHeader>

            {/* Image Upload Section */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {imagePreview && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="edit-image-upload"
                />
                <label
                  htmlFor="edit-image-upload"
                  className="inline-flex items-center px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
              {uploading && (
                <p className="text-sm text-blue-400">Uploading image...</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-white">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-role" className="text-white">Role</Label>
                <Input
                  id="edit-role"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="text-white">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
<div>
                 <Label htmlFor="edit-phone" className="text-white">Phone</Label>
                 <Input
                   id="edit-phone"
                   value={formData.phone || ''}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   className="bg-slate-700 border-slate-600 text-white"
                 />
               </div>
               <div>
                 <Label htmlFor="edit-department" className="text-white">Department</Label>
                 <Input
                   id="edit-department"
                   value={formData.department || ''}
                   onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                   className="bg-slate-700 border-slate-600 text-white"
                 />
               </div>
               <div>
                 <Label htmlFor="edit-is_active" className="text-white">Status</Label>
                 <Select value={formData.is_active ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, is_active: value === 'active' })}>
                   <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="active">Active</SelectItem>
                     <SelectItem value="inactive">Inactive</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
              <div className="col-span-2">
                <Label htmlFor="edit-bio" className="text-white">Bio</Label>
                <Textarea
                  id="edit-bio"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setEditingMember(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMember} className="bg-blue-600 hover:bg-blue-700">
                Update Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamManagement;