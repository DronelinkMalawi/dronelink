import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Leaf, CheckCircle, TrendingUp, Droplets, Bug, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import agricultureHero from '@/assets/agriculture-hero.jpg';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrecisionAgriculture = () => {
  const technologies = [
    {
      icon: TrendingUp,
      title: 'Crop Health Monitoring',
      description: 'Advanced multispectral imaging to assess plant health and identify stress areas early.'
    },
    {
      icon: BarChart3,
      title: 'Yield Prediction',
      description: 'AI-powered analytics to forecast crop yields and optimize harvest planning.'
    },
    {
      icon: Droplets,
      title: 'Irrigation Planning',
      description: 'Precision water management through detailed soil moisture and crop water stress analysis.'
    },
    {
      icon: Bug,
      title: 'Pest Detection',
      description: 'Early identification of pest infestations and disease outbreaks for timely intervention.'
    }
  ];

  const benefits = [
    'Increase Crop Yields by 15-30%',
    'Reduce Water Usage by 20%',
    'Optimize Fertilizer Application',
    'Early Disease Detection',
    'Improved Resource Allocation',
    'Data-Driven Decision Making'
  ];

  const cropTypes = [
    {
      name: 'Maize',
      description: 'Comprehensive monitoring for Malawi\'s primary staple crop'
    },
 
    {
      name: 'Tea',
      description: 'Plantation health monitoring and harvest timing optimization'
    },
    {
      name: 'Coffee',
      description: 'Bean quality assessment and processing optimization'
    },
    {
      name: 'Sugarcane',
      description: 'Growth monitoring and optimal harvest window identification'
    },
    {
      name: 'Cotton',
      description: 'Fiber quality assessment and pest management solutions'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={agricultureHero}
            alt="Precision agriculture monitoring"
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
              <Leaf className="w-4 h-4 text-accent mr-2" />
              <span className="text-accent font-medium text-sm">Precision Agriculture</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Agriculture
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Monitoring Solutions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary agricultural monitoring using multispectral imaging and AI-powered crop analysis
              to maximize yields and optimize farming operations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/start-monitoring">
                <Button variant="hero" size="lg" className="group">
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/view-results">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  View Results
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Advanced Agricultural
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Technologies
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our precision agriculture services leverage cutting-edge drone technology and AI analytics
              to provide actionable insights for modern farming operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <Card
                key={tech.title}
                className="card-hover bg-card-gradient border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{tech.title}</h3>
                  <p className="text-muted-foreground">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Crop Types */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Benefits */}
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Proven
                <span className="block bg-tech-gradient bg-clip-text text-transparent">
                  Results & Benefits
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our precision agriculture solutions deliver measurable improvements in crop yields,
                resource efficiency, and overall farm profitability.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/case-studies">
                <Button variant="tech" size="lg" className="group">
                  See Case Studies
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Crop Types */}
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Supported
                <span className="block bg-tech-gradient bg-clip-text text-transparent">
                  Crop Types
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Specialized monitoring solutions tailored for Malawi's diverse agricultural landscape
                and primary export crops.
              </p>

              <div className="space-y-4">
                {cropTypes.map((crop, index) => (
                  <Card
                    key={crop.name}
                    className="card-hover bg-card-gradient border-border/50 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Leaf className="w-5 h-5 text-accent flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-foreground">{crop.name}</h3>
                          <p className="text-sm text-muted-foreground">{crop.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monitoring Process */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Comprehensive
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Monitoring Process
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our systematic approach to precision agriculture monitoring ensures consistent,
              accurate, and actionable data for your farming operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: '01',
                title: 'Initial Assessment',
                description: 'Field analysis and crop stage evaluation to establish baseline monitoring parameters.'
              },
              {
                step: '02',
                title: 'Regular Monitoring',
                description: 'Scheduled drone flights with multispectral imaging throughout the growing season.'
              },
              {
                step: '03',
                title: 'Data Analysis & Reports',
                description: 'AI-powered analysis with actionable recommendations and detailed progress reports.'
              }
            ].map((process, index) => (
              <Card
                key={process.step}
                className="card-hover bg-card-gradient border-border/50 animate-scale-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{process.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="bg-hero-gradient text-white max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Transform Your Farming Operations
                </h3>
                <p className="text-white/90 mb-8">
                  Join progressive farmers across Malawi who are already benefiting from precision
                  agriculture monitoring. Start optimizing your crops today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/schedule-assessment">
                    <Button variant="accent" size="lg" className="group">
                      Schedule Assessment
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/download-brochure">
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                      Download Brochure
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

export default PrecisionAgriculture;