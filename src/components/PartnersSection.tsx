const PartnersSection = () => {
  const partners = [
    'Partner 1',
    'Partner 2',
    'Partner 3',
    'Partner 4'
  ];

  return (
    <section className="py-16 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Our Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center p-8 bg-slate-700/50 rounded-lg">
              <span className="text-white font-semibold">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;