import { useState, useEffect } from 'react';
import { Compass, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConnectModal from './ConnectModal';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/dashboard`, {
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
      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  const handleConnect = async (peer: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: peer.id || peer.receiverId })
      });

      if (!response.ok) throw new Error('Failed to save connection');

      setSelectedMatch(peer);
      fetchDashboard(); // Refresh to show in connections list
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemoveConnection = async (receiverId: string) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/connections/${receiverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to remove connection');
      
      setData((prev: any) => ({
        ...prev,
        connections: prev.connections.filter((c: any) => c.id !== receiverId)
      }));
    } catch (err: any) {
      alert(err.message);
    }
  };

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

  const { user, connections, stats } = data;

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      {selectedMatch && (
        <ConnectModal
          name={selectedMatch.name}
          email={selectedMatch.email}
          id={selectedMatch.id}
          onClose={() => setSelectedMatch(null)}
        />
      )}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Welcome back, {user.name.split(' ')[0]}.</h1>
        <p className="text-on-surface-variant text-lg">Your radiant skills are in high demand today.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* My Connections */}
          <section className="bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-on-surface">My Connections</h2>
              <button
                onClick={() => navigate('/explore')}
                className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
              >
                Discover More <Compass className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections && connections.length > 0 ? connections.map((conn: any) => (
                <div key={conn.id} className="bg-surface-container-lowest p-6 rounded-2xl ambient-shadow border border-white/50 group relative">
                  <button 
                    onClick={() => handleRemoveConnection(conn.id)}
                    className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Remove Connection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conn.email}`}
                      className="w-12 h-12 rounded-xl bg-primary/5"
                      alt={conn.name}
                    />
                    <div>
                      <h3 className="font-bold text-on-surface">{conn.name}</h3>
                      <p className="text-xs text-primary font-bold">{conn.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {conn.skills.slice(0, 2).map((s: string) => (
                      <span key={s} className="px-2 py-1 bg-secondary-container/30 text-secondary text-[10px] font-bold rounded-lg uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedMatch(conn)}
                    className="w-full py-2 rounded-lg bg-surface-container-high text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              )) : (
                <div className="col-span-2 py-12 text-center bg-surface-container-lowest/50 rounded-2xl border-2 border-dashed border-outline-variant/20">
                  <p className="text-on-surface-variant italic mb-4">No connections yet. Start matching with peers!</p>
                  <button
                    onClick={() => navigate('/explore')}
                    className="hero-gradient text-white px-6 py-2 rounded-xl font-bold shadow-lg"
                  >
                    Find Peers
                  </button>
                </div>
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
              {data.matches && data.matches.length > 0 ? data.matches.map((match: any, index: number) => (
                <MatchCard
                  key={match.id}
                  name={match.name}
                  role={match.bio || 'SkillBridge Peer'}
                  matchRate={match.matchRate}
                  offers={match.offers}
                  wants={match.wants}
                  imageUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.email}`}
                  secondary={index % 2 !== 0}
                  onConnect={() => handleConnect(match)}
                  isConnected={match.isConnected}
                />
              )) : (
                <div className="bg-surface-container-low p-8 rounded-3xl text-center border-2 border-dashed border-outline-variant/30">
                  <p className="text-on-surface-variant font-medium">No direct matches yet.</p>
                  <button
                    onClick={() => navigate('/explore')}
                    className="text-primary font-bold text-sm mt-2 hover:underline"
                  >
                    Browse community
                  </button>
                </div>
              )}
              {data.matches && data.matches.length > 0 && (
                <button
                  onClick={() => navigate('/explore')}
                  className="w-full py-4 text-on-surface-variant font-semibold text-sm border-2 border-dashed border-outline-variant/30 rounded-xl hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
                >
                  Explore More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
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
  onConnect?: () => void;
  isConnected?: boolean;
}

function MatchCard({ name, role, matchRate, offers, wants, imageUrl, secondary = false, onConnect, isConnected }: MatchCardProps) {
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
          <p className="text-sm text-on-surface-variant line-clamp-1">{role}</p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Offers to teach</p>
          <div className="flex flex-wrap gap-2">
            {offers.slice(0, 3).map(s => (
              <span key={s} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-medium">{s}</span>
            ))}
            {offers.length > 3 && <span className="text-[10px] text-on-surface-variant mt-1">+{offers.length - 3} more</span>}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Wants to learn</p>
          <div className="flex flex-wrap gap-2">
            {wants.slice(0, 3).map(s => (
              <span key={s} className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-lg text-xs font-medium">{s}</span>
            ))}
            {wants.length > 3 && <span className="text-[10px] text-on-surface-variant mt-1">+{wants.length - 3} more</span>}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onConnect?.(); }}
        className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${isConnected
          ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
          : secondary
            ? 'bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary'
            : 'hero-gradient text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95'
          }`}>
        {isConnected ? 'Connected' : `Connect with ${name.split(' ')[0]}`}
      </button>
    </div>
  );
}
