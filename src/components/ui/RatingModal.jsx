import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, MessageSquare } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

export default function RatingModal({ isOpen, onClose, onSubmit, booking }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'relative', width: '100%', maxWidth: '28rem',
              background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '2rem', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            {/* Design Accents */}
            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: 'linear-gradient(90deg, transparent, #f97316, transparent)' }} />
            
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(249,115,22,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Star size={32} color="#f97316" style={{ fill: '#f97316' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#f1f5fd', marginBottom: '0.5rem' }}>Rate Your Trip</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>How was your experience with {booking?.coolie_first_name}?</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Star Rating */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star
                      size={36}
                      color={(hoverRating || rating) >= star ? '#fcd34d' : '#334155'}
                      style={{
                        fill: (hoverRating || rating) >= star ? '#fcd34d' : 'transparent',
                        transition: 'all 0.2s',
                        filter: (hoverRating || rating) >= star ? 'drop-shadow(0 0 8px rgba(252,211,77,0.4))' : 'none'
                      }}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Feedback Text */}
              <div style={{ position: 'relative' }}>
                <MessageSquare size={16} style={{ position: 'absolute', left: '1.25rem', top: '1.25rem', color: '#64748b' }} />
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about the service... (Optional)"
                  style={{
                    width: '100%', height: '120px', padding: '1.1rem 1.1rem 1.1rem 3rem',
                    background: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '1.25rem', color: '#f8fafc', fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem', resize: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              <AnimatedButton
                type="submit"
                variant="primary"
                icon={Send}
                style={{ width: '100%', padding: '1.1rem', fontSize: '1rem', borderRadius: '1rem' }}
              >
                Submit Feedback
              </AnimatedButton>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
