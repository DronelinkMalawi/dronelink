'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Mail, Twitter, X, Award, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeam } from '@/contexts/TeamContext';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
  social: {
    linkedin: string;
    email: string;
    twitter: string;
  };
}

const TeamsSection = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { teamMembers: dbTeamMembers, loading } = useTeam();

  useEffect(() => {
    if (dbTeamMembers && dbTeamMembers.length > 0) {
      const transformedMembers = dbTeamMembers
        .filter(member => member.is_active)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          image: member.profile_image_url || '',
          bio: member.bio || '',
          expertise: member.expertise || [],
          social: {
            linkedin: (member.social_links?.linkedin as string) || '#',
            email: member.email || '',
            twitter: (member.social_links?.twitter as string) || '#',
          },
        }));
      setTeamMembers(transformedMembers);
    }
  }, [dbTeamMembers]);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
  };

  const renderHeader = () => (
    <div className="max-w-3xl mx-auto text-center mb-14">
      <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-400/90">
        <span className="h-px w-8 bg-cyan-400/70" aria-hidden />
        The Team
      </p>
      <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white tracking-tight">
        Driven by expertise.
      </h2>
      <p className="mt-4 text-lg text-slate-300/90 max-w-2xl mx-auto">
        Specialists across aviation, spatial analysis, and engineering —
        united by a shared standard of precision.
      </p>
    </div>
  );

  if (loading) {
    return (
      <section id="team" className="py-24 lg:py-28 bg-slate-900/40">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          {renderHeader()}
          <p className="text-slate-400">Loading team members...</p>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section id="team" className="py-24 lg:py-28 bg-slate-900/40">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          {renderHeader()}
          <p className="text-slate-400">No team members added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-24 lg:py-28 bg-slate-900/40">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {renderHeader()}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ y: -8 }}
              onClick={() => handleMemberClick(member)}
              className="group cursor-pointer"
            >
              <Card className="border border-white/10 bg-slate-900/70 rounded-2xl shadow-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-slate-800">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl bg-slate-800">
                        <span className="text-slate-500">{member.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent">
                      <span className="text-white text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                        View Profile <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white tracking-tight">{member.name}</h3>
                    <p className="text-sm text-cyan-400/80 mt-1">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative bg-slate-900 border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[600px]"
            >
              <button
                onClick={closeModal}
                aria-label="Close profile"
                className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-2/5 h-72 sm:h-80 md:h-auto shrink-0 relative bg-slate-800">
                {selectedMember.image ? (
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-slate-500">
                    {selectedMember.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{selectedMember.name}</h3>
                <p className="text-cyan-400 font-medium text-sm uppercase tracking-[0.15em] mt-2">{selectedMember.role}</p>

                <div className="mt-8 space-y-6">
                  {selectedMember.bio && (
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-400" /> Biography
                      </h4>
                      <p className="text-slate-300 leading-relaxed">“{selectedMember.bio}”</p>
                    </div>
                  )}

                  {selectedMember.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.expertise.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-slate-800/80 text-slate-200 rounded-full text-xs font-medium border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/10 flex items-center gap-5">
                    <a
                      href={selectedMember.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${selectedMember.name} on LinkedIn`}
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${selectedMember.social.email}`}
                      aria-label={`Email ${selectedMember.name}`}
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={selectedMember.social.twitter}
                      aria-label={`${selectedMember.name} on Twitter`}
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                    >
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