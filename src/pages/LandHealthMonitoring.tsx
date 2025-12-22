import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BarChart3, CheckCircle, Eye, Shield, TreePine, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import landMonitoringHero from '@/assets/land-monitoring-hero.jpg';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LandHealthMonitoring = () => {
  const monitoringServices = [
    {
      icon: TreePine,
      title: 'Vegetation Analysis',
      description: 'Comprehensive vegetation health assessment using advanced spectral analysis techniques.'
    },
    {
      icon: Shield,
      title: 'Erosion Detection',
      description: 'Early identification of soil erosion patterns and environmental degradation risks.'
    },
    {
      icon: Eye,
      title: 'Wildlife Tracking',
      description: 'Non-invasive wildlife monitoring and habitat assessment for conservation efforts.'
    },
    {
      icon: BarChart3,
      title: 'Environmental Impact',
      description: 'Detailed analysis of environmental changes and ecosystem health indicators.'
    }
  ];

  const applications = [
    'Conservation Area Management',
    'Deforestation Monitoring',
    'Wetland Health Assessment',
    'Mining Impact Evaluation',
    'Agricultural Sustainability',
    'Climate Change Research'
  ];

  const indicators = [
    {
      category: 'Vegetation Health',
      metrics: ['NDVI Index', 'Chlorophyll Content', 'Biomass Estimation', 'Species Diversity']
    },
    {
      category: 'Soil Quality',
      metrics: ['Soil Moisture', 'Erosion Patterns', 'Organic Content', 'Contamination Levels']
    },
    {
      category: 'Water Resources',
      metrics: ['Water Quality', 'Algae Blooms', 'Sediment Levels', 'Pollution Sources']
    },
    {
      category: 'Biodiversity',
      metrics: ['Species Count', 'Habitat Quality', 'Migration Patterns', 'Population Trends']
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={landMonitoringHero}
            alt="Land health monitoring and environmental assessment"
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
              <BarChart3 className="w-4 h-4 text-accent mr-2" />
              <span className="text-accent font-medium text-sm">Land Health Monitoring</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Environmental
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Monitoring & Analysis
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced environmental monitoring and analysis for sustainable land management,
              conservation efforts, and ecosystem health assessment using cutting-edge drone technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/start-monitoring">
                <Button variant="hero" size="lg" className="group">
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/view-reports">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Eye className="mr-2 w-5 h-5" />
                  View Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Monitoring Services */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Comprehensive Environmental
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Monitoring Solutions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our environmental monitoring services provide critical insights for conservation,
              sustainable development, and ecosystem management across diverse landscapes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {monitoringServices.map((service, index) => (
              <Card
                key={service.title}
                className="card-hover bg-card-gradient border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Applications & Key Indicators */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Applications */}
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Conservation &
                <span className="block bg-tech-gradient bg-clip-text text-transparent">
                  Research Applications
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our monitoring solutions support critical conservation efforts and research initiatives
                across Malawi's diverse ecosystems and protected areas.
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

              <Link to="/case-studies">
                <Button variant="tech" size="lg" className="group">
                  View Case Studies
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Key Indicators */}
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Key Environmental
                <span className="block bg-tech-gradient bg-clip-text text-transparent">
                  Indicators
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Comprehensive monitoring of critical environmental parameters to assess
                ecosystem health and track changes over time.
              </p>

              <div className="space-y-6">
                {indicators.map((indicator, index) => (
                  <Card
                    key={indicator.category}
                    className="card-hover bg-card-gradient border-border/50 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-bold text-foreground mb-4 flex items-center">
                        <Zap className="w-5 h-5 text-accent mr-2" />
                        {indicator.category}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {indicator.metrics.map((metric) => (
                          <div key={metric} className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                            {metric}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monitoring Approach */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Scientific
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Monitoring Approach
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our systematic approach combines advanced drone technology with scientific methodology
              to deliver accurate, reliable environmental data and analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: '01',
                title: 'Baseline Survey',
                description: 'Comprehensive initial assessment to establish environmental baseline conditions and monitoring parameters.'
              },
              {
                step: '02',
                title: 'Continuous Monitoring',
                description: 'Regular scheduled surveys using multispectral and thermal imaging to track changes over time.'
              },
              {
                step: '03',
                title: 'Analysis & Reporting',
                description: 'Scientific analysis with trend identification, impact assessment, and conservation recommendations.'
              }
            ].map((approach, index) => (
              <Card
                key={approach.step}
                className="card-hover bg-card-gradient border-border/50 animate-scale-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{approach.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{approach.title}</h3>
                  <p className="text-muted-foreground">{approach.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="bg-hero-gradient text-white max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Partner with Conservation Leaders
                </h3>
                <p className="text-white/90 mb-8">
                  Join leading conservation organizations, research institutions, and government agencies
                  who trust our environmental monitoring expertise for their critical projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/start-project">
                    <Button variant="accent" size="lg" className="group">
                      Start Project
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/research-collaboration">
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                      Research Collaboration
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandHealthMonitoring;