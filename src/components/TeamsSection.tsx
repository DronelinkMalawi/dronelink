'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Mail, Twitter, X, Award, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import teamCEO from '@/assets/team-ceo.jpg';
import teamCTO from '@/assets/team-cto.jpg';
import teamGIS from '@/assets/team-gis.jpg';
import teamPilot from '@/assets/team-pilot.jpg';
import teamDev from '@/assets/team-dev.jpg';
import teamMarketing from '@/assets/team-marketing.jpg';

const TeamsSection = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const teamMembers = [
    {
      name: 'Rachel Kaunda',
      role: 'Chief Executive Officer',
      image: teamCEO,
      bio: 'With a degree in geology and extensive experience in spatial imaging, Rachel leads DroneLinkMW with a vision for integrating advanced aerial technology into Malawi’s industrial landscape.',
      expertise: ['Strategic Leadership', 'Geological Surveying', 'Business Development'],
      social: {
        linkedin: 'https://www.linkedin.com/in/rachel-kumwenda-kaunda-2252b0168/',
        email: 'rachelkaunda@dronelinkmw.com',
        twitter: '#',
      },
    },
    
    {
      name: 'Edith Kalagho',
      role: 'Land Surveyor',
      image: teamGIS,
      bio: 'Specializing in high-precision land surveying and spatial analysis, Edith ensures every mission meets strict accuracy standards for infrastructure projects.',
      expertise: ['GIS Analysis', 'Cadastral Surveying', 'Remote Sensing'],
      social: {
        linkedin: '#',
        email: 'edithkalagho@dronelinkmw.com',
        twitter: '#',
      },
    },
    {
      name: 'Bright Mataya',
      role: 'Senior Drone Pilot',
      image: teamPilot,
      bio: 'A certified commercial pilot with thousands of flight hours, Bright leads our flight operations with a focus on safety and cinematic precision.',
      expertise: ['Flight Ops', 'Aerial Cinematography', 'Safety Management'],
      social: {
        linkedin: '#',
        email: 'brightmataya@dronelinkmw.com',
        twitter: '#',
      },
    },
    
    {
      name: 'Aaron Amos',
      role: 'Strategy Lead',
      image: teamMarketing,
      bio: 'Driving growth and brand visibility, Aaron ensures DroneLinkMW remains the leading choice for enterprise aerial intelligence in the region.',
      expertise: ['Market Strategy', 'Partnerships'],
      social: {
        linkedin: '#',
        email: 'aaronamos@dronelinkmw.com',
        twitter: '#',
      },
    },
  ];

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="team" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-2xl mb-12 md:mb-20">
            <h2 className="text-sm font-mono text-cyan-600 tracking-[0.3em] uppercase mb-4">// THE CREW</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-950">
                Driven by <span className="text-slate-400 font-light italic">Expertise.</span>
            </h3>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ y: -10 }}
              onClick={() => handleMemberClick(member)}
              className="group cursor-pointer"
            >
              <Card className="border-none bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-0">
                  {/* MOBILE FIX: Added aspect-ratio and object-top to prevent head cut-offs */}
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-slate-200">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <span className="text-white text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                            View Profile <ExternalLink className="w-3 h-3" />
                        </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{member.name}</h3>
                    <p className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.2em]">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white max-w-5xl w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[600px]"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 bg-slate-100 md:bg-white/10 backdrop-blur-md p-2 rounded-full text-slate-950 md:text-white transition-colors border border-black/5 md:border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MOBILE FIX: Modal image height adjusted and object-top applied */}
              <div className="w-full md:w-2/5 h-72 sm:h-80 md:h-auto shrink-0 relative bg-slate-100">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-8 md:p-16 overflow-y-auto bg-white">
                <div className="mb-8">
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-950 mb-2 tracking-tighter">{selectedMember.name}</h3>
                    <p className="text-cyan-600 font-mono text-xs uppercase tracking-[0.3em]">{selectedMember.role}</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Award className="w-3 h-3" /> Biography
                        </h4>
                        <p className="text-slate-600 leading-relaxed font-light text-base md:text-lg italic">
                          "{selectedMember.bio}"
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selectedMember.expertise.map((skill: string) => (
                            <span key={skill} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-100 text-slate-600 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex items-center gap-6">
                        <a href={selectedMember.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href={`mailto:${selectedMember.social.email}`} className="text-slate-400 hover:text-cyan-600 transition-colors">
                            <Mail className="w-5 h-5" />
                        </a>
                        <a href={selectedMember.social.twitter} className="text-slate-400 hover:text-cyan-600 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TeamsSection;