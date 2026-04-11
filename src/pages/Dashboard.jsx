import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train, Plus, Calendar, MapPin, Package, User, Ticket, 
  Clock, CheckCircle2, ChevronRight, Luggage, Star, Info
} from 'lucide-react';
import axios from 'axios';
import useStore from '../store/useStore';
import StatusBadge from '../components/ui/StatusBadge';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import config from '../config/env';
import Swal from 'sweetalert2';
import RatingModal from '../components/ui/RatingModal';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      style={{
        background: 'rgba(15,22,36,0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        flex: 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{ fontFamily: 'var(--font-body)', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: '#f1f5fd', lineHeight: 1 }}>{value}</div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, setBookings, isAuthenticated } = useStore();
  const [localBookings, setLocalBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingBooking, setRatingBooking] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${config.apiBaseUrl}/bookings/my-bookings`, { withCredentials: true });
      setLocalBookings(res.data.bookings);
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (data) => {
    try {
      await axios.post(`${config.apiBaseUrl}/bookings/${ratingBooking.id}/rate`, data, { withCredentials: true });
      await Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: 'Your feedback helps our partners improve.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#f97316'
      });
      setRatingBooking(null);
      fetchBookings();
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Submission Failed', 
        text: err.response?.data?.message || 'Error submitting rating',
        background: '#1e293b',
        color: '#fff'
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role === 'coolie') {
      navigate('/coolie-dashboard');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate, user, setBookings]);

  const activeBooking = localBookings.find(b => b.status === 'pending' || b.status === 'accepted');
  const stats = [
    { label: 'Total Trips', value: localBookings.length, icon: Train, color: '#f97316' },
    { label: 'Completed', value: localBookings.filter(b => b.status === 'completed').length, icon: CheckCircle2, color: '#10b981' },
    { label: 'Stations', value: new Set(localBookings.map(b => b.station)).size, icon: MapPin, color: '#3b82f6' },
  ];

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '6rem', background: '#020617', color: '#f8fafc' }}>
        
        {/* Cinematic Backdrop Glow */}
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '999px', fontSize: '0.7rem', color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passenger Portal</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Welcome back, <span style={{ color: '#f97316' }}>{user?.name?.split(' ')[0]}</span>
              </motion.h1>
            </div>
            <Link to="/coolies">
              <AnimatedButton variant="primary" icon={Plus}>Book Assistance</AnimatedButton>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="#f97316" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Request</span>
                </div>
                
                {activeBooking ? (
                  <div style={{ background: 'linear-gradient(135deg, rgba(15,22,36,0.8), rgba(15,22,36,0.4))', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '2rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{activeBooking.station}</div>
                        <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {activeBooking.date}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Ticket size={14} /> Platform {activeBooking.platform}</span>
                        </div>
                      </div>
                      <StatusBadge status={activeBooking.status} />
                    </div>
                    
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={config.getImageUrl(activeBooking.coolie_avatar) || `https://ui-avatars.com/api/?name=${activeBooking.coolie_first_name}&background=0f172a&color=f97316`} style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }} alt="Coolie" />
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{activeBooking.coolie_first_name} {activeBooking.coolie_last_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Assigned Partner • {activeBooking.coolie_phone}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', background: 'rgba(249,115,22,0.1)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase' }}>Expected Fare</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>₹{activeBooking.total_fare ?? 0}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(15,22,36,0.3)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '2rem', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Luggage size={20} color="#334155" />
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No active journeys. Ready for your next trip?</p>
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                 <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {localBookings.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (i * 0.05) }} style={{ background: 'rgba(15,22,36,0.4)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle2 size={18} color="#94a3b8" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{b.station}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.date} • ₹{b.total_fare ?? 0}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <StatusBadge status={b.status} />
                        {b.status === 'completed' && !b.rating && (
                          <button 
                            onClick={() => setRatingBooking(b)}
                            style={{ padding: '0.4rem 0.8rem', background: 'rgba(252,211,77,0.1)', border: '1px solid #fcd34d', borderRadius: '8px', color: '#fcd34d', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Rate Now
                          </button>
                        )}
                        {b.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fcd34d' }}>
                            <Star size={14} style={{ fill: '#fcd34d' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{b.rating}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {localBookings.length === 0 && !loading && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>No past bookings found.</div>
                  )}
                </div>
              </motion.div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ background: 'rgba(15,22,36,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
                  <div style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #f97316, #fb923c)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <User size={36} color="white" />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{user?.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Verified Passenger</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', background: 'rgba(15,22,36,0.6)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Trips</div>
                    <div style={{ fontWeight: 800 }}>{localBookings.length}</div>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(15,22,36,0.6)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Points</div>
                    <div style={{ fontWeight: 800, color: '#fcd34d' }}>120</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.map((s, i) => <StatCard key={s.label} {...s} delay={0.5 + (i * 0.1)} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RatingModal 
        isOpen={!!ratingBooking} 
        onClose={() => setRatingBooking(null)} 
        onSubmit={handleRate}
        booking={ratingBooking}
      />
    </PageTransition>
  );
}