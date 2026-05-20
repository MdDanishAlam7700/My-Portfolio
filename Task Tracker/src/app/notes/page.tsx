'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore, PersonalNote } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { StickyNote, Plus, Trash2, Edit2, X, Check, Save } from 'lucide-react';

export default function PersonalNotesPage() {
  const { currentUser, personalNotes, addPersonalNote, updatePersonalNote, deletePersonalNote } = useStore();
  const router = useRouter();
  const [noteContent, setNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!currentUser) router.push('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent) return;
    addPersonalNote(noteContent);
    setNoteContent('');
  };

  const handleSaveEdit = (id: string) => {
    updatePersonalNote(id, editContent);
    setEditingId(null);
  };

  const startEditing = (note: PersonalNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  return (
    <main className="app-container">
      <Sidebar />
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Neural Records</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Private encrypted logs and persistent reminders.</p>
        </header>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* NEW NOTE FORM */}
          <div className="glass-card neon-glow-cyan" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
            <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                placeholder="Synchronize new thought or reminder..." 
                style={inputStyle}
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem' }}>
                <Plus size={20} />
              </button>
            </form>
          </div>

          {/* NOTES LIST */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {personalNotes.length === 0 ? (
              <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                No active records in this sector.
              </div>
            ) : (
              personalNotes.map(note => (
                <div key={note.id} className="glass-card" style={{ padding: '1.5rem', transition: '0.3s' }}>
                  {editingId === note.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <textarea 
                        style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={() => setEditingId(null)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => handleSaveEdit(note.id)} className="btn-primary" style={{ padding: '0.4rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Save size={16} /> Update Record
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <StickyNote size={16} className="neon-text-cyan" />
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Record #{note.id.slice(-4)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <Edit2 size={14} className="neon-text-purple" style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => startEditing(note)} />
                          <Trash2 size={14} className="neon-text-amber" style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => deletePersonalNote(note.id)} />
                        </div>
                      </div>
                      <p style={{ margin: 0, color: 'var(--foreground)', opacity: 0.9, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        <span>Created: {new Date(note.timestamp).toLocaleString()}</span>
                        {note.lastEdited && <span>Last Synced: {new Date(note.lastEdited).toLocaleString()}</span>}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
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
