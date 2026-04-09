import { Link } from 'react-router-dom';
import { Globe, Share2, Mail } from 'lucide-react';

export default function Footer() {
  const links = ['About', 'Privacy', 'Terms', 'Support', 'Careers'];

  return (
    <footer className="bg-surface-container-low rounded-t-3xl mt-20">
      <div className="max-w-7xl mx-auto px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-xl font-black text-on-surface">SkillBridge</div>
          <p className="text-sm text-on-surface-variant">
            © 2024 SkillBridge. The Radiant Curator Experience.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {links.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
        
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all">
            <Globe className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all">
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
