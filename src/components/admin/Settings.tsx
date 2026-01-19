import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Mail, Palette, Share2, BarChart3, Save, RefreshCw, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import UserProfileManager from './UserProfileManager';

interface SiteSetting {
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'textarea';
  category: string;
  is_public: boolean;
}

const SettingsComponent = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = [
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'general', name: 'General', icon: Globe },
    { id: 'seo', name: 'SEO', icon: Globe },
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'social', name: 'Social Media', icon: Share2 },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'features', name: 'Features', icon: BarChart3 },
    { id: 'email', name: 'Email', icon: Mail },
  ];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category, key');

      if (error) throw error;

      const settingsMap: Record<string, SiteSetting> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting;
      });

      setSettings(settingsMap);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updates = Object.values(settings).map(setting => ({
        key: setting.key,
        value: setting.value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderSettingField = (setting: SiteSetting) => {
    const commonProps = {
      value: setting.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        updateSetting(setting.key, e.target.value),
      className: "bg-slate-700 border-slate-600 text-white"
    };

    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value === 'true'}
            onCheckedChange={(checked) => updateSetting(setting.key, checked.toString())}
          />
        );
      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            onChange={(e) => updateSetting(setting.key, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={3}
          />
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  const getSettingsByCategory = (category: string) => {
    return Object.values(settings).filter(setting => setting.category === category);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white">Settings</h3>
          <p className="text-gray-400">Manage your profile and application settings</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-slate-700 text-white"
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <UserProfileManager />
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <category.icon className="h-5 w-5 mr-2" />
                  {category.name} Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getSettingsByCategory(category.id).map(setting => (
                  <div key={setting.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={setting.key} className="text-white">
                        {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      {setting.is_public && (
                        <Badge variant="outline" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                    {renderSettingField(setting)}
                    {setting.description && (
                      <p className="text-sm text-gray-400">{setting.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsComponent;