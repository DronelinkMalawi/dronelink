import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const Contact = () => {
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
      <main id="contact" className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Contact Us</h1>
        <p className="text-center text-gray-300">Get in touch with us for any inquiries or feedback.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
