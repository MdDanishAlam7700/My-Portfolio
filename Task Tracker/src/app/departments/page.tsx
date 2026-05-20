'use client';
import React, { useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { Users, Building2 } from 'lucide-react';

export default function DepartmentsPage() {
  const { currentUser, departments, users } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.push('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <main className="app-container">
      <Sidebar />
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Department Personnel</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Global operative assignments.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {departments.map(dept => {
            const deptUsers = users.filter(u => u.departmentIds?.includes(dept.id));
            return (
              <div key={dept.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <Building2 className="neon-text-amber" />
                  <h3 style={{ margin: 0 }}>{dept.name}</h3>
                </div>

                {deptUsers.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No operatives assigned.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {deptUsers.map(u => (
                      <li key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={14} color="#fff" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--foreground)' }}>{u.fullName}</p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--neon-cyan)', textTransform: 'uppercase' }}>{u.role.replace('_', ' ')}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
