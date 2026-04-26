import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { email, password, name };
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + endpoint;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Save token (in real app, consider secure cookie or httpOnly)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      navigate('/exchange');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary-container/20 blur-[100px] rounded-full point-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-tertiary-container/20 blur-[100px] rounded-full point-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-surface-container-lowest p-10 rounded-[2rem] ambient-shadow border border-outline-variant/10">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join SkillBridge'}
            </h1>
            <p className="text-on-surface-variant">
              {isLogin ? 'Enter your details to access your exchanges.' : 'Create an account to start sharing skills.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-sm font-semibold text-on-surface">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-on-surface-variant" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-on-surface">Password</label>
                {isLogin && <a href="#" className="text-xs text-primary font-medium hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-3 bg-error-container text-on-error-container text-sm rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full hero-gradient text-on-primary py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-container-high text-center">
            <p className="text-on-surface-variant">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
