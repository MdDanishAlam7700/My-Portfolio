'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import NewTaskModal from "@/components/NewTaskModal";
import { useStore } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Link as LinkIcon,
  MessageSquare,
  ArrowRight,
  Edit3
} from 'lucide-react';
import DonutChart from '@/components/PieChart';
import EditTaskModal from '@/components/EditTaskModal';
import { Task } from '@/lib/Store';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { currentUser, getTasksForUser, users, departments, updateTaskStatus, markTaskAsViewed } = useStore();
  const router = useRouter();
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null; // Avoid flashing the dashboard

  const tasks = getTasksForUser().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const activeCount = tasks.filter(t => t.status !== 'done').length;
  const progressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const reviewCount = tasks.filter(t => t.status === 'waiting_approvals').length;

  const getStatusChartData = (taskList: any[]) => [
    { label: 'Not Started', value: taskList.filter(t => t.status === 'not_started').length, color: 'var(--neon-yellow)' },
    { label: 'Started', value: taskList.filter(t => t.status === 'started').length, color: 'var(--neon-cyan)' },
    { label: 'In Progress', value: taskList.filter(t => t.status === 'in_progress').length, color: 'var(--neon-purple)' },
    { label: 'Review', value: taskList.filter(t => t.status === 'waiting_approvals').length, color: 'var(--neon-amber)' },
    { label: 'Done', value: taskList.filter(t => t.status === 'done').length, color: 'var(--neon-green)' },
  ];

  const deptTasks = selectedDeptId ? tasks.filter(t => t.departmentIds.includes(selectedDeptId)) : [];
  const filteredDeptTasks = statusFilter === 'all' ? deptTasks : deptTasks.filter(t => t.status === statusFilter);

  return (
    <main className="app-container">
      <Sidebar />
      
      <div className="main-content" style={{ padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Department Overview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back, {currentUser.fullName}. System status: <span style={{ color: 'var(--neon-green)' }}>OPTIMAL</span></p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Initialize New Task</button>
        </header>

        <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Stats Grid */}
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <StatCard icon={<Activity size={20} />} label="Active Tasks" value={activeCount.toString()} color="var(--neon-cyan)" />
              <StatCard icon={<Clock size={20} />} label="In Progress" value={progressCount.toString()} color="var(--neon-purple)" />
              <StatCard icon={<CheckCircle2 size={20} />} label="Completed" value={doneCount.toString()} color="var(--neon-green)" />
              <StatCard icon={<AlertCircle size={20} />} label="Approvals" value={reviewCount.toString()} color="var(--neon-amber)" />
            </div>

            {/* BOSS/ADMIN OVERVIEW */}
            {(currentUser.role === 'boss' || currentUser.role === 'admin') && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', opacity: 0.8 }}>Sector Intelligence Matrix</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <select 
                      value={selectedDeptId} 
                      onChange={e => { setSelectedDeptId(e.target.value); setStatusFilter('all'); }}
                      style={{ background: 'var(--surface-mid)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.4rem 1rem', borderRadius: '4px' }}
                    >
                      <option value="">Select Department...</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    {selectedDeptId && (
                      <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ background: 'var(--surface-mid)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', padding: '0.4rem 1rem', borderRadius: '4px' }}
                      >
                        <option value="all">All Statuses</option>
                        <option value="not_started">Not Started</option>
                        <option value="started">Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_approvals">Waiting Review</option>
                        <option value="done">Done</option>
                      </select>
                    )}
                  </div>
                </div>
                
                {selectedDeptId ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <DonutChart data={getStatusChartData(deptTasks)} size={120} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
                        {getStatusChartData(deptTasks).map(item => (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                            <span style={{ opacity: 0.6 }}>{item.label}:</span>
                            <span>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Department Task List */}
                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>Sector Deployment Stream</h4>
                      {filteredDeptTasks.length === 0 ? (
                        <p style={{ textAlign: 'center', opacity: 0.3, fontSize: '0.9rem', padding: '1rem' }}>No tasks found for this configuration.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {filteredDeptTasks.map(t => (
                            <div 
                              key={t.id} 
                              onClick={() => setEditingTask(t)}
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                background: 'var(--surface-low)', 
                                padding: '0.75rem', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                borderLeft: `2px solid ${getStatusChartData([]).find(c => c.label.toLowerCase().replace(' ', '_') === t.status || (t.status === 'waiting_approvals' && c.label === 'Review'))?.color || 'var(--neon-cyan)'}`
                              }}
                            >
                              <span style={{ fontSize: '0.85rem', color: 'var(--foreground)' }}>{t.title}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.assignedTo.map(id => users.find(u => u.id === id)?.fullName).filter(Boolean).join(', ') || 'Unassigned'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {departments.map(d => {
                      const dTasks = tasks.filter(t => t.departmentIds.includes(d.id));
                      const pending = dTasks.filter(t => t.status !== 'done').length;
                      return (
                        <div key={d.id} className="glass-card" style={{ padding: '1rem', textAlign: 'center', background: 'var(--surface-low)' }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>{d.name}</p>
                          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: pending > 0 ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>{pending} <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>Active</span></p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* USER PIE CHART */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', opacity: 0.8, textAlign: 'center' }}>
              {(currentUser.role === 'boss' || currentUser.role === 'admin') ? 'Global Deployment Matrix' : 'Personal Deployment Matrix'}
            </h3>
            <DonutChart data={getStatusChartData(tasks)} size={180} />
            <div style={{ marginTop: '1.5rem', width: '100%' }}>
              {getStatusChartData(tasks).map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', padding: '0.25rem 0.5rem', borderLeft: `2px solid ${item.color}` }}>
                  <span style={{ opacity: 0.7 }}>{item.label}</span>
                  <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task List Section */}
        <section>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', opacity: 0.8 }}>Current Sector Deployments</h3>
          {tasks.length === 0 ? (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
              <p>No active tasks in your sector.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {departments.map(dept => {
                const deptTasks = tasks.filter(t => t.departmentIds.includes(dept.id));
                if (deptTasks.length === 0) return null;

                return (
                  <div key={dept.id}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      marginBottom: '1.25rem',
                      padding: '0.5rem 1rem',
                      background: 'var(--glass-tint-cyan)',
                      borderLeft: '4px solid var(--neon-cyan)',
                      borderRadius: '0 4px 4px 0'
                    }}>
                      <h4 className="futuristic-text" style={{ fontSize: '0.85rem', margin: 0, color: 'var(--neon-cyan)' }}>
                        {dept.name} Operations
                      </h4>
                      <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)', opacity: 0.3 }} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {deptTasks.map(task => {
                        const assignerUser = users.find(u => u.id === task.assignedBy);
                        
                        return (
                          <TaskItem 
                            key={task.id}
                            id={task.id}
                            title={task.title} 
                            dept={task.departmentIds.map(id => departments.find(d => d.id === id)?.name).join(', ')} 
                            status={task.status} 
                            dueDate={task.dueDate}
                            assignee={task.assignedTo.map(id => users.find(u => u.id === id)?.fullName).filter(Boolean).join(', ') || 'Unassigned'}
                            assignedBy={assignerUser?.fullName || 'Unknown'}
                            mentions={[]}
                            isNew={!task.viewedBy.includes(currentUser.id)}
                            onStatusChange={updateTaskStatus}
                            onEdit={() => {
                              setEditingTask(task);
                              markTaskAsViewed(task.id);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {tasks.filter(t => t.departmentIds.length === 0).map(task => {
                const assignerUser = users.find(u => u.id === task.assignedBy);
                
                return (
                  <TaskItem 
                    key={task.id}
                    id={task.id}
                    title={task.title} 
                    dept="Global" 
                    status={task.status} 
                    dueDate={task.dueDate}
                    assignee={task.assignedTo.map(id => users.find(u => u.id === id)?.fullName).filter(Boolean).join(', ') || 'Unassigned'}
                    assignedBy={assignerUser?.fullName || 'Unknown'}
                    isNew={!task.viewedBy.includes(currentUser.id)}
                    onStatusChange={updateTaskStatus}
                    onEdit={() => {
                      setEditingTask(task);
                      markTaskAsViewed(task.id);
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>

        <EditTaskModal 
          isOpen={!!editingTask} 
          onClose={() => setEditingTask(null)} 
          task={editingTask} 
        />
      </div>
    </main>
  );
}

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ 
      color: color, 
      background: `${color}10`, 
      padding: '0.75rem', 
      borderRadius: '8px',
      border: `1px solid ${color}30`
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--foreground)' }}>{value}</p>
    </div>
  </div>
);

const TaskItem = ({ id, title, dept, status, dueDate, assignee, assignedBy, isNew, critical = false, onStatusChange, onEdit }: any) => {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'done': return 'var(--neon-green)';
      case 'waiting_approvals': return 'var(--neon-amber)';
      case 'in_progress': return 'var(--neon-purple)';
      case 'started': return 'var(--neon-cyan)';
      default: return 'var(--status-pending)';
    }
  };

  return (
    <div className={`glass-card ${critical ? 'neon-glow-amber' : 'neon-glow-cyan'}`} style={{ 
      padding: '1.25rem',
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <div style={{ cursor: 'pointer' }} onClick={onEdit}>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {title}
          {isNew && <span style={{ background: 'var(--neon-cyan)', color: 'black', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold', boxShadow: 'var(--glow-cyan)' }}>NEW</span>}
          <Edit3 size={14} style={{ opacity: 0.3 }} />
        </h4>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{dept}</span>
        </div>
      </div>
      
      <div style={{ textAlign: 'left' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Assignees</p>
        <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--neon-amber)' }}>{assignee}</p>
      </div>

      <div style={{ textAlign: 'left' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Assigned By</p>
        <p style={{ fontSize: '0.85rem', margin: 0 }}>{assignedBy}</p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Due Date</p>
        <p style={{ fontSize: '0.85rem', margin: 0 }}>{dueDate}</p>
      </div>

      <div style={{ position: 'relative' }}>
        <select 
          value={status} 
          onChange={(e) => onStatusChange(id, e.target.value)}
          style={{ 
            padding: '0.4rem 1rem', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: 'bold',
            background: `${getStatusColor(status)}15`,
            border: `1px solid ${getStatusColor(status)}`,
            color: getStatusColor(status),
            minWidth: '150px',
            textAlign: 'center',
            textTransform: 'capitalize',
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none'
          }}
        >
          <option value="not_started">Not Started</option>
          <option value="started">Started</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_approvals">Waiting Approvals</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};
