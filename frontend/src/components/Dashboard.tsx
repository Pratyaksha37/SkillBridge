import React, { useState, useEffect } from 'react';
import { Search, Plus, Compass, Terminal, CircleDollarSign, Brush, Star, Handshake, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/users/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-error mb-4">Error loading dashboard</h2>
        <p className="text-on-surface-variant mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="hero-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { user, skills, stats } = data;

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Welcome back, {user.name.split(' ')[0]}.</h1>
        <p className="text-on-surface-variant text-lg">Your radiant skills are in high demand today.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills You Teach */}
          <section className="bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-on-surface">Skills You Teach</h2>
              <button className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Add New <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.teaching.length > 0 ? skills.teaching.map((us: any) => (
                <SkillCard
                  key={us.id}
                  title={us.skill.name}
                  level={us.level || 'Intermediate'}
                  students={12} // Mock student count
                  tags={[us.skill.category]}
                  icon={us.skill.category === 'Coding' ? <Terminal className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                  colorClass={us.skill.category === 'Coding' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-primary-container/20 text-primary'}
                />
              )) : (
                <p className="text-on-surface-variant italic p-4">You haven't added any skills to teach yet.</p>
              )}
            </div>
          </section>

          {/* Skills You Want to Learn */}
          <section className="bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-on-surface">Skills You Want to Learn</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.learning.length > 0 ? skills.learning.map((us: any) => (
                <SkillCard
                  key={us.id}
                  title={us.skill.name}
                  level={us.level || 'Beginner'}
                  tags={[us.skill.category]}
                  icon={us.skill.category === 'Finance' ? <CircleDollarSign className="w-6 h-6" /> : <Brush className="w-6 h-6" />}
                  colorClass={us.skill.category === 'Finance' ? 'bg-secondary-container/20 text-secondary' : 'bg-primary-container/10 text-primary'}
                />
              )) : (
                <p className="text-on-surface-variant italic p-4">You haven't listed any skills you want to learn yet.</p>
              )}
            </div>
          </section>

          {/* Stats Bento */}
          <div className="grid grid-cols-3 gap-4">
            <StatBox value={stats.hoursTaught.toString()} label="Hours Taught" color="primary" />
            <StatBox value={stats.hoursLearned.toString()} label="Hours Learned" color="tertiary" />
            <StatBox value={stats.rating.toString()} label="Teacher Rating" color="secondary" />
          </div>
        </div>

        {/* Right Column: Suggested Matches */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Suggested Matches</h2>
            <div className="space-y-4">
              <MatchCard
                name="Elena S."
                role="Venture Capitalist"
                matchRate="98% Match"
                offers={['Angel Investing', 'Pitch Decks']}
                wants={['UI Design']}
                imageUrl="https://picsum.photos/seed/elena/150/150"
              />
              <MatchCard
                name="Marcus T."
                role="Fullstack Engineer"
                offers={['Advanced Node.js']}
                wants={['Design Systems']}
                imageUrl="https://picsum.photos/seed/marcus/150/150"
                secondary
              />
              <button className="w-full py-4 text-on-surface-variant font-semibold text-sm border-2 border-dashed border-outline-variant/30 rounded-xl hover:border-primary/50 hover:text-primary transition-all">
                View all 42 matches
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface SkillCardProps {
  title: string;
  level: string;
  students?: number;
  tags: string[];
  icon: React.ReactNode;
  colorClass: string;
}

function SkillCard({ title, level, students, tags, icon, colorClass }: SkillCardProps) {
  return (
    <div
      className="bg-surface-container-lowest p-6 rounded-xl ghost-border transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-on-surface">{title}</h3>
          <p className="text-xs text-on-surface-variant">{level} {students ? `• ${students} Students` : ''}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

interface StatBoxProps {
  value: string;
  label: string;
  color: 'primary' | 'tertiary' | 'secondary';
}

function StatBox({ value, label, color }: StatBoxProps) {
  const colors = {
    primary: "bg-primary-container/10 text-primary",
    tertiary: "bg-tertiary-container/10 text-tertiary",
    secondary: "bg-secondary-container/10 text-secondary"
  };
  return (
    <div className={`${colors[color]} p-6 rounded-2xl flex flex-col justify-center items-center text-center`}>
      <span className="text-3xl font-extrabold">{value}</span>
      <span className="text-xs font-medium text-on-surface-variant mt-1">{label}</span>
    </div>
  );
}

interface MatchCardProps {
  name: string;
  role: string;
  matchRate?: string;
  offers: string[];
  wants: string[];
  imageUrl: string;
  secondary?: boolean;
}

function MatchCard({ name, role, matchRate, offers, wants, imageUrl, secondary = false }: MatchCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] ambient-shadow border border-white relative overflow-hidden group">
      {matchRate && (
        <div className="absolute top-0 right-0 p-4">
          <span className="bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
            {matchRate}
          </span>
        </div>
      )}
      <div className="flex gap-4 mb-4">
        <img src={imageUrl} alt={name} className="w-14 h-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
        <div>
          <h4 className="font-bold text-on-surface text-lg">{name}</h4>
          <p className="text-sm text-on-surface-variant">{role}</p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Offers to teach</p>
          <div className="flex flex-wrap gap-2">
            {offers.map(s => (
              <span key={s} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Wants to learn</p>
          <div className="flex flex-wrap gap-2">
            {wants.map(s => (
              <span key={s} className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-lg text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>
      <button className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${secondary
          ? 'bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary'
          : 'hero-gradient text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95'
        }`}>
        Connect with {name.split(' ')[0]}
      </button>
    </div>
  );
}
