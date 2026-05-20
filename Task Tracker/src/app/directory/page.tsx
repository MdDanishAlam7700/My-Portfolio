'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore, Role, User } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { UserPlus, Building, Shield, Edit2, Trash2, X, Check } from 'lucide-react';

export default function DirectoryPage() {
  const { currentUser, users, departments, addDepartment, addUser, updateUser, deleteUser } = useStore();
  const router = useRouter();

  const [newDeptName, setNewDeptName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('staff');
  const [newUserDepts, setNewUserDepts] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'admin' && currentUser.role !== 'boss') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;
  
  if (currentUser.role !== 'admin' && currentUser.role !== 'boss') {
    return (
      <main className="app-container">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div className="glass-card neon-glow-amber" style={{ padding: '3rem', textAlign: 'center' }}>
            <Shield className="neon-text-amber" size={48} style={{ marginBottom: '1rem' }} />
            <h2 className="neon-text-amber">ACCESS DENIED</h2>
            <p style={{ color: 'var(--text-muted)' }}>You do not have the required clearance level to view the System Directory.</p>
          </div>
        </div>
      </main>
    );
  }

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    addDepartment(newDeptName);
    setNewDeptName('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName) return;
    
    if (currentUser.role === 'admin' && (newUserRole === 'admin' || newUserRole === 'boss')) {
      alert("You don't have clearance to create this role.");
      return;
    }

    addUser({
      email: newUserEmail,
      fullName: newUserName,
      role: newUserRole,
      departmentIds: newUserDepts
    });

    setNewUserEmail('');
    setNewUserName('');
    setNewUserRole('staff');
    setNewUserDepts([]);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  const toggleDeptForUser = (deptId: string, isEditing: boolean) => {
    if (isEditing && editingUser) {
      const currentDepts = editingUser.departmentIds;
      const newDepts = currentDepts.includes(deptId) 
        ? currentDepts.filter(id => id !== deptId)
        : [...currentDepts, deptId];
      setEditingUser({ ...editingUser, departmentIds: newDepts });
    } else {
      setNewUserDepts(prev => prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]);
    }
  };

  return (
    <main className="app-container">
      <Sidebar />
      
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h2 className="neon-text-amber" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>System Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Command Level Access: <span style={{ color: 'var(--neon-amber)', textTransform: 'uppercase' }}>{currentUser.role}</span></p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* DEPARTMENTS PANEL */}
          <div className="glass-card neon-glow-cyan" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Building className="neon-text-cyan" />
              <h3>Departments</h3>
            </div>
            
            <form onSubmit={handleAddDept} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="New Department Name" 
                value={newDeptName}
                onChange={e => setNewDeptName(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Add</button>
            </form>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {departments.map(d => (
                <li key={d.id} style={{ padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--glass-border)', borderRadius: '4px' }}>
                  {d.name} <span style={{ opacity: 0.5, fontSize: '0.75rem', float: 'right' }}>ID: {d.id}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ADD USER PANEL */}
          <div className="glass-card neon-glow-amber" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <UserPlus className="neon-text-amber" />
              <h3>Initialize Operative</h3>
            </div>
            
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                style={inputStyle}
                required
              />
              <input 
                type="email" 
                placeholder="Operative Email" 
                value={newUserEmail}
                onChange={e => setNewUserEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <select style={inputStyle} value={newUserRole} onChange={e => setNewUserRole(e.target.value as Role)}>
                {currentUser.role === 'boss' && <option value="boss">Boss (Super Admin)</option>}
                {currentUser.role === 'boss' && <option value="admin">System Admin</option>}
                <option value="dept_admin">Department Lead</option>
                <option value="staff">Staff Operative</option>
              </select>

              <div style={{ padding: '1rem', background: 'var(--surface-low)', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Sector Assignment (Select Multiple)</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {departments.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDeptForUser(d.id, false)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: newUserDepts.includes(d.id) ? 'var(--neon-amber)' : 'var(--glass-border)',
                        background: newUserDepts.includes(d.id) ? 'var(--glass-tint-amber)' : 'transparent',
                        color: newUserDepts.includes(d.id) ? 'var(--neon-amber)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ border: '1px solid var(--neon-amber)', color: 'var(--neon-amber)' }}>Register Operative</button>
            </form>
          </div>
        </div>

        {/* ALL USERS LIST */}
        <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Shield className="neon-text-cyan" />
            <h3>Active Personnel Roster</h3>
          </div>

          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Name</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Email</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Role</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Sectors</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{u.fullName}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--neon-cyan)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>{u.role.replace('_', ' ')}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {u.departmentIds.length === 0 ? (
                        <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>Global</span>
                      ) : (
                        u.departmentIds.map(id => (
                          <span key={id} style={{ fontSize: '0.65rem', background: 'var(--surface-low)', color: 'var(--neon-cyan)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--glass-border)', boxShadow: '0 0 5px rgba(0, 243, 255, 0.1)' }}>
                            {departments.find(d => d.id === id)?.name || 'Unknown'}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Edit2 size={16} className="neon-text-purple" style={{ cursor: 'pointer' }} onClick={() => setEditingUser(u)} />
                      <Trash2 size={16} className="neon-text-amber" style={{ cursor: 'pointer' }} onClick={() => deleteUser(u.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card neon-glow-purple" style={{ padding: '2rem', width: '90%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 className="neon-text-purple">Edit Operative Profile</h3>
              <X style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => setEditingUser(null)} />
            </div>
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                style={inputStyle} 
                value={editingUser.fullName} 
                onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })} 
                placeholder="Full Name"
              />
              <input 
                style={inputStyle} 
                value={editingUser.email} 
                onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} 
                placeholder="Email Address"
              />
              <select 
                style={inputStyle} 
                value={editingUser.role} 
                onChange={e => setEditingUser({ ...editingUser, role: e.target.value as Role })}
              >
                {currentUser.role === 'boss' && <option value="boss">Boss (Super Admin)</option>}
                {currentUser.role === 'boss' && <option value="admin">System Admin</option>}
                <option value="dept_admin">Department Lead</option>
                <option value="staff">Staff Operative</option>
              </select>

              <div style={{ padding: '1rem', background: 'var(--surface-low)', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Sector Assignment</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {departments.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDeptForUser(d.id, true)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: editingUser.departmentIds.includes(d.id) ? 'var(--neon-purple)' : 'var(--glass-border)',
                        background: editingUser.departmentIds.includes(d.id) ? 'var(--glass-tint-purple)' : 'transparent',
                        color: editingUser.departmentIds.includes(d.id) ? 'var(--neon-purple)' : 'var(--text-dim)',
                        cursor: 'pointer'
                      }}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ background: 'var(--neon-purple)', borderColor: 'var(--neon-purple)' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

const inputStyle = {
  width: '100%',
  background: 'var(--surface-mid)',
  border: '1px solid var(--glass-border)',
  borderRadius: '4px',
  padding: '0.75rem',
  color: 'var(--foreground)',
  outline: 'none',
  transition: '0.3s'
};
