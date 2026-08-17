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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <HeroSection />

      {/* Impact Gallery - populated from the project_meta table via the admin Images section */}
      <ImpactGallery />

      <div id="about">
        <AboutSection />
      </div>
      <PartnersSection />
      <TeamsSection />
      <PortfolioShowcase />
      <div id="services">
        <ServicesSection />
      </div>
      <TestimonialSection />
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
