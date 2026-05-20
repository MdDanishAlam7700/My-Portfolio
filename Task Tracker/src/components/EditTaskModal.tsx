'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, Clock, History as HistoryIcon, Plus } from 'lucide-react';
import { useStore, Task, User } from '@/lib/Store';
import MultiSelectDropdown from './MultiSelectDropdown';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const EditTaskModal = ({ isOpen, onClose, task }: EditTaskModalProps) => {
  const { updateTask, users, currentUser, departments } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setAssignedTo(task.assignedTo);
      setLinks(task.links || []);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask(task.id, { title, description, dueDate, assignedTo, links: links.filter(l => l.label && l.url) });
    onClose();
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.fullName || 'Unknown';
  const getAssignerRole = () => users.find(u => u.id === task.assignedBy)?.role || 'department';

  // Permission Logic:
  // 1. Full Edit: Current user is the assigner OR (Boss/Admin is the assigner AND Current user is Boss/Admin)
  // 2. Limited Edit: Current user is among assignedTo AND task was assigned by Boss/Admin
  const isAssigner = currentUser?.id === task.assignedBy;
  const isBossAdmin = ['boss', 'admin'].includes(currentUser?.role || '');
  const isHighCommandAssigner = ['boss', 'admin'].includes(getAssignerRole());
  const isRecipient = task.assignedTo.includes(currentUser?.id || '');
  
  const canEditFull = isAssigner || (isHighCommandAssigner && isBossAdmin);
  const canEditLimited = isRecipient && isHighCommandAssigner;
  const canEditAny = canEditFull || canEditLimited;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '2rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface-high)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 className="neon-text-amber" style={{ margin: 0, fontSize: '1.2rem' }}>Modify Deployment</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.5 }}>Task ID: {task.id}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><X size={20}/></button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={labelStyle}>Mission Status</label>
              <select 
                style={inputStyle}
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                disabled={!canEditAny}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label style={labelStyle}>Priority Level</label>
              <div style={{ ...inputStyle, background: 'rgba(255,255,255,0.05)', color: (task.priority || 'normal') === 'urgent' ? 'var(--neon-amber)' : 'var(--neon-cyan)' }}>
                {(task.priority || 'normal').toUpperCase()}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label style={labelStyle}>Task Title</label>
            <input 
              style={inputStyle} 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              readOnly={!canEditFull}
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Operational Directives (Description)</label>
            <textarea 
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              readOnly={!canEditFull}
              placeholder={!canEditFull ? "No description provided." : "Enter detailed task instructions..."}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={labelStyle}>Due Date</label>
              <input 
                type="date" 
                style={inputStyle} 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                required 
                readOnly={!canEditFull}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Assigned By</label>
              <div style={{ ...inputStyle, background: 'var(--surface-low)', opacity: 0.8 }}>
                {users.find(u => u.id === task.assignedBy)?.fullName || 'Unknown'}
              </div>
            </div>
          </div>

          <MultiSelectDropdown 
              label="Assigned Operatives"
              options={users.map(u => ({ 
                id: u.id, 
                label: u.fullName,
                sublabel: u.departmentIds.map(id => departments.find(d => d.id === id)?.name).join(', ')
              }))}
              selectedIds={assignedTo}
              onChange={setAssignedTo}
              placeholder="Select operatives..."
              disabled={!canEditFull}
            />

          <div className="form-group">
            <label style={labelStyle}>Resources (Links & Text)</label>
            {links.length === 0 && !canEditAny && (
              <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: 0 }}>No resources attached.</p>
            )}
            {links.map((link, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  placeholder="Label" 
                  style={{ ...inputStyle, flex: 1 }} 
                  value={link.label}
                  readOnly={!canEditAny}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].label = e.target.value;
                    setLinks(newLinks);
                  }}
                />
                <input 
                  placeholder="URL/Text" 
                  style={{ ...inputStyle, flex: 2 }} 
                  value={link.url}
                  readOnly={!canEditAny}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].url = e.target.value;
                    setLinks(newLinks);
                  }}
                />
              </div>
            ))}
            {canEditAny && (
              <button 
                type="button" 
                onClick={() => setLinks([...links, { label: '', url: '' }])}
                style={{ 
                  background: 'transparent', 
                  border: '1px dashed var(--glass-border)', 
                  color: 'var(--neon-cyan)',
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.5rem',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <Plus size={16} /> Add Resource
              </button>
            )}
          </div>

          {!canEditFull && canEditLimited && (
            <div style={{ padding: '1rem', background: 'var(--glass-tint-cyan)', border: '1px solid var(--neon-cyan)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>
              Collaborative Mode: High Command assigned this task. You can only update status, add resources, and provide mission notes.
            </div>
          )}

          {!canEditAny && (
            <div style={{ padding: '1rem', background: 'var(--surface-low)', border: '1px solid var(--glass-border)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.7 }}>
              Read-only mode: You are viewing a mission assigned to other operatives.
            </div>
          )}

          {canEditAny && (
            <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Save size={18} style={{ marginRight: '0.5rem' }} /> {canEditFull ? 'Save Modifications' : 'Post Updates'}
            </button>
          )}
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <HistoryIcon size={16} /> {showHistory ? 'Hide' : 'View'} Modification History
          </button>

          {showHistory && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {task.history.length === 0 ? (
                <p style={{ fontSize: '0.75rem', opacity: 0.3, fontStyle: 'italic' }}>No historical modifications detected.</p>
              ) : (
                task.history.map(h => (
                  <div key={h.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', background: 'var(--surface-low)', padding: '0.75rem', borderRadius: '4px' }}>
                    <Clock size={14} style={{ color: 'var(--text-dim)', marginTop: '0.1rem' }} />
                    <div>
                      <p style={{ margin: 0, color: 'var(--foreground)' }}>{h.changes}</p>
                      <p style={{ margin: 0, color: 'var(--text-dim)' }}>by {getUserName(h.editorId)} • {new Date(h.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  marginBottom: '0.5rem',
  letterSpacing: '1px'
};

const inputStyle = {
  width: '100%',
  background: 'var(--surface-mid)',
  border: '1px solid var(--glass-border)',
  borderRadius: '4px',
  padding: '0.75rem',
  color: 'var(--foreground)',
  outline: 'none',
  fontSize: '0.9rem'
};

export default EditTaskModal;
