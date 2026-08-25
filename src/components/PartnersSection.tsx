import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Partner {
  id: string;
  name: string;
  logo_url?: string | null;
  website?: string | null;
}

const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        setPartners(data || []);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section className="py-20 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-slate-400/90">
            <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
            Trusted Network
          </p>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Our Partners
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-10">Loading partners...</p>
        ) : partners.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No partners to display yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 p-8 min-h-20"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-14 max-w-full object-contain grayscale hover:grayscale-0 transition-[filter] duration-300"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white/80 font-semibold">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;