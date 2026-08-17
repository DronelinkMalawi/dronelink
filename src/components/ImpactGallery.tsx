import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  category: string;
  featured: boolean;
}

const ImpactGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('project_meta')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <section
      className="relative py-16 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900"
      aria-label="Drone Imagery Gallery"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact Gallery</h2>
          <p className="text-white/80 max-w-2xl mx-auto">Showcasing our work across education, partnerships, and community development</p>
        </div>

        {loading ? (
          <p className="text-center text-white/60 py-10">Loading gallery...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-white/60 py-10">
            No gallery items yet. Add them via the admin Images section.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {items.map((item) => (
              <div key={item.id} className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 group">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-64 bg-slate-800 flex items-center justify-center text-white/50">
                    {item.category}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  {item.description && <p className="text-white/80 text-sm">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactGallery;
