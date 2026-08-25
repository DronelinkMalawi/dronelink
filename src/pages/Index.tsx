import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import TeamsSection from '@/components/TeamsSection';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import ServicesSection from '@/components/ServicesSection';
import TestimonialSection from '@/components/TestimonialSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import PartnersSection from '@/components/PartnersSection';
import ImpactGallery from '@/components/ImpactGallery';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />

      {/* Who we are */}
      <div id="about">
        <AboutSection />
      </div>

      {/* What we do */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* Proof of work */}
      <PortfolioShowcase />
      <ImpactGallery />

      {/* Trust signals */}
      <PartnersSection />
      <TeamsSection />
      <TestimonialSection />

      {/* Talk to us */}
      <div id="contact">
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
