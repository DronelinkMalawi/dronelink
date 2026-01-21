import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import { useEffect } from 'react';

const About = () => {
  // Add this block at the top of your component
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' to prevent the user from seeing the jump
    });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="pt-16">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
