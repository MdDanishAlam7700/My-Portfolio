'use client';
import React, { useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { Settings, User, Key, Server } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, departments } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.push('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  const currentDeptNames = departments
    .filter(d => currentUser.departmentIds.includes(d.id))
    .map(d => d.name)
    .join(', ') || 'Central Command';

  return (
    <main className="app-container">
      <Sidebar />
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>System Settings</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure your operative profile and interface.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* PROFILE */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <User className="neon-text-amber" />
              <h3>Operative Profile</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Identification</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem' }}>{currentUser.fullName}</p>
              </div>
              <div style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comms Link (Email)</span>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--neon-cyan)' }}>{currentUser.email}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clearance Level</span>
                  <p style={{ margin: '0.25rem 0 0 0', textTransform: 'uppercase', color: 'var(--neon-amber)' }}>{currentUser.role.replace('_', ' ')}</p>
                </div>
                <div style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Sector(s)</span>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{currentDeptNames}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM PREFERENCES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Server className="neon-text-cyan" />
                <h3>Interface Preferences</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Currently utilizing default Neural Track aesthetic overlay. Modifications locked by system administrator.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,243,255,0.05)', borderRadius: '4px', border: '1px solid rgba(0,243,255,0.2)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-cyan)', boxShadow: '0 0 10px var(--neon-cyan)' }} />
                <span>Cyberpunk AMOLED Theme Active</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Key className="neon-text-purple" />
                <h3>Security</h3>
              </div>
              <button className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)' }}>
                Request Password Reset Cycle
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
