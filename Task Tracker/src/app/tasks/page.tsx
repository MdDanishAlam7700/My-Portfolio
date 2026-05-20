'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore, Task } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { MessageSquare, Calendar, ChevronRight, Edit3, Save, History as HistoryIcon, Clock } from 'lucide-react';

export default function AllTasksPage() {
  const { currentUser, getTasksForUser, users, addNoteToTask, updateTaskStatus, updateTask } = useStore();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', dueDate: '' });
  const [activeTab, setActiveTab] = useState<'logs' | 'history'>('logs');
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      let filteredTasks = getTasksForUser();
      if (deptFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.departmentIds.includes(deptFilter));
      }
      setTasks(filteredTasks);
    }
  }, [currentUser, router, getTasksForUser, deptFilter]);

  if (!currentUser) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote || !selectedTask) return;
    addNoteToTask(selectedTask.id, newNote);
    setNewNote('');
    // Refresh selected task
    refreshSelectedTask(selectedTask.id);
  };

  const handleSaveEdit = () => {
    if (!selectedTask) return;
    updateTask(selectedTask.id, editData);
    setIsEditing(false);
    refreshSelectedTask(selectedTask.id);
  };

  const refreshSelectedTask = (id: string) => {
    const updatedTask = getTasksForUser().find(t => t.id === id);
    if (updatedTask) setSelectedTask(updatedTask);
    setTasks(getTasksForUser());
  };

  const canEdit = (task: Task) => {
    if (!currentUser) return false;
    return task.assignedBy === currentUser.id || currentUser.role === 'boss' || currentUser.role === 'admin';
  };

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.fullName || 'Unknown';

  return (
    <main className="app-container">
      <Sidebar />
      <div className="main-content" style={{ padding: '2rem', display: 'flex', gap: '2rem', height: '100vh', overflow: 'hidden' }}>
        
        {/* TASK LIST */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
          <header style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem' }}>All Tasks</h2>
                <p style={{ color: 'var(--text-muted)' }}>Manage and track your operational directives.</p>
              </div>
              {(currentUser.role === 'boss' || currentUser.role === 'admin') && (
                <select 
                  value={deptFilter} 
                  onChange={e => setDeptFilter(e.target.value)}
                  style={{ background: 'var(--surface-mid)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.4rem 1rem', borderRadius: '4px', outline: 'none' }}
                >
                  <option value="all">Global Access</option>
                  {useStore().departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              )}
            </div>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {useStore().departments.map(dept => {
              const deptTasks = tasks.filter(t => t.departmentIds.includes(dept.id));
              if (deptTasks.length === 0) return null;

              return (
                <div key={dept.id}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    marginBottom: '1rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--surface-mid)',
                    borderLeft: '4px solid var(--neon-cyan)',
                    borderRadius: '0 4px 4px 0'
                  }}>
                    <h3 className="futuristic-text" style={{ fontSize: '0.8rem', margin: 0, color: 'var(--neon-cyan)' }}>
                      {dept.name} Sector
                    </h3>
                    <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)' }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {deptTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`glass-card ${selectedTask?.id === task.id ? 'neon-glow-cyan' : ''}`}
                        style={{ 
                          padding: '1.25rem', 
                          cursor: 'pointer',
                          border: selectedTask?.id === task.id ? '1px solid var(--neon-cyan)' : '1px solid var(--glass-border)',
                          background: selectedTask?.id === task.id ? 'var(--glass-tint-cyan)' : 'var(--glass-bg)'
                        }}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--foreground)', fontSize: '1rem' }}>{task.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Assigned to: <span style={{ color: 'var(--neon-amber)' }}>{task.assignedTo.map(id => getUserName(id)).filter(Boolean).join(', ') || 'Unassigned'}</span>
                            </p>
                          </div>
                          <span className={`status-badge ${task.status}`} style={{ fontSize: '0.65rem' }}>
                            {task.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {tasks.filter(t => t.departmentIds.length === 0).length > 0 && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginBottom: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--surface-mid)',
                  borderLeft: '4px solid var(--text-dim)',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <h3 className="futuristic-text" style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-dim)' }}>
                    Unassigned Sector
                  </h3>
                  <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {tasks.filter(t => t.departmentIds.length === 0).map(task => (
                    <div 
                      key={task.id} 
                      className={`glass-card ${selectedTask?.id === task.id ? 'neon-glow-cyan' : ''}`}
                      style={{ 
                        padding: '1.25rem', 
                        cursor: 'pointer',
                        border: selectedTask?.id === task.id ? '1px solid var(--neon-cyan)' : '1px solid var(--glass-border)'
                      }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--foreground)', fontSize: '1rem' }}>{task.title}</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Assigned to: <span style={{ color: 'var(--neon-amber)' }}>
                              {task.assignedTo.map(id => getUserName(id)).filter(Boolean).join(', ') || 'Unassigned'}
                            </span>
                          </p>
                        </div>
                        <span className={`status-badge ${task.status}`} style={{ fontSize: '0.65rem' }}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TASK DETAILS & NOTES */}
        {selectedTask ? (
          <div className="glass-card" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
            <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                {isEditing ? (
                  <input 
                    style={{ ...inputStyle, fontSize: '1.5rem', fontWeight: 'bold' }} 
                    value={editData.title} 
                    onChange={e => setEditData({...editData, title: e.target.value})}
                  />
                ) : (
                  <h2 className="neon-text-amber" style={{ margin: 0 }}>{selectedTask.title}</h2>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {canEdit(selectedTask) && (
                    isEditing ? (
                      <button onClick={handleSaveEdit} className="btn-primary" style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={16} /> Save
                      </button>
                    ) : (
                      <button onClick={() => {
                        setEditData({ title: selectedTask.title, description: selectedTask.description, dueDate: selectedTask.dueDate });
                        setIsEditing(true);
                      }} style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Edit3 size={16} /> Edit
                      </button>
                    )
                  )}
                  <select 
                    value={selectedTask.status} 
                    onChange={(e) => {
                      updateTaskStatus(selectedTask.id, e.target.value as any);
                      refreshSelectedTask(selectedTask.id);
                    }}
                    style={statusDropdownStyle}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="started">Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_approvals">Waiting Approvals</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              {isEditing ? (
                <textarea 
                  style={{ ...inputStyle, minHeight: '100px', marginBottom: '1.5rem' }} 
                  value={editData.description} 
                  onChange={e => setEditData({...editData, description: e.target.value})}
                />
              ) : (
                <p style={{ color: 'var(--foreground)', opacity: 0.8, marginBottom: '1.5rem' }}>{selectedTask.description}</p>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} className="neon-text-cyan" />
                  <span style={{ color: 'var(--text-muted)' }}>Due:</span> 
                  {isEditing ? (
                    <input type="date" style={inputStyle} value={editData.dueDate} onChange={e => setEditData({...editData, dueDate: e.target.value})} />
                  ) : (
                    selectedTask.dueDate
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronRight size={16} className="neon-text-amber" />
                  <span style={{ color: 'var(--text-muted)' }}>Assigned By:</span> {getUserName(selectedTask.assignedBy)}
                </div>
              </div>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setActiveTab('logs')}
                style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'logs' ? '2px solid var(--neon-cyan)' : 'none', color: activeTab === 'logs' ? 'var(--neon-cyan)' : 'var(--text-muted)', padding: '0.5rem 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <MessageSquare size={16} /> Operational Logs
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'history' ? '2px solid var(--neon-amber)' : 'none', color: activeTab === 'history' ? 'var(--neon-amber)' : 'var(--text-muted)', padding: '0.5rem 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <HistoryIcon size={16} /> Modification History
              </button>
            </div>

            {/* CONTENT SECTION */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
              {activeTab === 'logs' ? (
                <>
                  {selectedTask.notes?.length === 0 ? (
                    <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center', margin: '2rem 0' }}>No logs recorded yet.</p>
                  ) : (
                    selectedTask.notes?.map(note => (
                      <div key={note.id} style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '8px', borderLeft: '2px solid var(--neon-cyan)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                          <strong style={{ color: 'var(--neon-cyan)' }}>{getUserName(note.authorId)}</strong>
                          <span style={{ color: 'var(--text-dim)' }}>{new Date(note.timestamp).toLocaleString()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--foreground)', opacity: 0.8, lineHeight: '1.5' }}>{note.content}</p>
                      </div>
                    ))
                  )}
                </>
              ) : (
                <>
                  {selectedTask.history?.length === 0 ? (
                    <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center', margin: '2rem 0' }}>No modifications detected in history.</p>
                  ) : (
                    selectedTask.history?.map(log => (
                      <div key={log.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Clock size={14} style={{ marginTop: '0.2rem', opacity: 0.4 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--foreground)' }}>{log.changes}</p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            by {getUserName(log.editorId)} • {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {activeTab === 'logs' && (
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <input 
                  type="text" 
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Append new log entry..."
                  style={inputStyle}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Log</button>
              </form>
            )}
          </div>
        ) : (
          <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
            Select a task to view details and operational logs.
          </div>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  background: 'var(--surface-mid)',
  border: '1px solid var(--glass-border)',
  color: 'var(--foreground)',
  padding: '0.75rem',
  borderRadius: '4px',
  outline: 'none',
  width: '100%'
};

const statusDropdownStyle = {
  background: 'var(--surface-mid)',
  border: '1px solid var(--glass-border)',
  color: 'var(--neon-amber)',
  padding: '0.4rem 1rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
  outline: 'none'
};
