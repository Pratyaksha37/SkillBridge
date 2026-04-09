import React from 'react';
import { Search, SlidersHorizontal, Calendar, Star, ArrowRight } from 'lucide-react';

export default function Explore() {
  const mentors = [
    { name: 'Sarah Chen', role: 'Senior Product Designer', rating: 4.9, bio: 'Specializing in UX research and interactive prototypes.', tags: ['UI/UX Design', 'Figma'], isNew: true, imageUrl: 'https://picsum.photos/seed/sarah/200/200' },
    { name: 'Marcus Thorne', role: 'Full-stack Architect', rating: 5.0, bio: 'Passion for teaching React and Node.js best practices.', tags: ['Full-stack Dev', 'React'], imageUrl: 'https://picsum.photos/seed/marcus2/200/200' },
    { name: 'Elena Rodriguez', role: 'Digital Marketing Strategist', rating: 4.8, bio: 'Helping startups grow through SEO and content.', tags: ['Growth Marketing', 'SEO'], imageUrl: 'https://picsum.photos/seed/elena2/200/200' },
    { name: 'David Kim', role: 'Data Scientist', rating: 4.7, bio: 'Expertise in machine learning and visualization using Python.', tags: ['Data Science', 'Python'], imageUrl: 'https://picsum.photos/seed/david/200/200' },
    { name: 'Sam Wilson', role: 'Professional Photographer', rating: 4.9, bio: 'Teaching the art of visual storytelling and light composition.', tags: ['Photography', 'Lightroom'], imageUrl: 'https://picsum.photos/seed/sam/200/200' },
    { name: 'Maya Patil', role: 'Content Strategist', rating: 4.6, bio: 'Helping tech companies tell their story better.', tags: ['Content Strategy', 'Writing'], imageUrl: 'https://picsum.photos/seed/maya/200/200' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-8">
          Find Your Next <span className="text-primary">Skill Match</span>
        </h1>
        
        <div className="bg-surface-container-low p-2 rounded-[2rem] flex flex-col lg:flex-row gap-4 items-center shadow-sm">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline-variant w-6 h-6" />
            <input 
              className="w-full pl-14 pr-6 py-5 bg-surface-container-lowest border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-medium text-lg placeholder:text-outline-variant outline-none" 
              placeholder="What skill are you looking for?" 
              type="text"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto p-2">
            <FilterSelect icon={<SlidersHorizontal className="w-5 h-5" />} label="Skill Category" />
            <FilterSelect icon={<Calendar className="w-5 h-5" />} label="Availability" />
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-90">
              Search
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mentors.map((mentor) => (
          <MentorCard 
            key={mentor.name} 
            name={mentor.name}
            role={mentor.role}
            rating={mentor.rating}
            bio={mentor.bio}
            tags={mentor.tags}
            isNew={mentor.isNew}
            imageUrl={mentor.imageUrl}
          />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <button className="bg-surface-container-low text-primary font-bold px-12 py-5 rounded-2xl hover:bg-surface-container-high transition-colors scale-95 active:scale-90">
          Load More Mentors
        </button>
      </div>
    </main>
  );
}

function FilterSelect({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="relative min-w-[180px]">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">{icon}</span>
      <select className="w-full pl-12 pr-10 py-4 bg-surface-container-lowest border-none rounded-2xl appearance-none font-semibold text-on-surface-variant cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none">
        <option>{label}</option>
      </select>
    </div>
  );
}

interface MentorCardProps {
  name: string;
  role: string;
  rating: number;
  bio: string;
  tags: string[];
  isNew?: boolean;
  imageUrl: string;
  key?: React.Key;
}

function MentorCard({ name, role, rating, bio, tags, isNew, imageUrl }: MentorCardProps) {
  return (
    <div 
      className="group bg-surface-container-lowest rounded-[2rem] p-6 ambient-shadow flex flex-col h-full border border-transparent hover:border-primary/5 transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative mb-6">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-surface-container-low group-hover:ring-primary/10 transition-all"
          referrerPolicy="no-referrer"
        />
        {isNew && (
          <div className="absolute -top-2 -right-2 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            New
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xl text-on-surface">{name}</h3>
          <div className="flex items-center gap-1 text-on-surface-variant font-semibold text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            {rating}
          </div>
        </div>
        <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">{bio}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map(tag => (
            <span key={tag} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              tag.includes('Design') || tag.includes('Dev') || tag.includes('Marketing') || tag.includes('Science') || tag.includes('Photo') || tag.includes('Strategy')
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <button className="w-full py-4 rounded-xl font-bold text-primary bg-surface-container-low hover:bg-primary hover:text-white transition-all scale-95 active:scale-90 flex items-center justify-center gap-2">
        Connect
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
