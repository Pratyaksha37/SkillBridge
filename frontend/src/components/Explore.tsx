import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Calendar, Star, ArrowRight, Loader2 } from 'lucide-react';

export default function Explore() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/users/mentors`);
        if (!response.ok) throw new Error('Failed to fetch mentors');
        const data = await response.json();

        // Map backend data to UI structure
        const mappedMentors = data.map((u: any) => ({
          name: u.name,
          role: u.title || 'Expert Mentor',
          rating: 4.9, // Mock rating for now
          bio: u.bio,
          tags: u.userSkills
            .filter((us: any) => us.type === 'OFFER')
            .map((us: any) => us.skill.name),
          imageUrl: u.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`,
          isNew: new Date(u.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000) // New if < 1 week old
        }));

        setMentors(mappedMentors);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

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
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-90 cursor-pointer">
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
        <button className="bg-surface-container-low text-primary font-bold px-12 py-5 rounded-2xl hover:bg-surface-container-high transition-colors scale-95 active:scale-90 cursor-pointer">
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
      className="group bg-surface-container-lowest rounded-[2rem] p-6 ambient-shadow flex flex-col h-full border border-transparent hover:border-primary/5 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
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
            <span key={tag} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${tag.includes('Design') || tag.includes('Dev') || tag.includes('Marketing') || tag.includes('Science') || tag.includes('Photo') || tag.includes('Strategy')
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container-low text-on-surface-variant'
              }`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full py-4 rounded-xl font-bold text-primary bg-surface-container-low hover:bg-primary hover:text-white transition-all scale-95 active:scale-90 flex items-center justify-center gap-2 cursor-pointer">
        Connect
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
