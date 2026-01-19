import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Our Services</h1>
        <p className="text-center text-gray-300">We offer a wide range of services to help you with your drone-related needs.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
