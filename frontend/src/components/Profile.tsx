import { motion } from 'motion/react';
import { MapPin, Clock, Languages, Edit2, Handshake, Star, Share2, Mail, Plus } from 'lucide-react';

export default function Profile() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <header className="relative mb-12">
        <div className="h-48 md:h-64 w-full rounded-3xl hero-gradient opacity-20 mb-[-4rem] md:mb-[-6rem]"></div>
        <div className="flex flex-col md:flex-row items-end gap-6 px-4 md:px-12 relative z-10">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-surface-container-lowest p-2 shadow-xl shadow-on-surface/5">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
              <img 
                src="https://picsum.photos/seed/alex/400/400" 
                alt="Alex Rivera" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-2 md:pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">Alex Rivera</h1>
              <p className="text-on-surface-variant font-medium mt-1">Senior Product Designer & Digital Strategist</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 md:mt-0 px-8 py-3.5 hero-gradient text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </motion.button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] ambient-shadow">
            <h2 className="text-xl font-bold text-on-surface mb-4">About</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Passionate about bridging the gap between design and functionality. I have 8+ years of experience in creating user-centric digital experiences. Always looking to share my knowledge of UX systems while learning more about motion design and rapid prototyping.
            </p>
            <div className="mt-8 space-y-4">
              <InfoItem icon={<MapPin className="w-5 h-5" />} text="San Francisco, CA" />
              <InfoItem icon={<Clock className="w-5 h-5" />} text="Available for 3-5 hours/week" />
              <InfoItem icon={<Languages className="w-5 h-5" />} text="English, Spanish" />
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary-container/30 p-6 rounded-[2rem] text-center">
              <div className="text-2xl font-black text-secondary">24</div>
              <div className="text-xs font-bold text-secondary-dim uppercase tracking-wider mt-1">Exchanges</div>
            </div>
            <div className="bg-tertiary-container/30 p-6 rounded-[2rem] text-center">
              <div className="text-2xl font-black text-tertiary">4.9</div>
              <div className="text-xs font-bold text-tertiary-dim uppercase tracking-wider mt-1">Rating</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <SkillSection 
            title="Skills Offered" 
            icon={<Handshake className="w-6 h-6" />}
            skills={['User Interface Design', 'Product Strategy', 'Figma Mastery', 'Design Systems', 'User Research']}
            color="secondary"
            addLabel="Add Skill"
          />
          
          <SkillSection 
            title="Skills Wanted" 
            icon={<Star className="w-6 h-6" />}
            skills={['Motion Graphics', 'After Effects', '3D Modeling (Spline)', 'Public Speaking']}
            color="tertiary"
            addLabel="Add Want"
          />

          <section className="bg-surface-container-lowest p-8 rounded-[2rem] ambient-shadow">
            <h2 className="text-xl font-bold text-on-surface mb-6">Recent Activity</h2>
            <div className="space-y-6">
              <ActivityItem 
                icon={<Handshake className="w-6 h-6 text-primary" />}
                title="Skill Exchange Completed"
                description="Taught UX Principles to Sarah J. in exchange for Motion Design basics."
                time="2 Days Ago"
              />
              <ActivityItem 
                icon={<Star className="w-6 h-6 text-tertiary" />}
                title="New Review Received"
                description='"Alex is a patient mentor. His knowledge of design systems is unmatched!"'
                time="1 Week Ago"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-on-surface-variant">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function SkillSection({ title, icon, skills, color, addLabel }: { title: string; icon: React.ReactNode; skills: string[]; color: string; addLabel: string }) {
  const colorClasses = color === 'secondary' 
    ? 'bg-secondary-container text-on-secondary-container' 
    : 'bg-tertiary-container text-on-tertiary-container';
  const iconBg = color === 'secondary' ? 'bg-primary-container/20' : 'bg-tertiary-container/20';
  const iconColor = color === 'secondary' ? 'text-primary' : 'text-tertiary';
  const borderDashed = color === 'secondary' ? 'border-primary/30 text-primary' : 'border-tertiary/30 text-tertiary';

  return (
    <section className="bg-surface-container-low p-8 rounded-[2rem]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>{icon}</span>
          <h2 className="text-xl font-bold text-on-surface">{title}</h2>
        </div>
        <button className={`${iconColor} font-bold text-sm hover:underline`}>Manage</button>
      </div>
      <div className="flex flex-wrap gap-3">
        {skills.map(skill => (
          <div key={skill} className={`px-5 py-2.5 ${colorClasses} font-semibold rounded-xl text-sm`}>
            {skill}
          </div>
        ))}
        <button className={`px-5 py-2.5 bg-surface-container-lowest font-bold rounded-xl text-sm border border-dashed ${borderDashed} flex items-center gap-2`}>
          <Plus className="w-4 h-4" /> {addLabel}
        </button>
      </div>
    </section>
  );
}

function ActivityItem({ icon, title, description, time }: { icon: React.ReactNode; title: string; description: string; time: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-on-surface">{title}</h4>
        <p className="text-sm text-on-surface-variant">{description}</p>
        <span className="text-[10px] font-bold text-outline-variant uppercase mt-1 inline-block">{time}</span>
      </div>
    </div>
  );
}
