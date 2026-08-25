import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: '',
  });

  const { toast } = useToast();
  const { settings } = useSiteSettings();

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office',
      details: [settings.contact_address_line1, settings.contact_address_line2],
    },
    { icon: Phone, title: 'Phone', details: [settings.contact_phone] },
    { icon: Mail, title: 'Email', details: [settings.contact_email] },
    {
      icon: Clock,
      title: 'Hours',
      details: [settings.contact_hours_weekday, settings.contact_hours_saturday],
    },
  ];

  const handleMailto = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing information',
        description: 'Please complete all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const subject = encodeURIComponent('Drone Project Inquiry');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nProject: ${formData.project}\n\n${formData.message}`
    );

    window.location.href = `mailto:${settings.contact_email}?subject=${subject}&body=${body}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      className="relative py-28 lg:py-36 bg-slate-900/40 border-t border-white/10"
    >
      <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-cyan-500/[0.06] blur-[160px] pointer-events-none" aria-hidden />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-1">
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-400/90">
              <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
              Contact
            </p>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Project
              <span className="block text-slate-400">Consultation</span>
            </h2>
          </div>
          <div className="lg:col-span-2 text-lg text-slate-300/90 leading-relaxed">
            Engage our technical team for professional aerial data services,
            operational planning, and long-term monitoring solutions.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex gap-4 items-start rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition-colors hover:border-cyan-400/30"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="w-5 h-5 text-cyan-400" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{item.title}</p>
                    {item.details.map((detail) => (
                      <p key={detail} className="mt-1 text-white/90 leading-snug">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-9 lg:p-11">
              <h3 className="text-xl font-semibold text-white mb-9">Inquiry Form</h3>

              <form onSubmit={handleMailto} className="space-y-9">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    name="name"
                    placeholder="Full name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border border-white/10 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-400"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border border-white/10 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-12 rounded-xl border border-white/10 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-400"
                  />
                  <Input
                    name="project"
                    placeholder="Project category"
                    value={formData.project}
                    onChange={handleChange}
                    className="h-12 rounded-xl border border-white/10 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <Textarea
                  name="message"
                  rows={6}
                  placeholder="Project scope, objectives, timeline *"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-400 resize-none"
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto rounded-xl px-12 bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25"
                >
                  <span className="flex items-center gap-3">
                    Submit Inquiry
                    <Send className="w-4 h-4" />
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
