import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Train, ArrowRight, Home } from 'lucide-react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import useStore from '../store/useStore';

/** Confetti particle */
function Particle({ x, y, color, delay }) {
  return (
    <motion.div
      initial={{ y: 0, x, opacity: 1, scale: 1 }}
      animate={{ y: 300, opacity: 0, scale: 0, rotate: 720 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className="absolute top-0 w-2 h-2 rounded-sm"
      style={{ left: x, background: color }}
    />
  );
}

export default function BookingConfirmation() {
  const { bookings } = useStore();
  const latest = bookings[0];

  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 400 - 200,
    color: ['#f97316','#f59e0b','#fb923c','#fcd34d','#fff'][i % 5],
    delay: Math.random() * 0.5,
  }));

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          {/* Confetti burst */}
          <div className="relative inline-block mb-8">
            <div className="relative overflow-visible">
              {particles.map((p, i) => (
                <Particle key={i} x={p.x} y={0} color={p.color} delay={p.delay} />
              ))}
            </div>

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="relative z-10 w-24 h-24 bg-green-500/10 border-2 border-green-500/30
                         rounded-full flex items-center justify-center mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              >
                <CheckCircle size={48} className="text-green-400" />
              </motion.div>
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="font-display font-extrabold text-4xl text-white mb-3">
              Booking Confirmed! 🎉
            </h1>
            <p className="font-body text-gray-400 text-lg leading-relaxed">
              Your coolie has been booked successfully.
              <br />
              They'll meet you at the platform.
            </p>
          </motion.div>

          {/* Booking detail card */}
          {latest && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              className="glass rounded-2xl p-6 mt-8 text-left space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <Train size={16} className="text-rail-400" />
                <span className="font-mono text-xs text-gray-500 tracking-widest uppercase">Booking Details</span>
              </div>
              {[
                ['Station',  latest.station  || 'N/A'],
                ['Platform', `Platform ${latest.platform || 'N/A'}`],
                ['Date',     latest.date     || 'N/A'],
                ['Time',     latest.time     || 'N/A'],
                ['Luggage',  latest.luggageType || 'N/A'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="font-body text-gray-500">{k}</span>
                  <span className="font-body font-medium text-white">{v}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="font-mono text-xs text-gray-500 uppercase tracking-wide">Booking ID</span>
                <span className="font-mono text-xs text-rail-400">#{latest.id?.toString().slice(-6).toUpperCase()}</span>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 mt-8"
          >
            <Link to="/dashboard" className="flex-1">
              <AnimatedButton variant="outline" fullWidth icon={Home}>
                My Bookings
              </AnimatedButton>
            </Link>
            <Link to="/book" className="flex-1">
              <AnimatedButton variant="primary" fullWidth icon={ArrowRight}>
                Book Another
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}