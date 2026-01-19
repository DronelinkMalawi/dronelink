import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import droneImage1000 from '@/assets/1000940749.jpg';
import droneImage1001 from '@/assets/1001190447.jpg';
import droneImage1002 from '@/assets/1001225489.jpg';
import droneImage1003 from '@/assets/1001191220.jpg';
import droneImage1004 from '@/assets/1001262415.jpg';
import AboutSection from '@/components/AboutSection';
import TeamsSection from '@/components/TeamsSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialSection from '@/components/TestimonialSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import PartnersSection from '@/components/PartnersSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <HeroSection />
      
      {/* Image Gallery Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" aria-label="Drone Imagery Gallery">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact Gallery</h2>
            <p className="text-white/80 max-w-2xl mx-auto">Showcasing our work across education, partnerships, and community development</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 group">
              <img
                src={droneImage1001}
                alt="Partnering with international organizations"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">Precision Agriculture</h3>
                <p className="text-white/80 text-sm">Optimizing farming practices with aerial surveillance</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 group">
              <img
                src={droneImage1002}
                alt="Community training and development programs"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">International Partnerships</h3>
                <p className="text-white/80 text-sm">Collaborating with global stakeholders for innovation</p>
              </div>
            </div>
            
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 group">
              <img
                src={droneImage1003}
                alt="Research and development initiatives"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">UAV and Data Analysis </h3>
                <p className="text-white/80 text-sm"> Advancing drone technology for better insights</p>  
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 group">
              <img
                src={droneImage1000}
                alt="School Drone & Coding Clubs program"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">School Drone & Coding Clubs</h3>
                <p className="text-white/80 text-sm">Mentoring the next generation in cutting edge technology</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 group">
              <img
                src={droneImage1004}
                alt="Environmental monitoring projects"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">Environmental Monitoring</h3>
                <p className="text-white/80 text-sm">Protecting ecosystems with aerial surveillance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div id="about">
        <AboutSection />
      </div>
      <PartnersSection/>
      <TeamsSection />
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
