import { Search, SlidersHorizontal, Star, ArrowRight, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectModal from './ConnectModal';

export default function Explore() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [selectedPeer, setSelectedPeer] = useState<any>(null);

  const handleConnect = async (peer: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: peer.id })
      });

      if (!response.ok) throw new Error('Failed to save connection');
      
      setSelectedPeer(peer);
      // Update local state to show "Connected" immediately
      setMentors(prev => prev.map(m => m.id === peer.id ? { ...m, isConnected: true } : m));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchMentors = async (pageNum: number, isLoadMore = false) => {
    try {
      const limit = 4;
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString()
      });
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/mentors?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch mentors');
      
      const result = await response.json();
      const newMentors = result.data.mentors;

      if (isLoadMore) {
        setMentors(prev => [...prev, ...newMentors]);
      } else {
        setMentors(newMentors);
      }
      
      setHasMore(newMentors.length === limit);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchMentors(1, false);
  }, [selectedCategory]); // Auto-refresh when category changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPage(1);
    fetchMentors(1, false);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMentors(nextPage, true);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      {selectedPeer && (
        <ConnectModal 
          name={selectedPeer.name} 
          email={selectedPeer.email} 
          id={selectedPeer.id}
          onClose={() => setSelectedPeer(null)} 
        />
      )}
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-8">
          Find Your Next <span className="text-primary">Skill Match</span>
        </h1>

        <form onSubmit={handleSearch} className="bg-surface-container-low p-2 rounded-[2rem] flex flex-col lg:flex-row gap-4 items-center shadow-sm">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline-variant w-6 h-6" />
            <input
              className="w-full pl-14 pr-6 py-5 bg-surface-container-lowest border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-medium text-lg placeholder:text-outline-variant outline-none"
              placeholder="What skill are you looking for?"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto p-2">
            <div className="relative min-w-[200px]">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
              <select 
                className="w-full pl-12 pr-10 py-4 bg-surface-container-lowest border-none rounded-2xl appearance-none font-semibold text-on-surface-variant cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Design</option>
                <option>Coding</option>
                <option>Marketing</option>
                <option>Business</option>
                <option>Music</option>
                <option>Photography</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-90 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            name={mentor.name}
            role={mentor.role}
            rating={mentor.rating}
            bio={mentor.bio}
            tags={mentor.tags}
            isNew={mentor.isNew}
            imageUrl={mentor.imageUrl}
            onConnect={() => handleConnect(mentor)}
            isConnected={mentor.isConnected}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-surface-container-low text-primary font-bold px-12 py-5 rounded-2xl hover:bg-surface-container-high transition-colors scale-95 active:scale-90 cursor-pointer disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More Mentors'}
          </button>
        </div>
      )}
    </main>
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
  onConnect?: () => void;
  isConnected?: boolean;
  key?: React.Key;
}

function MentorCard({ name, rating, bio, tags, isNew, imageUrl, onConnect, isConnected }: MentorCardProps) {
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
        <p className="text-on-surface-variant text-sm mb-4 leading-relaxed line-clamp-3">{bio}</p>
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

      <button 
        onClick={(e) => { e.stopPropagation(); onConnect?.(); }}
        className={`w-full py-4 rounded-xl font-bold transition-all scale-95 active:scale-90 flex items-center justify-center gap-2 cursor-pointer ${
          isConnected 
            ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' 
            : 'text-primary bg-surface-container-low hover:bg-primary hover:text-white'
        }`}
      >
        {isConnected ? (
          <>
            Connected
            <Star className="w-5 h-5 fill-current" />
          </>
        ) : (
          <>
            Connect
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
