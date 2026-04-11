import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Lock, Mail, Shield, Save, 
  AlertCircle, CheckCircle2, Loader2, Key
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PageTransition from '../components/ui/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import config from '../config/env';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/admin/profile`, { withCredentials: true });
        setProfile({
          username: res.data.admin.username,
          email: res.data.admin.email
        });
      } catch (err) {
        console.error('Failed to fetch admin profile');
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`${config.apiBaseUrl}/admin/profile`, profile, { withCredentials: true });
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Administrative credentials have been refreshed.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Server error occurred.',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'Mismatch', text: 'New passwords do not match.', background: '#1e293b', color: '#fff' });
    }

    setLoading(true);
    try {
      await axios.patch(`${config.apiBaseUrl}/admin/password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, { withCredentials: true });
      
      Swal.fire({
        icon: 'success',
        title: 'Security Updated',
        text: 'System password has been successfully rotated.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Invalid current password.',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
            System Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Configure your administrative account and security preferences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
          
          {/* Navigation Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'profile', label: 'Admin Profile', icon: User },
              { id: 'security', label: 'Security & Auth', icon: Lock },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem',
                  borderRadius: '0.75rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: activeTab === tab.id ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#10b981' : '#64748b',
                  transition: 'all 0.2s', fontWeight: 600, fontSize: '0.9rem'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Form Area */}
          <div style={{ 
            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '1.5rem', padding: '2.5rem' 
          }}>
            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield size={20} color="#10b981" /> Account Information
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Username</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input 
                        type="text" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})}
                        className="rail-input" style={{ paddingLeft: '2.75rem' }} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input 
                        type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})}
                        className="rail-input" style={{ paddingLeft: '2.75rem' }} 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <AnimatedButton type="submit" variant="primary" disabled={loading} icon={Save} style={{ padding: '0.75rem 2rem' }}>
                    {loading ? 'Saving...' : 'Update Profile'}
                  </AnimatedButton>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Key size={20} color="#f59e0b" /> Security Credentials
                  </h3>
                </div>

                <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input 
                        type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                        placeholder="••••••••" className="rail-input" style={{ paddingLeft: '2.75rem' }} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>New Password</label>
                      <input 
                        type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                        placeholder="••••••••" className="rail-input" 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Confirm New Password</label>
                      <input 
                        type="password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                        placeholder="••••••••" className="rail-input" 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <AnimatedButton type="submit" variant="primary" disabled={loading} icon={Key} style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    {loading ? 'Rotating...' : 'Change Password'}
                  </AnimatedButton>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
