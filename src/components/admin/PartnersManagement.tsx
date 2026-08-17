import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Handshake, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageGallery from './ImageGallery';

interface Partner {
  id: string;
  name: string;
  logo_url?: string | null;
  website?: string | null;
  sort_order: number;
  is_active: boolean;
}

const PartnersManagement = () => {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    logo_url: '',
    website: '',
    sort_order: 0,
    is_active: true,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', logo_url: '', website: '', sort_order: items.length, is_active: true });
    setDialogOpen(true);
  };

  const openEdit = (item: Partner) => {
    setEditing(item);
    setForm({
      name: item.name,
      logo_url: item.logo_url || '',
      website: item.website || '',
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleSelectLogo = (images: any[]) => {
    if (images && images.length > 0) {
      setForm((prev) => ({ ...prev, logo_url: images[0].url }));
    }
  };

  const handleSave = async () => {
    if (!form.name) {
      setError('Partner name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        logo_url: form.logo_url || null,
        website: form.website || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        const { error } = await supabase.from('partners').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('partners').insert([payload]);
        if (error) throw error;
      }
      setDialogOpen(false);
      await fetchItems();
    } catch (err) {
      console.error('Error saving partner:', err);
      setError(err instanceof Error ? err.message : 'Failed to save partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this partner?')) return;
    try {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;
      await fetchItems();
    } catch (err) {
      console.error('Error deleting partner:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete partner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Partners</h1>
          <p className="text-gray-400 text-sm">Manage the "Our Partners" section on the homepage.</p>
        </div>
        <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Partner
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">{error}</div>
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Partners</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No partners yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt={item.name} className="h-10 w-10 object-contain rounded bg-slate-600" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-slate-600 flex items-center justify-center">
                        <Handshake className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        {!item.is_active && <Badge className="bg-gray-600 text-gray-300">Inactive</Badge>}
                      </div>
                      {item.website && <p className="text-gray-400 text-xs">{item.website}</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="text-blue-400 hover:text-blue-300">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Logo</Label>
              {form.logo_url && (
                <div className="mb-3">
                  <img src={form.logo_url} alt="preview" className="h-16 w-16 object-contain rounded bg-slate-600" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <Input
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  placeholder="Or paste an image URL"
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <ImageGallery
                  multiple={false}
                  maxSelection={1}
                  onImageSelect={handleSelectLogo}
                  trigger={
                    <Button type="button" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      <ImageIcon className="w-4 h-4 mr-2" /> Gallery
                    </Button>
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Website (optional)</Label>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Status</Label>
                <select
                  value={form.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-600 text-white">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnersManagement;
