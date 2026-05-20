'use client';
import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/Store';
import NeuralBackground from '@/components/NeuralBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [traceId, setTraceId] = useState('LOADING...');
  const router = useRouter();
  const { login } = useStore();

  useEffect(() => {
    setTraceId(Math.random().toString(36).substring(7).toUpperCase());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Any password works for the mock, we just check email
    const success = login(email);
    if (success) {
      router.push('/');
    } else {
      setError('Operative ID not recognized. Access denied.');
    }
  };

  return (
    <div className="login-bg">
      <div className="noise-overlay" />
      <div className="hex-tech-bg" />
      <div className="command-ring ring-1" />
      <div className="command-ring ring-2" />
      <div className="command-ring ring-3" />
      <div className="center-pulse" />
      <NeuralBackground />
      <div className="animated-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '5%', left: '5%', opacity: 0.3, zIndex: 10 }}>
        <p className="flicker neon-text-cyan" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
          SYSTEM STATUS: AUTHENTICATION_REQUIRED<br />
          PORT: 8080<br />
          TRACE_ID: {traceId}
        </p>
      </div>

      <div className="glass-card login-card neon-glow-cyan" style={{ border: '1px solid var(--neon-cyan)', boxShadow: 'var(--glow-cyan)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '1rem', 
            borderRadius: '50%', 
            background: 'var(--glass-tint-cyan)',
            border: '1px solid var(--neon-cyan)',
            marginBottom: '1rem',
            boxShadow: 'inset 0 0 10px rgba(0, 243, 255, 0.3)'
          }}>
            <Shield className="neon-text-cyan" size={40} />
          </div>
          <h1 className="futuristic-text" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Neural Track</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '3px' }}>COMMAND_CENTER_ACCESS</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={labelStyle}>Operative ID</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={iconStyle} />
              <input 
                type="email" 
                placeholder="id@neural.int" 
                style={inputStyle}
                className="input-glow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={labelStyle}>Access Key</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={iconStyle} />
              <input 
                type="password" 
                placeholder="••••••••" 
                style={inputStyle}
                className="input-glow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div style={{ 
              color: 'var(--status-critical)', 
              fontSize: '0.8rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: 'rgba(255,0,0,0.1)',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--status-critical)',
              animation: 'flicker 0.3s ease infinite'
            }}>
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ 
            width: '100%', 
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            height: '3.5rem',
            fontSize: '1rem'
          }}>
            AUTHORIZE ACCESS <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Warning: This terminal is for authorized personnel only.<br />All sessions are encrypted and recorded.
          </p>
        </div>
      </div>

      {/* Decorative Bottom Text */}
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', opacity: 0.3, textAlign: 'right', zIndex: 10 }}>
        <p className="neon-text-amber" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
          CONNECTION: SECURE<br />
          LOCATION: UNDISCLOSED_NODE
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  color: 'var(--neon-cyan)',
  marginBottom: '0.5rem',
  fontWeight: 'bold'
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-dim)',
  pointerEvents: 'none'
};

const inputStyle = {
  width: '100%',
  background: 'var(--surface-mid)',
  border: '1px solid var(--glass-border)',
  borderRadius: '4px',
  padding: '0.85rem 1rem 0.85rem 3rem',
  color: 'var(--foreground)',
  outline: 'none',
  transition: '0.3s',
  fontSize: '0.9rem'
};
