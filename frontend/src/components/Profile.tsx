import { motion } from 'motion/react';
import { MapPin, Clock, Languages, Edit2, Handshake, Star, Share2, Mail, Plus, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedAbout, setEditedAbout] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedAvailability, setEditedAvailability] = useState('');
  const [editedLanguages, setEditedLanguages] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data.data.user);
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes('Token') || err.message.includes('authorization')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: editedName, 
          bio: editedBio, 
          about: editedAbout,
          location: editedLocation,
          availability: editedAvailability,
          languages: editedLanguages
        })
      });

      if (!response.ok) throw new Error('Update failed');
      
      const result = await response.json();
      setUser(result.data.user);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddSkill = async (type: 'OFFER' | 'SEEK', name: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type, category: 'General' })
      });

      if (!response.ok) throw new Error('Failed to add skill');
      
      const result = await response.json();
      
      // Fetch updated profile data to show the new skill immediately
      const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const refreshData = await refreshResponse.json();
      setUser(refreshData.data.user);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSkill = async (type: 'OFFER' | 'SEEK', skillId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/skills?skillId=${skillId}&type=${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete skill');
      
      // Refresh user data
      const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const refreshData = await refreshResponse.json();
      setUser(refreshData.data.user);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const calculateRating = () => {
    if (!user.ratingsReceived || user.ratingsReceived.length === 0) return 0;
    const sum = user.ratingsReceived.reduce((acc: number, curr: any) => acc + curr.score, 0);
    return (sum / user.ratingsReceived.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-error mb-4">Error loading profile</h2>
        <p className="text-on-surface-variant mb-8">{error || 'Could not find user data.'}</p>
        <button
          onClick={() => navigate('/login')}
          className="hero-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg"
        >
          Sign In Again
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <header className="relative mb-12">
        <div className="h-48 md:h-64 w-full rounded-3xl hero-gradient opacity-20 mb-[-4rem] md:mb-[-6rem]"></div>
        <div className="flex flex-col md:flex-row items-end gap-6 px-4 md:px-12 relative z-10">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-surface-container-lowest p-2 shadow-xl shadow-on-surface/5">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt={user.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-2 md:pb-6">
            <div>
              {isEditing ? (
                <input 
                  className="text-4xl font-extrabold text-on-surface bg-white/50 rounded-lg px-2 outline-primary w-full max-w-md"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Your Name"
                />
              ) : (
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">{user.name}</h1>
              )}
              
              {isEditing ? (
                <input 
                  className="block text-on-surface-variant font-medium mt-2 bg-white/50 rounded-lg px-2 outline-primary w-full max-w-md"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="One-line bio (e.g. UX Designer)"
                />
              ) : (
                <p className="text-on-surface-variant font-medium mt-1">{user.bio || 'SkillBridge Member'}</p>
              )}
              
              <div className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant/70">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
            </div>
            {isEditing ? (
              <div className="flex gap-2 mt-6">
                <button onClick={handleUpdateProfile} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">Save Changes</button>
                <button onClick={() => setIsEditing(false)} className="bg-surface-container-highest px-6 py-2 rounded-xl font-bold">Cancel</button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { 
                  setIsEditing(true); 
                  setEditedName(user.name); 
                  setEditedBio(user.bio || ''); 
                  setEditedAbout(user.about || '');
                  setEditedLocation(user.location || '');
                  setEditedAvailability(user.availability || '');
                  setEditedLanguages(user.languages || '');
                }}
                className="mt-6 md:mt-0 px-8 py-3.5 hero-gradient text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] ambient-shadow">
            <h2 className="text-xl font-bold text-on-surface mb-4">About</h2>
            {isEditing ? (
              <textarea
                className="w-full p-4 bg-white/50 rounded-xl border border-outline-variant/30 outline-primary min-h-[150px] text-on-surface-variant leading-relaxed"
                value={editedAbout}
                onChange={(e) => setEditedAbout(e.target.value)}
                placeholder="Tell the community about yourself, your background, and what you're looking for..."
              />
            ) : (
              <p className="text-on-surface-variant leading-relaxed">
                {user.about || "N/A"}
              </p>
            )}
            <div className="mt-8 space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-white/50 rounded-xl border border-outline-variant/20">
                    <MapPin className="w-5 h-5 text-primary" />
                    <input 
                      className="bg-transparent border-none outline-none w-full text-sm font-medium"
                      placeholder="Location (e.g. Remote, NYC)"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white/50 rounded-xl border border-outline-variant/20">
                    <Clock className="w-5 h-5 text-primary" />
                    <input 
                      className="bg-transparent border-none outline-none w-full text-sm font-medium"
                      placeholder="Availability (e.g. Evenings)"
                      value={editedAvailability}
                      onChange={(e) => setEditedAvailability(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white/50 rounded-xl border border-outline-variant/20">
                    <Languages className="w-5 h-5 text-primary" />
                    <input 
                      className="bg-transparent border-none outline-none w-full text-sm font-medium"
                      placeholder="Languages (e.g. English, Hindi)"
                      value={editedLanguages}
                      onChange={(e) => setEditedLanguages(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <InfoItem icon={<MapPin className="w-5 h-5" />} text={user.location || "Location N/A"} />
                  <InfoItem icon={<Clock className="w-5 h-5" />} text={user.availability || "Availability N/A"} />
                  <InfoItem icon={<Languages className="w-5 h-5" />} text={user.languages || "Languages N/A"} />
                </>
              )}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary-container/30 p-6 rounded-[2rem] text-center">
              <div className="text-2xl font-black text-secondary">0</div>
              <div className="text-xs font-bold text-secondary-dim uppercase tracking-wider mt-1">Exchanges</div>
            </div>
            <div className="bg-tertiary-container/30 p-6 rounded-[2rem] text-center">
              <div className="text-2xl font-black text-tertiary">{calculateRating()}</div>
              <div className="text-xs font-bold text-tertiary-dim uppercase tracking-wider mt-1">Rating</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <SkillSection
            title="Skills Offered"
            icon={<Handshake className="w-6 h-6" />}
            skills={user.skills?.filter((us: any) => us.type === 'OFFER') || []}
            color="secondary"
            addLabel="Add Skill"
            onAdd={(name) => handleAddSkill('OFFER', name)}
            onDelete={(id) => handleDeleteSkill('OFFER', id)}
          />

          <SkillSection
            title="Skills Wanted"
            icon={<Star className="w-6 h-6" />}
            skills={user.skills?.filter((us: any) => us.type === 'SEEK') || []}
            color="tertiary"
            addLabel="Add Want"
            onAdd={(name) => handleAddSkill('SEEK', name)}
            onDelete={(id) => handleDeleteSkill('SEEK', id)}
          />

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

function SkillSection({ 
  title, 
  icon, 
  skills, 
  color, 
  addLabel, 
  onAdd,
  onDelete
}: { 
  title: string; 
  icon: React.ReactNode; 
  skills: any[]; 
  color: string; 
  addLabel: string; 
  onAdd: (name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const colorClasses = color === 'secondary'
    ? 'bg-secondary-container text-on-secondary-container'
    : 'bg-tertiary-container text-on-tertiary-container';
  const iconBg = color === 'secondary' ? 'bg-primary-container/20' : 'bg-tertiary-container/20';
  const iconColor = color === 'secondary' ? 'text-primary' : 'text-tertiary';
  const borderDashed = color === 'secondary' ? 'border-primary/30 text-primary' : 'border-tertiary/30 text-tertiary';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setLoading(true);
    await onAdd(newSkill.trim());
    setNewSkill('');
    setIsAdding(false);
    setLoading(false);
  };

  return (
    <section className="bg-surface-container-low p-8 rounded-[2rem]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>{icon}</span>
          <h2 className="text-xl font-bold text-on-surface">{title}</h2>
        </div>
        <button 
          onClick={() => setIsManaging(!isManaging)}
          className={`${isManaging ? 'text-error' : iconColor} font-bold text-sm hover:underline cursor-pointer transition-colors`}
        >
          {isManaging ? 'Done' : 'Manage'}
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {skills.map(us => (
          <div key={us.id} className={`px-5 py-2.5 ${colorClasses} font-semibold rounded-xl text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-300 group`}>
            {us.skill.name}
            {isManaging && (
              <button 
                onClick={() => onDelete(us.skillId)}
                className="hover:text-error transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            )}
          </div>
        ))}
        
        {isAdding ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              autoFocus
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Skill name..."
              className="px-4 py-2.5 bg-white border border-primary/20 rounded-xl text-sm outline-primary"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              {loading ? '...' : 'Add'}
            </button>
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-on-surface-variant font-bold text-xs"
            >
              Cancel
            </button>
          </form>
        ) : (
          !isManaging && (
            <button 
              onClick={() => setIsAdding(true)}
              className={`px-5 py-2.5 bg-surface-container-lowest font-bold rounded-xl text-sm border border-dashed ${borderDashed} flex items-center gap-2 cursor-pointer hover:bg-white transition-all`}
            >
              <Plus className="w-4 h-4" /> {addLabel}
            </button>
          )
        )}
      </div>
    </section>
  );
}

