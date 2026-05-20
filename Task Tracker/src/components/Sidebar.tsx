import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Terminal,
  Database,
  StickyNote,
  Sun,
  Moon,
  Bell,
  Calendar
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/Store';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const { currentUser, logout, notifications } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Calculate unread notifications
  const unreadCount = notifications.filter(n => 
    (!n.userIds || n.userIds.includes(currentUser?.id || '')) && 
    !n.readBy.includes(currentUser?.id || '')
  ).length;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="glass-card sidebar" style={{ 
      margin: '1rem', 
      height: 'calc(100vh - 2rem)',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--glass-border)',
      padding: '1.5rem'
    }}>
      <div className="brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Terminal className="neon-text-cyan" size={28} />
          <h1 className="futuristic-text" style={{ fontSize: '1.2rem', margin: 0 }}>Neural Track</h1>
        </div>
        <button 
          onClick={toggleTheme}
          style={{ 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)', 
            color: 'var(--foreground)', 
            padding: '0.4rem', 
            borderRadius: '6px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <nav style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.4rem', 
        overflowY: 'auto',
        paddingRight: '0.5rem',
        marginRight: '-0.5rem'
      }}>
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/" active={pathname === '/'} />
        <NavItem icon={<CheckSquare size={20} />} label="All Tasks" href="/tasks" active={pathname === '/tasks'} />
        
        <NavItem 
          icon={<Bell size={20} />} 
          label="Notifications" 
          href="/notifications" 
          active={pathname === '/notifications'} 
          badge={unreadCount > 0 ? unreadCount : undefined}
        />

        <NavItem icon={<Calendar size={20} />} label="Calendar" href="/calendar" active={pathname === '/calendar'} />

        <NavItem icon={<Users size={20} />} label="Departments" href="/departments" active={pathname === '/departments'} />
        <NavItem icon={<ShieldCheck size={20} />} label="Approvals" href="/approvals" active={pathname === '/approvals'} />
        
        {(currentUser?.role === 'boss' || currentUser?.role === 'admin') && (
          <NavItem icon={<Database size={20} />} label="System Directory" href="/directory" active={pathname === '/directory'} />
        )}

        <NavItem icon={<StickyNote size={20} />} label="Personal Notes" href="/notes" active={pathname === '/notes'} />

        <div style={{ margin: '1rem 0', height: '1px', background: 'var(--glass-border)', minHeight: '1px' }} />
        <NavItem icon={<Settings size={20} />} label="Settings" href="/settings" active={pathname === '/settings'} />
      </nav>

      <div className="user-profile" style={{ 
        marginTop: '1.5rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'var(--glass-bg)',
        zIndex: 10
      }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '4px', 
          background: 'linear-gradient(45deg, var(--neon-cyan), var(--neon-amber))',
          flexShrink: 0
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser?.fullName || 'Unknown'}
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize' }}>
            {currentUser?.role.replace('_', ' ')}
          </p>
        </div>
        <LogOut size={18} style={{ opacity: 0.5, cursor: 'pointer', flexShrink: 0 }} onClick={handleLogout} />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false, href, badge }: { icon: React.ReactNode, label: string, active?: boolean, href: string, badge?: number }) => {
  return (
    <Link href={href} className={`nav-item ${active ? 'active' : ''}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      transition: '0.2s',
      color: active ? 'var(--neon-cyan)' : 'var(--text-muted)',
      background: active ? 'var(--glass-tint-cyan)' : 'transparent',
      border: active ? '1px solid var(--neon-cyan)' : '1px solid transparent',
      boxShadow: active ? 'var(--glow-cyan)' : 'none',
      textDecoration: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {icon}
        <span style={{ fontSize: '0.9rem', fontWeight: active ? '600' : '400' }}>{label}</span>
      </div>
      {badge !== undefined && (
        <span style={{ 
          background: 'var(--status-critical)', 
          color: 'white', 
          fontSize: '0.7rem', 
          padding: '2px 6px', 
          borderRadius: '10px',
          fontWeight: 'bold',
          boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)'
        }}>
          {badge}
        </span>
      )}
    </Link>
  );
};

export default Sidebar;
