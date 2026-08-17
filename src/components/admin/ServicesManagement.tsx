import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  index_label: string;
  title: string;
  description: string;
  features: string[];
  link: string | null;
  sort_order: number;
  is_active: boolean;
}

const ServicesManagement = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    index_label: '01',
    title: '',
    description: '',
    featuresText: '',
    link: '',
    sort_order: 0,
    is_active: true,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      index_label: String(items.length + 1).padStart(2, '0'),
      title: '',
      description: '',
      featuresText: '',
      link: '/contact',
      sort_order: items.length,
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (item: Service) => {
    setEditing(item);
    setForm({
      index_label: item.index_label,
      title: item.title,
      description: item.description,
      featuresText: Array.isArray(item.features) ? item.features.join('\n') : '',
      link: item.link || '',
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const features = form.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      const payload = {
        index_label: form.index_label || '01',
        title: form.title,
        description: form.description,
        features,
        link: form.link || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        const { error } = await supabase.from('services').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      }
      setDialogOpen(false);
      await fetchItems();
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      await fetchItems();
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-400 text-sm">Manage the "Enterprise Drone Intelligence Services" section on the homepage.</p>
        </div>
        <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Service
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">{error}</div>
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Services</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No services yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-600 text-white font-bold text-sm w-8 h-8 rounded flex items-center justify-center">
                        {item.index_label}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{item.title}</h3>
                          {!item.is_active && <Badge className="bg-gray-600 text-gray-300">Inactive</Badge>}
                        </div>
                        <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                        {Array.isArray(item.features) && item.features.length > 0 && (
                          <p className="text-gray-400 text-xs mt-1">{item.features.join(' · ')}</p>
                        )}
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Index (e.g. 01)</Label>
                <Input
                  value={form.index_label}
                  onChange={(e) => setForm({ ...form, index_label: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-white">Features (one per line)</Label>
              <Textarea
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
                placeholder={'4K Ultra HD Capture\nLive Streaming'}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Link (e.g. /services/...)</Label>
                <Input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
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

export default ServicesManagement;
