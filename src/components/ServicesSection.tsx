import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, MapPin, Leaf, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const services = [
    {
      icon: Camera,
      title: 'Aerial Imagery',
      description: 'High-resolution aerial photography and videography for inspection, marketing, and documentation purposes.',
      features: ['4K Ultra HD Capture', 'Real-time Streaming', 'Multi-angle Perspectives', 'Weather Resistant'],
      gradient: 'from-blue-500 to-cyan-400',
      link: '/services/aerial-imagery'
    },
    {
      icon: MapPin,
      title: 'GIS Mapping & Analysis',
      description: 'Professional geographic information systems and spatial data analysis for comprehensive land surveying.',
      features: ['3D Terrain Modeling', 'Boundary Mapping', 'Topographic Surveys', 'CAD Integration'],
      gradient: 'from-purple-500 to-pink-400',
      link: '/services/gis-mapping'
    },
    {
      icon: Leaf,
      title: 'Precision Agriculture',
      description: 'Advanced agricultural monitoring using multispectral imaging and AI-powered crop analysis.',
      features: ['Crop Health Monitoring', 'Yield Prediction', 'Irrigation Planning', 'Pest Detection'],
      gradient: 'from-green-500 to-emerald-400',
      link: '/services/precision-agriculture'
    },
    {
      icon: BarChart3,
      title: 'Land Health Monitoring',
      description: 'Environmental monitoring and analysis for sustainable land management and conservation efforts.',
      features: ['Vegetation Analysis', 'Erosion Detection', 'Wildlife Tracking', 'Environmental Impact'],
      gradient: 'from-orange-500 to-red-400',
      link: '/services/land-health-monitoring'
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <span className="text-accent font-medium text-sm">Our Expertise</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Drone
            <span className="block bg-tech-gradient bg-clip-text text-transparent">
              Technology Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From aerial photography to advanced agricultural analysis, we deliver cutting-edge drone solutions
            tailored to your specific industry needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group card-hover bg-card-gradient border-border/50 overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Service Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r ${service.gradient} rounded-full opacity-60 animate-pulse`}></div>
                </div>

                {/* Service Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={service.link}>
                  <Button variant="tech" className="group">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-hero-gradient rounded-3xl p-8 md:p-12 text-white animate-fade-in relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Elevate Your Project?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Get a custom quote for your specific drone technology needs. Our experts are ready to help you 
                achieve your goals with cutting-edge aerial solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/consultation">
                  <Button variant="accent" size="lg" className="group bg-white text-accent hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300">
                    Request Consultation
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/get-quote">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    Quick Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;