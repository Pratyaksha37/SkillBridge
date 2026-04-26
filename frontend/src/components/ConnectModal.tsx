import { useState } from 'react';
import { Mail, Share2, Star, Plus } from 'lucide-react';

interface ConnectModalProps {
  name: string;
  email: string;
  id: string;
  onClose: () => void;
}

export default function ConnectModal({ name, email, id, onClose }: ConnectModalProps) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ratedUserId: id, score: rating, feedback })
      });

      if (!response.ok) throw new Error('Failed to submit rating');
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const meetingLink = `https://meet.google.com/new?authuser=0&hs=122&peer=${id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-black text-on-surface mb-2">Connected with {name}</h2>
            <p className="text-on-surface-variant font-medium">Collaboration Hub</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Email Section */}
          <div className="bg-primary-container/10 p-5 rounded-2xl border border-primary/10 flex items-center justify-between gap-4">
            <div className="truncate">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Email Address</span>
              <span className="text-lg font-bold text-on-surface-variant">{email}</span>
            </div>
            <button 
              onClick={handleCopy}
              className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-primary text-white hover:scale-105'}`}
            >
              {copied ? 'Copied!' : <Mail className="w-5 h-5" />}
            </button>
          </div>

          {/* Meeting Link Section */}
          <div className="bg-secondary-container/10 p-5 rounded-2xl border border-secondary/10">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Quick Meeting</span>
            <a 
              href={meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-outline-variant/20 hover:border-secondary/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-bold text-on-surface-variant">Start Google Meet</span>
              </div>
              <Share2 className="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Rating Section */}
          <div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant/10">
            <h3 className="font-bold text-on-surface mb-4">Rate your Experience</h3>
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <p className="text-sm font-bold text-on-surface">Thank you for your feedback!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-outline-variant'}`} 
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Leave a quick review (optional)..."
                  className="w-full p-4 bg-white/50 rounded-xl text-sm border border-outline-variant/20 outline-primary min-h-[80px]"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  disabled={rating === 0 || isSubmitting}
                  onClick={handleSubmitRating}
                  className="w-full py-3 bg-on-surface text-surface rounded-xl font-bold text-sm disabled:opacity-30 transition-all hover:bg-on-surface/90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-4 text-on-surface-variant font-bold hover:text-primary transition-colors text-sm"
        >
          Close Collaboration Hub
        </button>
      </div>
    </div>
  );
}
