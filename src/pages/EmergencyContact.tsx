import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const EmergencyContact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Emergency Contact</h1>
        <p className="text-center text-gray-300">Contact us for emergency drone services.</p>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencyContact;