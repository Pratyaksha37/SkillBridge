import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };
  
  const navLinks = [
    { name: 'Explore', path: '/explore' },
    ...(isLoggedIn ? [{ name: 'Dashboard', path: '/exchange' }] : [])
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">
          SkillBridge
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/profile" 
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  location.pathname === '/profile' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="font-medium text-on-surface hover:text-primary transition-colors">
                Sign In
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="hero-gradient text-on-primary px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/10 cursor-pointer"
              >
                Get Started
              </motion.button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
