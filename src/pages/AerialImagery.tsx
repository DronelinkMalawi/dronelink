import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, CheckCircle, Play, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import aerialHero from '@/assets/aerial-imagery-hero.jpg';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AerialImagery = () => {
  const features = [
    {
      icon: Camera,
      title: '4K Ultra HD Capture',
      description: 'Crystal clear imagery with professional-grade cameras and stabilization systems.'
    },
    {
      icon: Play,
      title: 'Real-time Streaming',
      description: 'Live video feeds for immediate monitoring and decision-making during operations.'
    },
    {
      icon: Star,
      title: 'Multi-angle Perspectives',
      description: 'Comprehensive coverage with multiple viewpoints and flight patterns.'
    },
    {
      icon: CheckCircle,
      title: 'Weather Resistant',
      description: 'Professional equipment capable of operating in various weather conditions.'
    }
  ];

  const useCases = [
    'Real Estate Marketing',
    'Construction Progress Monitoring',
    'Infrastructure Inspection',
    'Event Documentation',
    'Tourism and Marketing',
    'Emergency Response'
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={aerialHero}
            alt="Professional aerial photography and videography"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-80"></div>
          <div className="absolute inset-0 bg-background/20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/#services">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Services
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center px-4 py-2 bg-card/20 backdrop-blur-sm border border-border/30 rounded-full mb-8">
              <Camera className="w-4 h-4 text-accent mr-2" />
              <span className="text-accent font-medium text-sm">Aerial Imagery Services</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Professional Aerial
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Photography & Video
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Capture stunning aerial perspectives with our professional drone photography and videography services.
              From real estate to events, we deliver breathtaking visuals that tell your story.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="group">
                Get Quote
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/portfolio">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Play className="mr-2 w-5 h-5" />
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Advanced Aerial
              <span className="block bg-tech-gradient bg-clip-text text-transparent">
                Imaging Capabilities
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our state-of-the-art equipment and experienced pilots deliver professional-grade aerial imagery
              for any project requirement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="card-hover bg-card-gradient border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Perfect for Every
                <span className="block bg-tech-gradient bg-clip-text text-transparent">
                  Industry & Application
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our aerial imagery services are trusted by professionals across various industries
                for their visual storytelling and documentation needs.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {useCases.map((useCase, index) => (
                  <div
                    key={useCase}
                    className="flex items-center space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{useCase}</span>
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

            <div className="animate-fade-in">
              <Card className="bg-hero-gradient text-white p-8">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <Users className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Trusted by 200+ Clients</h3>
                    <p className="text-white/90">
                      From small businesses to large enterprises, our aerial imagery services
                      have helped clients across Malawi tell their stories from above.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold">500+</div>
                      <div className="text-white/80 text-sm">Projects Completed</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">50K+</div>
                      <div className="text-white/80 text-sm">Photos Captured</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">98%</div>
                      <div className="text-white/80 text-sm">Client Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AerialImagery;