import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Linkedin, Mail, Twitter, X } from 'lucide-react';
import teamCEO from '@/assets/team-ceo.jpg';
import teamCTO from '@/assets/team-cto.jpg';
import teamPilot from '@/assets/team-pilot.jpg';
import teamGIS from '@/assets/team-gis.jpg';
import teamDev from '@/assets/team-dev.jpg';
import teamMarketing from '@/assets/team-marketing.jpg';
import teamMember7 from '@/assets/1team-ceo.jpg';
import teamMember8 from '@/assets/1team-cto.jpg';
import teamMember9 from '@/assets/1team-pilot.jpg';

interface TeamMember {
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
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamMembers = [
    {
      name: 'Rachel Kaunda',
      role: 'Chief Executive Officer',
      image: teamCEO,
      bio: 'With a degree in geology and working experience in imaging and surveying, Rachel leads a team of innovative and experienced individuals at Drone Link.',
      expertise: ['Strategic Leadership', 'Aviation Industry', 'Business Development'],
      social: {
        linkedin: 'https://www.linkedin.com/in/rachel-kumwenda-kaunda-2252b0168/',
        email: 'rachelkaunda@dronelinkmw.com',
        facebook: 'https://www.linkedin.com/in/rachel-kumwenda-kaunda-2252b0168/'
      }
    },
    {
      name: 'Harvey Mmangisa',
      role: 'GIS Specialist',
      image: teamCTO,
      bio: 'Computer Programmer, software developer and tutor .',
      expertise: ['Machine Learning', 'Software Development', 'Trainer'],
      social: {
        linkedin: 'https://www.linkedin.com/in/harvey-mmangisa-2148ba175/',
        email: 'harveymmangisa@dronelinkmw.com',
        twitter: '#'
      }
    },
    {
      name: 'Edith Kalagho',
      role: 'Administrator & Land Surveyor',
      image: teamGIS,
      bio: 'With a degree in geology and experience in spatial analysis and remote sensing, Edith leads a team of skilled and innovative professionals at Drone Link.',
      expertise: ['GIS Analyst', 'Spatial Analysis', ' Drone pilot'],
      social: {
        linkedin: '#',
        email: 'edithkalagho@dronelinkmw.com',
        twitter: '#'
      }
    },
    {
      name: 'Bright Mataya',
      role: 'Senior Drone Pilot',
      image: teamPilot,
      bio: 'Certified commercial pilot with over 2000 flight hours. Specialized in complex aerial operations.',
      expertise: ['Commercial Aviation', 'Aerial Photography', 'Flight Operations', 'Software Development'],
      social: {
        linkedin: '#',
        email: 'brightmataya@dronelinkmw.com',
        twitter: '#'
      }
    },
    {
      name: 'Mtendere Matola',
      role: 'Drone Pilot',
      image: teamDev,
      bio: 'Geospatial expert transforming aerial data into actionable insights for agriculture and conservation.',
      expertise: ['GIS Analysis', 'Remote Sensing', 'Environmental Monitoring'],
      social: {
        linkedin: 'https://www.linkedin.com/in/harvey-mmangisa-2148ba175/',
        email: 'matolamtende@dronelinkmw.com',
        twitter: '#'
      }
    },
     {
      name: 'Aaron Amos',
      role: 'Marketing and Strategy Lead',
      image: teamMarketing,
      bio: 'Marketing specialist driving growth and brand visibility through innovative strategies.',
      expertise: ['Marketing', 'Strategy Development', 'Customer Relations'],
      social: {
        linkedin: 'https://www.linkedin.com/in/harvey-mmangisa-2148ba175/',
        email: 'matolamtende@dronelinkmw.com',
        twitter: '#'
      }
    },
  
  ];

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="team" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mb-6">
            <span className="text-secondary font-medium text-sm">Our Team</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Meet the Experts Behind
            <span className="block bg-tech-gradient bg-clip-text text-transparent">
              DronelinkMW Innovation
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our diverse team of aviation experts, technology specialists, and data scientists work together 
            to deliver cutting-edge drone solutions that transform industries across Malawi and beyond.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Card
              key={member.name}
              className="group card-hover bg-card-gradient border-border/50 overflow-hidden animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleMemberClick(member)}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-auto max-h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={member.social.linkedin}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={`mailto:${member.social.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={member.social.twitter || '#'}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                      aria-label={`${member.name} Twitter`}
                    >
                      <Twitter className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-secondary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 2 && (
                        <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
                          +{member.expertise.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal Popup */}
        {isModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
            <div 
              className="absolute inset-0 bg-foreground/10" 
              onClick={closeModal}
            ></div>
            <div className="relative bg-background border-border/50 border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 animate-scale-in">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-2/5">
                  <img
                    src={selectedMember.image}
                    alt={`${selectedMember.name} - ${selectedMember.role}`}
                    className="w-full h-64 md:h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                  />
                </div>
                
                {/* Content Section */}
                <div className="md:w-3/5 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {selectedMember.name}
                  </h3>
                  <p className="text-secondary font-medium text-lg mb-4">{selectedMember.role}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {selectedMember.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="space-y-3 mb-6">
                    <p className="text-lg font-medium text-foreground">Areas of Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4">
                    <a
                      href={selectedMember.social.linkedin}
                      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label={`${selectedMember.name} LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${selectedMember.social.email}`}
                      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label={`Email ${selectedMember.name}`}
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={selectedMember.social.twitter || '#'}
                      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label={`${selectedMember.name} Twitter`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Join Team CTA */}
        <div className="text-center">
          <Card className="bg-hero-gradient text-white max-w-4xl mx-auto animate-fade-in">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Join Our Growing Team
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals who share our passion for innovation 
                and excellence in drone technology. Explore career opportunities with DronelinkMW.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/open-positions">
                  <Button variant="accent" size="lg">
                    View Open Positions
                  </Button>
                </Link>
                <Link to="/submit-resume">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                    Submit Resume
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TeamsSection;
