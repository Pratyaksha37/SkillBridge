import React from 'react';
import { motion } from 'motion/react';
import { Search, ArrowRight, Star, UserPlus, Handshake, Sparkles, Palette, Code, CookingPot, Languages, Camera, BrainCircuit } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-8"
              >
                Learn and Teach <span className="text-primary italic">Skills</span> Locally
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-on-surface-variant max-w-xl mb-12 leading-relaxed"
              >
                Connect with neighborhood experts to master new crafts or share your own mastery. SkillBridge turns your community into a vibrant, peer-to-peer classroom.
              </motion.p>
              <div className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hero-gradient text-on-primary px-8 py-5 rounded-xl text-lg font-bold flex items-center gap-2 shadow-xl shadow-primary/10"
                >
                  Find Skills
                  <Search className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-surface-container-highest text-primary px-8 py-5 rounded-xl text-lg font-bold hover:bg-surface-variant transition-all"
                >
                  Start Teaching
                </motion.button>
              </div>
              
              <div className="mt-16 flex items-center gap-6 opacity-60">
                <span className="text-sm font-semibold tracking-widest uppercase text-on-surface-variant">Trusted by thousands in:</span>
                <div className="flex gap-4 font-bold text-lg">
                  <span>London</span>
                  <span>New York</span>
                  <span>Tokyo</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-primary-fixed/20 rounded-3xl rotate-3 -z-10"></div>
                <div className="absolute inset-0 bg-surface-container-highest rounded-3xl -rotate-3 -z-10"></div>
                <img 
                  src="https://picsum.photos/seed/pottery/800/800" 
                  alt="Expert mentoring" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-2xl shadow-2xl flex items-center gap-4 border border-outline-variant/10"
                >
                  <div className="bg-secondary-container p-3 rounded-xl">
                    <Star className="w-6 h-6 text-on-secondary-container fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Mastery Achieved</p>
                    <p className="text-sm text-on-surface-variant">250+ Local Mentors</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-container/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-tertiary-container/20 blur-[80px] rounded-full"></div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-surface-container-low rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-6">How It Works</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Three simple steps to unlock the potential within your neighborhood.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              title="Join"
              description="Create your radiant profile showcasing what you know or what you're dying to learn. No rigid forms, just your story."
              icon={<UserPlus className="w-8 h-8" />}
              colorClass="bg-primary-container/30 text-primary"
              linkText="Start Your Profile"
            />
            <StepCard 
              number="2"
              title="Match"
              description="Our curator engine finds the perfect peer match based on skill depth, proximity, and personal learning styles."
              icon={<Handshake className="w-8 h-8" />}
              colorClass="bg-secondary-container/50 text-secondary"
              linkText="Browse Exchanges"
              featured
            />
            <StepCard 
              number="3"
              title="Learn"
              description="Meet up, exchange wisdom, and build real connections. Learn at your own pace in a pressure-free environment."
              icon={<Sparkles className="w-8 h-8" />}
              colorClass="bg-tertiary-container/30 text-tertiary"
              linkText="View Success Stories"
            />
          </div>
        </div>
      </section>

      {/* Trending Skills Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold mb-4">Trending Skills Today</h2>
            <p className="text-on-surface-variant">Discover the most sought-after expertise in your local circle right now.</p>
          </div>
          <button className="text-primary font-bold flex items-center gap-2 border-b-2 border-primary pb-1">
            View All Categories
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <SkillChip icon={<Palette className="w-5 h-5" />} label="UI/UX Design" color="secondary" />
          <SkillChip icon={<Code className="w-5 h-5" />} label="React Development" color="tertiary" />
          <SkillChip icon={<CookingPot className="w-5 h-5" />} label="Artisan Baking" color="surface" />
          <SkillChip icon={<Languages className="w-5 h-5" />} label="Conversational Spanish" color="secondary" />
          <SkillChip icon={<Camera className="w-5 h-5" />} label="Street Photography" color="tertiary" />
          <SkillChip icon={<BrainCircuit className="w-5 h-5" />} label="Chess Mastery" color="surface" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto bg-inverse-surface text-on-primary p-12 md:p-24 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Ready to bridge the gap in your skills?</h2>
            <p className="text-inverse-on-surface text-lg mb-10">Join 50,000+ neighbors who are redefining how we share knowledge.</p>
            <button className="hero-gradient text-on-primary px-10 py-5 rounded-xl font-bold text-lg shadow-2xl">
              Start for Free Today
            </button>
          </div>
          <div className="relative w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-2xl z-10">
            <img 
              src="https://picsum.photos/seed/community/800/450" 
              alt="Group of learners" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary rounded-full opacity-10 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  linkText: string;
  featured?: boolean;
}

function StepCard({ number, title, description, icon, colorClass, linkText, featured = false }: StepCardProps) {
  return (
    <div 
      className={`bg-surface-container-lowest p-10 rounded-[2rem] ambient-shadow transition-all duration-500 flex flex-col items-start group relative overflow-hidden hover:-translate-y-2 ${featured ? 'border-2 border-primary/5' : ''}`}
    >
      {featured && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>}
      <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{number}. {title}</h3>
      <p className="text-on-surface-variant leading-relaxed">{description}</p>
      <div className="mt-8 pt-8 border-t border-surface-container-high w-full">
        <button className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          {linkText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface SkillChipProps {
  icon: React.ReactNode;
  label: string;
  color: 'secondary' | 'tertiary' | 'surface';
}

function SkillChip({ icon, label, color }: SkillChipProps) {
  const colorMap = {
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-tertiary-container text-on-tertiary-container",
    surface: "bg-surface-container-highest text-on-surface-variant"
  };
  
  return (
    <span className={`${colorMap[color]} px-6 py-3 rounded-lg font-semibold flex items-center gap-2`}>
      {icon} {label}
    </span>
  );
}
