import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  avatar_url?: string | null;
}

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        setTestimonials(data || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-24 lg:py-28 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mb-14">
          <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-400/90">
            <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
            Client Voices
          </p>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            What our clients say
          </h2>
          <p className="mt-4 text-lg text-slate-300/90 max-w-2xl">
            The teams we work with across agriculture, infrastructure, and
            environment rely on our data every day.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-12">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-slate-400 py-12">No testimonials to display yet.</p>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="bg-slate-900/70 border-white/10 rounded-2xl shadow-none"
              >
                <CardContent className="flex flex-col h-full p-7">
                  <div className="flex mb-5">
                    {[...Array(Math.min(testimonial.rating, 5))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-200 leading-relaxed">“{testimonial.content}”</p>
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;