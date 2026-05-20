'use client';
import React, { useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Trash2,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { 
    currentUser, 
    notifications, 
    markNotificationAsRead, 
    clearNotifications 
  } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.push('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => 
    !n.userIds || n.userIds.includes(currentUser.id)
  );

  const handleMarkAllRead = () => {
    userNotifications.forEach(n => {
      if (!n.readBy.includes(currentUser.id)) {
        markNotificationAsRead(n.id);
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare size={18} className="neon-text-cyan" />;
      case 'approval': return <CheckCircle size={18} className="neon-text-green" />;
      case 'task': return <Bell size={18} className="neon-text-purple" />;
      default: return <AlertTriangle size={18} className="neon-text-amber" />;
    }
  };

  return (
    <main className="app-container">
      <Sidebar />
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>System Alerts</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time intelligence feed and directive updates.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleMarkAllRead} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Mark all read</button>
            <button onClick={clearNotifications} className="btn-critical" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <Trash2 size={16} />
            </button>
          </div>
        </header>

        {userNotifications.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <Bell size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Intel feed is currently clear.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userNotifications.map(n => {
              const isRead = n.readBy.includes(currentUser.id);
              return (
                <div 
                  key={n.id} 
                  className={`glass-card ${!isRead ? 'neon-glow-cyan' : ''}`}
                  style={{ 
                    padding: '1.25rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    border: isRead ? '1px solid var(--glass-border)' : '1px solid var(--neon-cyan)',
                    background: isRead ? 'rgba(255,255,255,0.02)' : 'rgba(0,255,255,0.05)',
                    transition: '0.3s'
                  }}
                  onClick={() => markNotificationAsRead(n.id)}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'var(--surface-mid)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid var(--glass-border)'
                  }}>
                    {getIcon(n.type)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: isRead ? 'normal' : 'bold' }}>{n.message}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={12} /> {new Date(n.timestamp).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--neon-cyan)', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {n.type}
                      </span>
                    </div>
                  </div>

                  {n.link && (
                    <Link href={n.link} style={{ color: 'var(--neon-cyan)', opacity: 0.5 }}>
                      <ArrowRight size={20} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
