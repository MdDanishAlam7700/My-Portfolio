'use client';
import React, { useState } from 'react';
import { X, Link as LinkIcon, Plus, Send } from 'lucide-react';
import { useStore } from '@/lib/Store';
import MultiSelectDropdown from './MultiSelectDropdown';

const NewTaskModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addTask, users, currentUser, departments } = useStore();
  const [links, setLinks] = useState([{ label: '', url: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [needsApproval, setNeedsApproval] = useState(false);
  
  // Filter assignable users based on selected departments
  const assignableUsers = selectedDepts.length > 0 
    ? users.filter(u => u.departmentIds.some(id => selectedDepts.includes(id)))
    : users; // If no dept selected, show all as fallback or keep empty? User said "assign should show ONLY people with hr department"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    addTask({
      title,
      description,
      links: links.filter(l => l.label && l.url),
      status: 'not_started',
      startDate,
      dueDate,
      departmentIds: selectedDepts.length > 0 ? selectedDepts : [departments[0].id],
      assignedTo: assigneeIds,
      assignedBy: currentUser.id,
      needsApproval,
      priority: 'normal'
    });
    
    // Reset and close
    setTitle('');
    setDescription('');
    setStartDate('');
    setDueDate('');
    setAssigneeIds([]);
    setSelectedDepts([]);
    setNeedsApproval(false);
    setLinks([{ label: '', url: '' }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)', // Slightly lighter for light mode backdrop
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }} className="modal-backdrop">
      <div className="glass-card" style={{ 
        width: '90%', 
        maxWidth: '600px', 
        padding: '2rem',
        border: '1px solid var(--neon-cyan)',
        boxShadow: 'var(--glow-cyan)',
        background: 'var(--surface-high)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 className="neon-text-cyan">Initialize Task</h2>
          <X onClick={onClose} style={{ cursor: 'pointer', opacity: 0.5 }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={labelStyle}>Task Title</label>
            <input 
              type="text" 
              placeholder="e.g. Q4 Performance Audit" 
              style={inputStyle} 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Operational Directives (Description)</label>
            <textarea 
              placeholder="Enter detailed task instructions..." 
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={labelStyle}>Start Date</label>
              <input type="date" style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Due Date</label>
              <input type="date" style={inputStyle} value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <MultiSelectDropdown 
              label="Target Sectors"
              options={departments.map(d => ({ id: d.id, label: d.name }))}
              selectedIds={selectedDepts}
              onChange={setSelectedDepts}
              placeholder="Select sectors..."
            />
            <MultiSelectDropdown 
              label="Assign Operatives"
              options={assignableUsers.map(u => ({ 
                id: u.id, 
                label: u.fullName,
                sublabel: u.departmentIds.map(id => departments.find(d => d.id === id)?.name).join(', ')
              }))}
              selectedIds={assigneeIds}
              onChange={setAssigneeIds}
              placeholder={selectedDepts.length === 0 ? "Select operatives..." : "Filtering by sector..."}
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Resources (Links & Text)</label>
            {links.map((link, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  placeholder="Label" 
                  style={{ ...inputStyle, flex: 1 }} 
                  value={link.label}
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
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx].url = e.target.value;
                    setLinks(newLinks);
                  }}
                />
              </div>
            ))}
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="approval" checked={needsApproval} onChange={e => setNeedsApproval(e.target.checked)} />
            <label htmlFor="approval" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Requires Admin Approval</label>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Deploy Task <Send size={16} style={{ marginLeft: '0.5rem' }} />
          </button>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  color: 'var(--text-muted)',
  marginBottom: '0.5rem'
};

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

export default NewTaskModal;
