'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore, Task } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Check, X, Info, Clock, Link as LinkIcon, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function ApprovalsPage() {
  const { currentUser, getTasksForUser, updateTaskStatus, addNoteToTask, users, departments } = useStore();
  const router = useRouter();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [supervisorComment, setSupervisorComment] = useState("");

  useEffect(() => {
    if (!currentUser) router.push('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  const approvalTasks = getTasksForUser().filter(t => t.status === 'waiting_approvals');

  const handleApprove = (taskId: string) => {
    updateTaskStatus(taskId, 'done');
  };

  const handleReject = (taskId: string) => {
    updateTaskStatus(taskId, 'in_progress');
  };

  const handleAddDirective = (taskId: string) => {
    if (!supervisorComment.trim()) return;
    addNoteToTask(taskId, supervisorComment);
    setSupervisorComment("");
  };

  const getUserName = (userIds: string | string[]) => {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    return ids.map(id => users.find(u => u.id === id)?.fullName).filter(Boolean).join(', ') || 'Unknown';
  };

  const getDeptNames = (deptIds: string[]) => {
    return deptIds.map(id => departments.find(d => d.id === id)?.name).filter(Boolean).join(', ') || 'Global';
  };

  return (
    <main className="app-container">
      <Sidebar />
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h2 className="neon-text-purple" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pending Approvals</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review task history and resources before granting clearance.</p>
        </header>

        {approvalTasks.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShieldCheck size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p>No pending approvals in your sector.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {approvalTasks.map(task => (
              <div key={task.id} className="glass-card neon-glow-purple" style={{ border: '1px solid var(--neon-purple)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ margin: 0, color: 'var(--foreground)' }}>{task.title}</h3>
                      {expandedTaskId === task.id ? <ChevronUp size={18} opacity={0.5} /> : <ChevronDown size={18} opacity={0.5} />}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Operatives: <span style={{ color: 'var(--neon-cyan)' }}>{getUserName(task.assignedTo)}</span>
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--neon-purple)', textTransform: 'uppercase', padding: '0.1rem 0.5rem', border: '1px solid var(--neon-purple)', borderRadius: '4px' }}>
                        {getDeptNames(task.departmentIds)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleReject(task.id)} className="btn-critical">
                      <X size={16} /> Reject
                    </button>
                    <button onClick={() => handleApprove(task.id)} className="btn-primary" style={{ background: 'var(--neon-green)', color: '#000' }}>
                      <Check size={16} /> Approve
                    </button>
                  </div>
                </div>

                {expandedTaskId === task.id && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                      {/* Left Column: Description & Resources */}
                      <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--neon-cyan)', marginBottom: '0.75rem' }}>Operational Directives</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6', background: 'var(--surface-mid)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                          {task.description || "No description provided for this deployment."}
                        </p>

                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--neon-cyan)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Resource Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {task.links?.length > 0 ? task.links.map((link, idx) => (
                            <a 
                              key={idx} 
                              href={link.url.startsWith('http') ? link.url : '#'} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem', 
                                padding: '0.75rem', 
                                background: 'var(--surface-low)', 
                                border: '1px solid var(--glass-border)', 
                                borderRadius: '4px',
                                textDecoration: 'none',
                                color: 'var(--foreground)',
                                transition: '0.3s'
                              }}
                              className="link-hover"
                            >
                              <LinkIcon size={14} style={{ color: 'var(--neon-cyan)' }} />
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{link.label}</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5 }}>{link.url}</p>
                              </div>
                            </a>
                          )) : (
                            <p style={{ fontSize: '0.8rem', opacity: 0.3, fontStyle: 'italic' }}>No resources attached.</p>
                          )}
                        </div>
                      </div>

                      {/* Right Column: History & Notes */}
                      <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--neon-amber)', marginBottom: '0.75rem' }}>Modification History</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                          {task.history?.length > 0 ? task.history.map(h => (
                            <div key={h.id} style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,171,0,0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,171,0,0.1)' }}>
                              <Clock size={14} style={{ color: 'var(--neon-amber)', marginTop: '0.1rem' }} />
                              <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--foreground)' }}>{h.changes}</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)' }}>by {users.find(u => u.id === h.editorId)?.fullName} • {new Date(h.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          )) : (
                            <p style={{ fontSize: '0.8rem', opacity: 0.3, fontStyle: 'italic' }}>No history recorded.</p>
                          )}
                        </div>

                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--neon-green)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Operative Notes</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {task.notes?.length > 0 ? task.notes.map(n => (
                            <div key={n.id} style={{ padding: '0.75rem', background: 'rgba(0,255,128,0.05)', borderLeft: '2px solid var(--neon-green)', borderRadius: '0 4px 4px 0' }}>
                              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>{n.content}</p>
                              <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5 }}>{users.find(u => u.id === n.authorId)?.fullName} • {new Date(n.timestamp).toLocaleString()}</p>
                            </div>
                          )) : (
                            <p style={{ fontSize: '0.8rem', opacity: 0.3, fontStyle: 'italic' }}>No notes provided by operatives.</p>
                          )}
                        </div>

                        {/* Supervisor Comment Input */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--neon-cyan)', marginBottom: '0.75rem' }}>Add Supervisor Directive</h4>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <textarea 
                              value={supervisorComment}
                              onChange={(e) => setSupervisorComment(e.target.value)}
                              placeholder="Add a comment or change request..."
                              style={{ 
                                flex: 1, 
                                background: 'rgba(0,0,0,0.3)', 
                                border: '1px solid var(--glass-border)', 
                                borderRadius: '4px', 
                                padding: '0.75rem',
                                color: 'var(--foreground)',
                                fontSize: '0.85rem',
                                resize: 'none',
                                height: '60px'
                              }}
                            />
                            <button 
                              onClick={() => handleAddDirective(task.id)}
                              className="btn-primary" 
                              style={{ height: '60px', padding: '0 1rem' }}
                            >
                              <MessageSquare size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
