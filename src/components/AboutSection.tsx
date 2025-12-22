import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Award, Users, Zap, ArrowRight, Target, Leaf, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { 
      icon: Shield, 
      value: '500+', 
      label: 'Projects Completed', 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    { 
      icon: Award, 
      value: '99%', 
      label: 'Client Satisfaction', 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    { 
      icon: Users, 
      value: '50+', 
      label: 'Expert Team Members', 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    { 
      icon: Zap, 
      value: '24/7', 
      label: 'Support Available', 
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation First',
      description: 'We constantly push the boundaries of drone technology to deliver cutting-edge solutions.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Precision & Quality',
      description: 'Every project is executed with meticulous attention to detail and the highest quality standards.',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Leaf,
      title: 'Sustainable Solutions',
      description: 'Our drone services contribute to environmental monitoring and sustainable development practices.',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-20 lg:mb-28">
          {/* Content Side */}
          <div className={`space-y-8 transition-all duration-1000 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            <div className="space-y-2">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full mb-2 group hover:bg-blue-500/15 transition-all duration-300 cursor-pointer">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></div>
                <span className="text-blue-600 font-medium text-sm tracking-wide">About DronelinkMW</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Pioneering the
                <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  Future of Aerial
                </span>
                Intelligence
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                Founded with a vision to revolutionize how we collect and analyze aerial data,{' '}
                <span className="font-semibold text-slate-800">DronelinkMW</span> combines 
                cutting-edge drone technology with advanced AI and spatial analysis to deliver 
                unprecedented insights for agriculture, mapping, and environmental monitoring.
              </p>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                Our team of certified drone pilots, GIS specialists, and data scientists work together to 
                provide comprehensive solutions that help businesses make informed decisions based on 
                accurate, real-time aerial data.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center">
                  Our Story
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Meet Our Team
              </Button>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`space-y-8 transition-all duration-1000 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            {/* Mission Card */}
            <Card className="relative bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-2xl shadow-blue-500/10 rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed font-light text-lg">
                    Empowering industries with intelligent aerial solutions that drive innovation, 
                    sustainability, and data-driven decision making.
                  </p>
                </div>
                
                {/* Values */}
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div
                      key={value.title}
                      className={`flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm border border-slate-200/40 rounded-2xl group hover:bg-white/80 hover:border-slate-300/60 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100 + 500}ms` }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-2 text-lg">{value.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className={`relative bg-white/80 backdrop-blur-md border ${stat.borderColor} rounded-2xl overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100 + 800}ms` }}
            >
              <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <CardContent className="relative z-10 p-6 lg:p-8 text-center">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium text-sm lg:text-base">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Trust Element */}
        <div className={`text-center mt-16 transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4">
            <Heart className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">
              Trusted by 100+ companies across Africa
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;