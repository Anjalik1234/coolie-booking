import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Train, Plus, Calendar, MapPin, Package, User, Ticket } from 'lucide-react';
import useStore from '../store/useStore';
import StatusBadge from '../components/ui/StatusBadge';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const STAT_COLORS = {
  'bg-rail-500': '#f97316',
  'bg-green-600': '#16a34a',
  'bg-red-600': '#dc2626',
  'bg-blue-600': '#2563eb',
};

function StatCard({ icon: Icon, label, value, color }) {
  const bg = STAT_COLORS[color] || '#f97316';
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: 'rgba(15,22,36,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(249,115,22,0.15)',
        borderRadius: '1.25rem',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div style={{
        width: '3rem', height: '3rem',
        background: `${bg}22`,
        border: `1px solid ${bg}40`,
        borderRadius: '0.875rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} color={bg} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: '#f1f5fd', lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>{label}</div>
      </div>
    </motion.div>
  );
}

function BookingCard({ booking }) {
  const { cancelBooking } = useStore();
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 4, boxShadow: '0 4px 20px rgba(249,115,22,0.1)' }}
      style={{
        background: 'rgba(15,22,36,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(249,115,22,0.12)',
        borderRadius: '1.25rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Icon */}
        <div style={{
          width: '3rem', height: '3rem',
          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Train size={20} color="#fb923c" />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5fd', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {booking.station || 'Mumbai CSMT'}
            </h3>
            <StatusBadge status={booking.status || 'confirmed'} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
            {[
              { icon: Calendar, text: booking.date || 'Apr 12, 2026' },
              { icon: Package,  text: booking.luggageType || '2 bags' },
              { icon: MapPin,   text: `Platform ${booking.platform || '3'}` },
            ].map(({ icon: I, text }) => (
              <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-body)' }}>
                <I size={12} color="#64748b" /> {text}
              </span>
            ))}
          </div>
        </div>

        {/* Cancel */}
        {(booking.status === 'confirmed' || booking.status === 'pending') && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => cancelBooking(booking.id)}
            style={{
              fontSize: '0.75rem', color: '#f87171', background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)', padding: '0.375rem 0.875rem',
              borderRadius: '0.625rem', fontFamily: 'var(--font-body)', cursor: 'pointer',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            Cancel
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, bookings, isAuthenticated } = useStore();
  const navigate = useNavigate();

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;

  const displayBookings = bookings.length > 0 ? bookings : [
    { id: 'demo1', station: 'Mumbai CSMT', date: 'Apr 12, 2026', luggageType: '2 bags', platform: '3', status: 'confirmed' },
    { id: 'demo2', station: 'Pune Junction', date: 'Apr 8, 2026', luggageType: '1 bag', platform: '1', status: 'cancelled' },
  ];

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '4rem', position: 'relative' }}>

        {/* Bg glow */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '300px', background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', flexDirection: 'column', gap: '1rem',
              alignItems: 'flex-start',
            }}
            className="sm:flex-row sm:items-center"
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem',
                  background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                  borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
                }}>
                  <User size={24} color="#ffffff" />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', fontSize: '0.85rem' }}>Good morning 👋</p>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: '#f1f5fd', lineHeight: 1.2 }}>
                    {user?.name || 'Traveler'}
                  </h1>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', color: '#64748b', fontSize: '0.85rem' }}>{user?.email}</p>
            </div>
            <Link to="/book" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="primary" icon={Plus}>New Booking</AnimatedButton>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={stagger} initial="initial" animate="animate"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
            className="md:grid-cols-4"
          >
            <StatCard icon={Train}    label="Total Bookings" value={displayBookings.length}  color="bg-rail-500" />
            <StatCard icon={Calendar} label="Confirmed"       value={confirmed || 1}          color="bg-green-600" />
            <StatCard icon={Package}  label="Cancelled"       value={cancelled || 1}          color="bg-red-600" />
            <StatCard icon={MapPin}   label="Stations Used"   value="3"                        color="bg-blue-600" />
          </motion.div>

          {/* Booking History */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: '#f1f5fd' }}>Booking History</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>{displayBookings.length} total</span>
            </div>

            <motion.div variants={stagger} initial="initial" animate="animate" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {displayBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
            </motion.div>

            {displayBookings.length === 0 && (
              <div style={{
                background: 'rgba(15,22,36,0.7)', border: '1px solid rgba(249,115,22,0.1)',
                borderRadius: '1.25rem', padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <div style={{
                  width: '64px', height: '64px', background: 'rgba(249,115,22,0.1)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Ticket size={28} color="#f97316" />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', marginBottom: '1.5rem' }}>No bookings yet.</p>
                <Link to="/book" style={{ textDecoration: 'none' }}>
                  <AnimatedButton variant="outline">Book your first coolie</AnimatedButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}