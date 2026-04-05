import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, MapPin, Shield, Camera, ArrowRight, ArrowLeft, 
  Check, Sparkles, Upload, Loader2, Mail, Lock, FileText
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import PageTransition from '../components/ui/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import config from '../config/env';

const BG_IMAGE = "../assets/getstarted.jpg";

export default function CoolieRegister() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    age: '',
    phone: '',
    city: '',
    postal_code: '',
    aadhar_number: '',
    aadhar_image: '',
    avatar_url: ''
  });

  const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleFileUpload = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Convert to Base64 for simplicity in this demo
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const steps = [
    { title: 'Identity', subtitle: 'Basic profile information', icon: User },
    { title: 'Location', subtitle: 'Where do you operate?', icon: MapPin },
    { title: 'Verification', subtitle: 'Official document upload', icon: Shield },
    { title: 'Security', subtitle: 'Account protection', icon: Lock },
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${config.apiBaseUrl}/coolies/register`, form, { 
        timeout: config.apiTimeout,
        withCredentials: true 
      });
      
      await Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your registration is pending admin approval. We will notify you once approved.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316',
        backdrop: 'rgba(0,0,0,0.8)'
      });
      
      navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err?.response?.data?.message || 'Something went wrong.',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        confirmButtonColor: '#f97316'
      });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', display: 'block' };

  const renderStep = () => {
    switch(step) {
      case 0: return (
        <div key="step0" className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>First Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={form.first_name} onChange={update('first_name')} placeholder="Rajesh" className="rail-input w-full pl-12 h-12 bg-slate-900/60" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input type="text" value={form.last_name} onChange={update('last_name')} placeholder="Kumar" className="rail-input w-full px-4 h-12 bg-slate-900/60" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Middle Name (Optional)</label>
            <input type="text" value={form.middle_name} onChange={update('middle_name')} placeholder="Prasad" className="rail-input w-full px-4 h-12 bg-slate-900/60" />
          </div>
          <div>
            <label style={labelStyle}>Age</label>
            <input type="number" value={form.age} onChange={update('age')} placeholder="e.g. 28" className="rail-input w-full px-4 h-12 bg-slate-900/60" />
          </div>
        </div>
      );
      case 1: return (
        <div key="step1" className="grid grid-cols-1 gap-4">
          <div>
            <label style={labelStyle}>Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" className="rail-input w-full pl-12 h-12 bg-slate-900/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>City</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={form.city} onChange={update('city')} placeholder="Mumbai" className="rail-input w-full pl-12 h-12 bg-slate-900/60" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Postal Code</label>
              <input type="text" value={form.postal_code} onChange={update('postal_code')} placeholder="400001" className="rail-input w-full px-4 h-12 bg-slate-900/60" />
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div key="step2" className="grid grid-cols-1 gap-4">
          <div>
            <label style={labelStyle}>Aadhar Card Number</label>
            <div className="relative">
              <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={form.aadhar_number} onChange={update('aadhar_number')} placeholder="1234 5678 9012" className="rail-input w-full pl-12 h-12 bg-slate-900/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Aadhar Card Photo</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/40 transition-colors">
                {form.aadhar_image ? (
                  <img src={form.aadhar_image} className="w-full h-full object-cover rounded-lg" alt="Aadhar" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="text-slate-500 mb-2" size={24} />
                    <span className="text-[0.7rem] text-slate-400">Click to upload</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload('aadhar_image')} />
              </label>
            </div>
            <div>
              <label style={labelStyle}>Profile Picture</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/40 transition-colors">
                {form.avatar_url ? (
                  <img src={form.avatar_url} className="w-full h-full object-cover rounded-lg" alt="Profile" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="text-slate-500 mb-2" size={24} />
                    <span className="text-[0.7rem] text-slate-400">Upload PFP</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload('avatar_url')} />
              </label>
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div key="step3" className="grid grid-cols-1 gap-4">
          <div>
            <label style={labelStyle}>Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={form.email} onChange={update('email')} placeholder="rajesh@cooliebook.in" className="rail-input w-full pl-12 h-12 bg-slate-900/60" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Account Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" value={form.password} onChange={update('password')} placeholder="••••••••" className="rail-input w-full pl-12 h-12 bg-slate-900/60" />
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative flex items-center justify-center py-12 px-4 bg-[#020617] overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img src={BG_IMAGE} className="w-full h-full object-cover opacity-30" alt="background" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-slate-900/80 border border-white/10 items-center justify-center mb-4 shadow-2xl">
              <Sparkles className="text-orange-500" size={32} />
            </div>
            <h1 className="font-display font-black text-4xl text-white mb-2 tracking-tight">Onboard as Partner</h1>
            <p className="text-slate-400">Join the elite network of verified Indian railway assistants</p>
          </div>

          {/* Form Card */}
          <div className="glass-card overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/0 via-orange-500 to-orange-500/0" />
            
            {/* Progress Bar */}
            <div className="flex px-10 pt-8 pb-4">
              <div className="flex w-full justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800" />
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                   className="absolute top-5 left-0 h-0.5 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
                />
                
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const active = i <= step;
                  return (
                    <div key={i} className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        animate={{ 
                          scale: i === step ? 1.2 : 1,
                          backgroundColor: active ? '#f97316' : '#1e293b'
                        }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xl mb-2"
                      >
                        <Icon size={18} className={active ? 'text-white' : 'text-slate-500'} />
                      </motion.div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${i === step ? 'text-orange-500' : 'text-slate-600'}`}>{s.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="p-8">
              <div className="min-h-[220px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-white font-bold text-lg mb-1">{steps[step].title} Details</h3>
                      <p className="text-slate-500 text-sm truncate">{steps[step].subtitle}</p>
                    </div>
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Controls */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={prev}
                  disabled={step === 0}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${step === 0 ? 'opacity-0' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
                >
                  <ArrowLeft size={18} /> Back
                </button>

                {step === steps.length - 1 ? (
                  <AnimatedButton 
                    type="submit" 
                    variant="primary" 
                    disabled={loading}
                    className="px-10 h-12 text-base"
                    icon={Check}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                  </AnimatedButton>
                ) : (
                  <AnimatedButton 
                    type="button" 
                    onClick={next}
                    variant="primary"
                    className="px-10 h-12 text-base"
                    icon={ArrowRight}
                  >
                    Continue
                  </AnimatedButton>
                )}
              </div>
            </form>
          </div>

          <p className="text-center mt-6 text-slate-500 text-sm">
            Already registered? <Link to="/login" className="text-orange-500 font-bold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
