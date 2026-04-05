import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Train, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import useStore from '../store/useStore';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageTransition from '../components/ui/PageTransition';
import config from '../config/env';

const BG_IMAGE = "/assets/getstarted.jpg";

const FIELDS = [
  { name: 'name',     label: 'Full Name',      type: 'text',     icon: User,    placeholder: 'Rajesh Kumar' },
  { name: 'email',    label: 'Email Address',  type: 'email',    icon: Mail,    placeholder: 'you@example.com' },
  { name: 'phone',    label: 'Mobile Number',  type: 'tel',      icon: Phone,   placeholder: '+91 98765 43210' },
  { name: 'address',  label: 'City / Address', type: 'text',     icon: MapPin,  placeholder: 'Mumbai, Maharashtra' },
  { name: 'password', label: 'Password',       type: 'password', icon: Lock,    placeholder: '8+ characters' },
];

export default function Register() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [step, setStep]   = useState(0);
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const currentFields = step === 0 ? FIELDS.slice(0, 3) : FIELDS.slice(3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 0) { setStep(1); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${config.apiBaseUrl}/auth/register`, form, { 
        timeout: config.apiTimeout,
        withCredentials: true 
      });
      setUser(res.data.user);
      
      await Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome aboard the CoolieBook platform.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316',
        backdrop: 'rgba(0,0,0,0.8)'
      });
      
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err?.response?.data?.message || 'There was an issue processing your request.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316',
        backdrop: 'rgba(0,0,0,0.8)'
      });
    } finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row-reverse', position: 'relative', overflow: 'hidden', background: '#020617' }}>

        {/* ── RIGHT: Cinematic Image Panel ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }} className="hidden md:flex flex-1">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
            src={BG_IMAGE} alt="Indian Railway Night"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          {/* Intense Overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(225deg, rgba(2,6,23,0.9) 0%, rgba(249,115,22,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, transparent 20%, #020617 120%)' }} />
          <div className="india-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%' }}
          >
            <div style={{ 
              background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2.5rem',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#f8fafc', fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Start Your Journey
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.9 }}>
                {[
                  'Priority booking for coolies instantly',
                  '100% Verified profiles & reviews',
                  'Live arrival status & notifications',
                ].map((text, i) => (
                  <motion.li key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 + (i * 0.1) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', color: '#cbd5e1', fontSize: '1.05rem', fontFamily: 'var(--font-body)' }}>
                    <div style={{ padding: '4px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <Check size={14} color="#34d399" />
                    </div>
                    {text}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── LEFT: God-Level Registration Form ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', background: '#020617', position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10 }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <motion.div
                whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(16,185,129,0.1)' }}
              >
                <Sparkles size={28} color="#10b981" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.8))' }} />
              </motion.div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.25rem', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Create Account
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                Step {step + 1} of 2 — {step === 0 ? 'Basic details' : 'Final setup'}
              </p>
            </div>

            {/* Glowing Form Card */}
            <div style={{
              background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.75rem',
              padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.04)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)' }} />

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={step}
                    initial={{ opacity: 0, x: step === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: step === 0 ? 20 : -20 }} transition={{ duration: 0.3 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                  >
                    {currentFields.map(({ name, label, type, icon: Icon, placeholder }) => (
                      <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: '#94a3b8' }}>{label}</label>
                        {name === 'phone' ? (
                          <div style={{ position: 'relative' }}>
                            <PhoneInput
                              defaultCountry="in"
                              value={form.phone}
                              onChange={(phone) => setForm((p) => ({ ...p, phone }))}
                              style={{
                                '--react-international-phone-bg': 'rgba(15, 23, 42, 0.6)',
                                '--react-international-phone-border-color': 'rgba(255,255,255,0.08)',
                                '--react-international-phone-text-color': '#f8fafc',
                                '--react-international-phone-font-family': 'var(--font-body)',
                              }}
                              inputStyle={{ flex: 1, height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.08)' }}
                              countrySelectorStyleProps={{ buttonStyle: { height: '3.25rem', padding: '0 0.5rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)' } }}
                            />
                          </div>
                        ) : (
                          <div style={{ position: 'relative' }}>
                            <Icon size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input type={type} value={form[name]} onChange={update(name)} placeholder={placeholder} required
                              className="rail-input" style={{ paddingLeft: '3rem', height: '3.25rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  {step === 1 && (
                    <button type="button" onClick={() => setStep(0)} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.25rem' }}>
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <AnimatedButton type="submit" variant="primary" disabled={loading} icon={step === 0 ? ArrowRight : Check} style={{ flex: 1, padding: '1rem', fontSize: '1rem', borderRadius: '0.875rem' }}>
                    {loading ? 'Processing…' : step === 0 ? 'Continue' : 'Complete Setup'}
                  </AnimatedButton>
                </div>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Already joined?</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.1))' }} />
              </div>

              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button type="button" style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', color: '#f8fafc', fontSize: '0.95rem', fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer' }}>
                  Sign In to Account
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  );
}