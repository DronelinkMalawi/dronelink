import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, CheckCircle, Globe, Layers, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gisHero from '@/assets/gis-mapping-hero.jpg';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GISMapping = () => {
  const capabilities = [
    {
      icon: Globe,
      title: '3D Terrain Modeling',
      description: 'Create detailed 3D models and digital elevation maps for comprehensive terrain analysis.'
    },
    {
      icon: MapPin,
      title: 'Boundary Mapping',
      description: 'Precise property boundary surveys and land parcel mapping with GPS accuracy.'
    },
    {
      icon: Layers,
      title: 'Topographic Surveys',
      description: 'Professional topographic mapping for engineering and construction projects.'
    },
    {
      icon: BarChart3,
      title: 'CAD Integration',
      description: 'Seamless integration with CAD software for engineering and architectural workflows.'
    }
  ];

  const applications = [
    'Land Development Planning',
    'Mining & Quarry Operations',
    'Infrastructure Projects',
    'Urban Planning',
    'Environmental Assessments',
    'Agricultural Land Management'
  ];

  const deliverables = [
    {
      title: 'Orthomosaic Maps',
      description: 'High-resolution, georeferenced aerial maps perfect for planning and analysis.'
    },
    {
      title: 'Digital Elevation Models (DEM)',
      description: '3D terrain models showing elevation changes and topographic features.'
    },
    {
      title: 'Contour Maps',
      description: 'Detailed contour lines for engineering design and construction planning.'
    },
    {
      title: 'Volume Calculations',
      description: 'Accurate stockpile and cut/fill volume measurements for construction projects.'
    },
    {
      title: 'CAD-Ready Files',
      description: 'Survey data exported in formats compatible with AutoCAD and other design software.'
    },
    {
      title: 'GIS Database',
      description: 'Comprehensive spatial database for ongoing project management and analysis.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={gisHero}
            alt="GIS mapping and spatial analysis"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-80"></div>
          <div className="absolute inset-0 bg-background/20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-8">
              <Link to="/#services">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Services
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center px-4 py-2 bg-card/20 backdrop-blur-sm border border-border/30 rounded-full mb-8">
              <MapPin className="w-4 h-4 text-accent mr-2" />
              <span className="text-accent font-medium text-sm">GIS Mapping & Analysis</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Advanced GIS Mapping
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                & Spatial Analysis
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional geographic information systems and comprehensive spatial data analysis for land surveying,
              urban planning, and infrastructure development projects.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="group">
                Request Survey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <Globe className="mr-2 w-5 h-5" />
                View Samples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Comprehensive Mapping
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                & Survey Capabilities
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced GIS mapping services combine cutting-edge drone technology with professional
              surveying expertise to deliver precise spatial data solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <Card
                key={capability.title}
                className="card-hover bg-card-gradient border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <capability.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{capability.title}</h3>
                  <p className="text-muted-foreground">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Applications & Deliverables */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Applications */}
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Industry
                <span className="block bg-tech-gradient bg-clip-text text-transparent">
                  Applications
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our GIS mapping services serve diverse industries with precise spatial data
                solutions tailored to specific project requirements.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {applications.map((application, index) => (
                  <div
                    key={application}
                    className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground font-medium">{application}</span>
                  </div>
                ))}
              </div>

              <Link to="/#contact">
                <Button variant="tech" size="lg" className="group">
                  Discuss Your Project
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Deliverables */}
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Project
                <span className="block bg-tech-gradient bg-clip-text text-transparent">
                  Deliverables
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Comprehensive data packages delivered in industry-standard formats
                for immediate use in your workflows.
              </p>

              <div className="space-y-4">
                {deliverables.map((deliverable, index) => (
                  <Card
                    key={deliverable.title}
                    className="card-hover bg-card-gradient border-border/50 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-bold text-foreground mb-2">{deliverable.title}</h3>
                      <p className="text-sm text-muted-foreground">{deliverable.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Our Proven
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Survey Process
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial consultation to final delivery, we follow a systematic approach
              to ensure accuracy and client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Site Assessment',
                description: 'Initial consultation and site evaluation to determine project scope and requirements.'
              },
              {
                step: '02',
                title: 'Flight Planning',
                description: 'Detailed flight path planning and ground control point establishment for maximum accuracy.'
              },
              {
                step: '03',
                title: 'Data Collection',
                description: 'Professional drone survey operations with high-precision GPS and imaging equipment.'
              },
              {
                step: '04',
                title: 'Data Processing',
                description: 'Advanced photogrammetric processing and GIS analysis to create final deliverables.'
              },
              {
                step: '05',
                title: 'Data Analysis',
                description: 'Advanced photogrammetric processing and GIS analysis to create final deliverables.'
              },
              {
                step: '06',
                title: 'Project Delivery',
                description: 'Advanced photogrammetric processing and GIS analysis to create final deliverables.'
              },
            ].map((process, index) => (
              <Card
                key={process.step}
                className="card-hover bg-card-gradient border-border/50 animate-scale-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{process.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Card className="bg-hero-gradient text-white max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Start Your Mapping Project?
                </h3>
                <p className="text-white/90 mb-8">
                  Get professional GIS mapping and spatial analysis services backed by our
                  expert team and cutting-edge technology.
                </p>
<Link to="/contact">
                  <Button variant="accent" size="lg" className="group">
                    Get Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GISMapping;