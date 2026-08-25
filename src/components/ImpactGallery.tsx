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
    <section className="relative py-24 lg:py-28 bg-slate-900/40" aria-label="Drone imagery gallery">
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full border-x border-white/5 max-w-7xl mx-auto" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mb-14">
          <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-400/90">
            <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
            Field Notes
          </p>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Our Impact Gallery
          </h2>
          <p className="mt-4 text-lg text-slate-300/90 max-w-2xl">
            Real flights, real results — a look at our work across agriculture,
            partnerships, and community development.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-12">Loading gallery...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">
              No gallery items yet. Add them via the admin Images section.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {items.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-slate-800 border border-white/10"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-slate-800 flex items-center justify-center text-slate-400">
                    {item.category || 'DroneLink'}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {item.category && (
                    <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs mb-3">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white leading-snug">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-slate-300/90 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactGallery;