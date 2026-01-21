'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: '',
  });

  const { toast } = useToast();

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office',
      details: ['Lilongwe', 'Bingu National Stadium – Corporate Box E26'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+265 888 32 13 55'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@dronelinkmw.com'],
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Mon–Fri 08:00–18:00', 'Sat 09:00–16:00'],
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
      `Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Project: ${formData.project}

${formData.message}`
    );

    window.location.href = `mailto:info@dronelinkmw.com?subject=${subject}&body=${body}`;
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
      className="
        relative py-28 lg:py-36
        bg-background
        border-t border-border
        motion-safe:animate-fade-in-up
      "
    >
      {/* Vertical grid frame */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full max-w-7xl mx-auto border-x border-border" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-1 motion-safe:animate-slide-in-left">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 font-mono">
              Contact
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Project
              <span className="block">Consultation</span>
            </h2>
          </div>

          <div className="lg:col-span-2 text-lg text-muted-foreground leading-relaxed motion-safe:animate-fade-in">
            Engage our technical team for professional aerial data services,
            operational planning, and long-term monitoring solutions.
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card
                key={info.title}
                style={{ animationDelay: `${index * 80}ms` }}
                className="
                  rounded-none border border-border bg-transparent
                  motion-safe:animate-fade-in-up
                  transition-transform duration-300
                  hover:-translate-y-1
                "
              >
                <CardContent className="p-6 flex gap-4">
                  <info.icon className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-1">
                      {info.title}
                    </p>
                    {info.details.map((detail) => (
                      <p key={detail} className="text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 motion-safe:animate-fade-in-up">
            <Card className="rounded-none border border-border bg-transparent">
              <CardContent className="p-10">
                <h3 className="text-xl font-semibold mb-10">
                  Inquiry Form
                </h3>

                <form onSubmit={handleMailto} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      name="name"
                      placeholder="Full name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="
                        rounded-none border-border
                        focus-visible:ring-0
                        focus:border-foreground
                        transition-colors
                      "
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email address *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="
                        rounded-none border-border
                        focus-visible:ring-0
                        focus:border-foreground
                        transition-colors
                      "
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="rounded-none border-border focus-visible:ring-0"
                    />
                    <Input
                      name="project"
                      placeholder="Project category"
                      value={formData.project}
                      onChange={handleChange}
                      className="rounded-none border-border focus-visible:ring-0"
                    />
                  </div>

                  <Textarea
                    name="message"
                    rows={6}
                    placeholder="Project scope, objectives, timeline *"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="
                      rounded-none border-border resize-none
                      focus-visible:ring-0
                      transition-colors
                    "
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="
                      rounded-none px-12
                      transition-all duration-300
                      hover:translate-x-1
                    "
                  >
                    <span className="flex items-center gap-3">
                      Submit
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
