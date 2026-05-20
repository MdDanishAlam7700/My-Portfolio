'use client';
import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { useStore, Task } from '@/lib/Store';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock,
  Star,
  Bell,
  Trash2
} from 'lucide-react';

import EditTaskModal from "@/components/EditTaskModal";

const HOLIDAYS = [
  { date: '01-01', name: "New Year's Day", color: 'var(--foreground)', bg: 'var(--surface-low)' },
  { date: '01-14', name: "Pongal / Makar Sankranti", color: 'var(--foreground)', bg: 'var(--glass-tint-amber)' },
  { date: '01-26', name: "Republic Day", color: 'var(--foreground)', bg: 'linear-gradient(45deg, #FF9933, #138808)' },
  { date: '03-25', name: "Holi", color: 'var(--foreground)', bg: 'linear-gradient(45deg, #FF1493, #8B008B)' },
  { date: '03-29', name: "Good Friday", color: 'var(--foreground)', bg: 'var(--surface-low)' },
  { date: '04-09', name: "Ugadi / Gudi Padwa", color: 'var(--foreground)', bg: 'var(--glass-tint-amber)' },
  { date: '04-11', name: "Eid-ul-Fitr", color: 'var(--foreground)', bg: 'var(--glass-tint-purple)' },
  { date: '04-17', name: "Ram Navami", color: 'var(--foreground)', bg: 'var(--glass-tint-amber)' },
  { date: '05-01', name: "May Day", color: 'var(--foreground)', bg: 'var(--glass-tint-purple)' },
  { date: '08-15', name: "Independence Day", color: 'var(--foreground)', bg: 'linear-gradient(45deg, #FF9933, #138808)' },
  { date: '10-02', name: "Gandhi Jayanti", color: 'var(--foreground)', bg: 'var(--surface-mid)' },
  { date: '10-12', name: "Dussehra", color: 'var(--foreground)', bg: 'var(--glass-tint-amber)' },
  { date: '10-31', name: "Diwali", color: 'var(--foreground)', bg: 'linear-gradient(45deg, #FFD700, #FF4500)' },
  { date: '12-25', name: "Christmas", color: 'var(--foreground)', bg: 'var(--surface-low)' }
];

