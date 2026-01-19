import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DownloadBrochure = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Download Brochure</h1>
        <p className="text-center text-gray-300">Download our brochure for more information.</p>
      </main>
      <Footer />
    </div>
  );
};

export default DownloadBrochure;