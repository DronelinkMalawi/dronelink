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
    <section className="py-16 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Our Partners</h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading partners...</p>
        ) : partners.length === 0 ? (
          <p className="text-center text-gray-400">No partners to display yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center p-8 bg-slate-700/50 rounded-lg"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-16 max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white font-semibold">{partner.name}</span>
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