export default function CalendarPage() {
  const { tasks, currentUser, reminders, addReminder, deleteReminder } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const monthTasks = tasks.filter(t => {
    const d = new Date(t.dueDate);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === year &&
           (t.assignedTo.includes(currentUser?.id || '') || t.assignedBy === currentUser?.id);
  });

  const days = [];
  const totalDays = daysInMonth(currentDate.getMonth(), year);
  const startDay = firstDayOfMonth(currentDate.getMonth(), year);

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === year;
  };

  const getHoliday = (day: number) => {
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const monthDay = `${monthStr}-${dayStr}`;
    return HOLIDAYS.find(h => h.date === monthDay);
  };

  const getTasksForDay = (day: number) => {
    if (!currentUser) return [];
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => 
      t.dueDate === dateStr && 
      (t.assignedTo.includes(currentUser.id) || t.assignedBy === currentUser.id)
    );
  };

  const getRemindersForDay = (day: number) => {
    if (!currentUser) return [];
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reminders.filter(r => r.date === dateStr && r.userId === currentUser.id);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    addReminder(reminderTitle, reminderDate, reminderTime);
    setIsReminderModalOpen(false);
    setReminderTitle('');
  };

  return (
    <main className="app-container">
      <Sidebar />
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto', background: 'var(--background)' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Global Deployment Schedule</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Sector-wide synchronization and mission milestones.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button 
              onClick={() => setIsReminderModalOpen(true)}
              className="btn-primary" 
              style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
            >
              <Bell size={16} /> Set Reminder
            </button>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button onClick={prevMonth} className="btn-secondary" style={{ padding: '0.5rem', border: '1px solid var(--glass-border)' }}><ChevronLeft size={20} /></button>
              <h3 style={{ margin: 0, minWidth: '180px', textAlign: 'center', letterSpacing: '3px', color: 'var(--foreground)', fontWeight: '900', textTransform: 'uppercase' }}>{monthName} {year}</h3>
              <button onClick={nextMonth} className="btn-secondary" style={{ padding: '0.5rem', border: '1px solid var(--glass-border)' }}><ChevronRight size={20} /></button>
            </div>
          </div>
        </header>

        <div className="calendar-wrapper" style={{ 
          background: 'var(--background)', 
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--glass-shadow)',
          overflow: 'hidden'
        }}>
          {/* Calendar Grid Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            background: 'var(--surface-mid)',
            borderBottom: '1px solid var(--glass-border)'
          }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} style={{ 
                padding: '1.5rem 1rem', 
                textAlign: 'center', 
                fontSize: '0.7rem', 
                fontWeight: '900',
                color: 'var(--foreground)',
                letterSpacing: '2px'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            background: 'var(--glass-border)',
            gap: '1px'
          }}>
            {days.map((day, idx) => {
              const holiday = day ? getHoliday(day) : null;
              const dayTasks = day ? getTasksForDay(day) : [];
              const dayReminders = day ? getRemindersForDay(day) : [];
              const active = day && isToday(day);
              
              return (
                <div key={idx} style={{ 
                  background: day ? (holiday ? holiday.bg : 'var(--background)') : 'transparent', 
                  minHeight: '150px',
                  padding: '1rem',
                  position: 'relative',
                  transition: '0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  border: active ? '2px solid var(--neon-cyan)' : 'none',
                  zIndex: active ? 1 : 0
                }}>
                  {day && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '900', 
                          color: active ? 'var(--neon-cyan)' : 'var(--foreground)'
                        }}>
                          {day}
                        </span>
                        {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-cyan)', boxShadow: 'var(--glow-cyan)' }} />}
                      </div>
                      
                      {holiday && (
                        <div style={{ 
                          padding: '0.35rem 0.5rem', 
                          background: 'var(--glass-bg)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          border: '1px solid var(--glass-border)'
                        }}>
                          <Star size={10} style={{ color: holiday.color }} />
                          <span style={{ fontSize: '0.6rem', color: holiday.color, fontWeight: '900', textTransform: 'uppercase' }}>{holiday.name}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {dayTasks.map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => {
                              setSelectedTask(task);
                              setIsModalOpen(true);
                            }}
                            style={{ 
                              fontSize: '0.65rem', 
                              padding: '0.4rem 0.6rem', 
                              background: 'var(--glass-tint-cyan)',
                              borderLeft: '3px solid var(--neon-cyan)',
                              color: 'var(--neon-cyan)',
                              cursor: 'pointer',
                              borderRadius: '2px',
                              fontWeight: 'bold',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {task.title}
                          </div>
                        ))}

                        {dayReminders.map(rem => (
                          <div 
                            key={rem.id} 
                            style={{ 
                              fontSize: '0.65rem', 
                              padding: '0.4rem 0.6rem', 
                              background: 'var(--glass-tint-amber)',
                              borderLeft: '3px solid var(--neon-amber)',
                              color: 'var(--neon-amber)',
                              borderRadius: '2px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span>{rem.time} {rem.title}</span>
                            <Trash2 size={12} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => deleteReminder(rem.id)} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2.5rem', background: 'var(--surface-low)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '14px', height: '14px', background: 'var(--glass-tint-cyan)', borderLeft: '3px solid var(--neon-cyan)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: '600' }}>Assigned Mission</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '14px', height: '14px', background: 'var(--glass-tint-amber)', borderLeft: '3px solid var(--neon-amber)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: '600' }}>Personal Reminder</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '14px', height: '14px', background: 'var(--surface-mid)', border: '1px solid var(--glass-border)', borderRadius: '2px' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: '600' }}>Indian Holiday</span>
          </div>
        </div>
      </div>

      <EditTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
      />

      {/* REMINDER MODAL */}
      {isReminderModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: 'var(--surface-high)', border: '1px solid var(--glass-border)' }}>
            <h3 className="neon-text-amber" style={{ marginBottom: '1.5rem' }}>New Reminder</h3>
            <form onSubmit={handleAddReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--foreground)', display: 'block', marginBottom: '0.5rem' }}>Title</label>
                <input 
                  style={{ width: '100%', background: 'var(--surface-mid)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.75rem', outline: 'none', borderRadius: '4px' }} 
                  value={reminderTitle}
                  onChange={e => setReminderTitle(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--foreground)', display: 'block', marginBottom: '0.5rem' }}>Date</label>
                  <input 
                    type="date"
                    style={{ width: '100%', background: 'var(--surface-mid)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.75rem', outline: 'none', borderRadius: '4px' }} 
                    value={reminderDate}
                    onChange={e => setReminderDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--foreground)', display: 'block', marginBottom: '0.5rem' }}>Time</label>
                  <input 
                    type="time"
                    style={{ width: '100%', background: 'var(--surface-mid)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.75rem', outline: 'none', borderRadius: '4px' }} 
                    value={reminderTime}
                    onChange={e => setReminderTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsReminderModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Set Intel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
