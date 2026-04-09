import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Exchange', path: '/exchange' },
    { name: 'Mentors', path: '/mentors' },
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
          <Link to="/login" className="font-medium text-on-surface hover:text-primary transition-colors">
            Sign In
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hero-gradient text-on-primary px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/10"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
