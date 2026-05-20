'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---
export type Role = 'boss' | 'admin' | 'dept_admin' | 'staff';
export type TaskStatus = 'not_started' | 'started' | 'in_progress' | 'waiting_approvals' | 'done';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  departmentIds: string[];
}

export interface Department {
  id: string;
  name: string;
}

export interface TaskNote {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  completed: boolean;
  timestamp: string;
}

export interface TaskHistory {
  id: string;
  editorId: string;
  changes: string;
  timestamp: string;
}

export interface PersonalNote {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  lastEdited?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  links: { label: string; url: string }[];
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  departmentIds: string[];
  assignedTo: string[]; // User IDs
  assignedBy: string; // User ID
  needsApproval: boolean;
  priority: 'normal' | 'urgent';
  createdAt: string;
  notes: TaskNote[];
  history: TaskHistory[];
  viewedBy: string[]; // User IDs who have opened the task
}

export interface Notification {
  id: string;
  userIds?: string[]; // If present, only these users see it. Otherwise everyone.
  message: string;
  type: 'task' | 'comment' | 'approval' | 'system' | 'reminder';
  link?: string;
  timestamp: string;
  readBy: string[];
}

// --- Initial Mock Data ---
const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Human Resources' },
  { id: 'd2', name: 'Cyber Security' },
  { id: 'd3', name: 'Engineering' },
];

const MOCK_USERS: User[] = [
  { id: 'u0', email: 'boss@neural.com', fullName: 'The Architect', role: 'boss', departmentIds: [] },
  { id: 'u1', email: 'admin@neural.com', fullName: 'System Admin', role: 'admin', departmentIds: [] },
  { id: 'u2', email: 'hr_lead@neural.com', fullName: 'Sarah Connor', role: 'dept_admin', departmentIds: ['d1'] },
  { id: 'u3', email: 'recruiter1@neural.com', fullName: 'John Reese', role: 'staff', departmentIds: ['d1'] },
  { id: 'u3_b', email: 'recruiter2@neural.com', fullName: 'Kyle Reese', role: 'staff', departmentIds: ['d1'] },
  { id: 'u4', email: 'security_lead@neural.com', fullName: 'Neo Anderson', role: 'dept_admin', departmentIds: ['d2'] },
  { id: 'u5', email: 'engineer@neural.com', fullName: 'Trinity', role: 'staff', departmentIds: ['d3'] },
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Recruitment Drive - Q3',
    description: 'Hire 5 new operatives.',
    links: [],
    status: 'in_progress',
    startDate: '2024-05-01',
    dueDate: '2024-05-15',
    departmentIds: ['d1'],
    assignedTo: ['u3'],
    assignedBy: 'u2',
    needsApproval: true,
    priority: 'normal',
    createdAt: new Date().toISOString(),
    notes: [],
    history: [],
    viewedBy: []
  },
  {
    id: 't2',
    title: 'System Firewall Audit',
    description: 'Check port 8080 vulnerabilities.',
    links: [{ label: 'Logs', url: 'http://logs.internal' }],
    status: 'waiting_approvals',
    startDate: '2024-05-05',
    dueDate: '2024-05-10',
    departmentIds: ['d2'],
    assignedTo: ['u4'],
    assignedBy: 'u1',
    needsApproval: true,
    priority: 'urgent',
    createdAt: new Date().toISOString(),
    notes: [],
    history: [],
    viewedBy: []
  }
];

// --- Context ---
interface StoreContextType {
  currentUser: User | null;
  users: User[];
  departments: Department[];
  tasks: Task[];
  notifications: Notification[];
  reminders: Reminder[];
  login: (email: string) => boolean;
  logout: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'notes' | 'history' | 'viewedBy'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  getTasksForUser: () => Task[];
  addDepartment: (name: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addNoteToTask: (taskId: string, noteContent: string) => void;
  personalNotes: PersonalNote[];
  addPersonalNote: (content: string) => void;
  updatePersonalNote: (id: string, content: string) => void;
  deletePersonalNote: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addReminder: (title: string, date: string, time: string) => void;
  deleteReminder: (id: string) => void;
  markTaskAsViewed: (taskId: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedUsers = localStorage.getItem('users');
    const savedPersonalNotes = localStorage.getItem('personal_notes');
    const savedNotifications = localStorage.getItem('notifications');
    const savedReminders = localStorage.getItem('reminders');
    const savedDepts = localStorage.getItem('depts');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedPersonalNotes) setPersonalNotes(JSON.parse(savedPersonalNotes));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedDepts) setDepartments(JSON.parse(savedDepts));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('depts', JSON.stringify(departments));
    localStorage.setItem('personal_notes', JSON.stringify(personalNotes));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [tasks, users, departments, personalNotes, notifications, reminders]);

  const triggerBrowserNotification = (message: string) => {
    if (typeof window === 'undefined' || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification("Neural Track", { body: message, icon: '/favicon.ico' });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Neural Track", { body: message, icon: '/favicon.ico' });
        }
      });
    }
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'readBy'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      readBy: []
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    
    // Only trigger browser notification if it's for the current user or everyone
    if (!notif.userIds || notif.userIds.includes(currentUser?.id || '')) {
      triggerBrowserNotification(notif.message);
    }
  };

  const markNotificationAsRead = (id: string) => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, readBy: [...new Set([...n.readBy, currentUser.id])] } : n));
  };

  const clearNotifications = () => setNotifications([]);

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'notes' | 'history' | 'viewedBy'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      notes: [],
      history: [],
      viewedBy: []
    };
    setTasks(prev => [newTask, ...prev]);

    addNotification({
      message: `New deployment initiated: ${newTask.title}`,
      type: 'task',
      userIds: newTask.assignedTo.length > 0 ? [...newTask.assignedTo, newTask.assignedBy] : undefined
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    if (!currentUser) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isOwner = (task.assignedTo || []).includes(currentUser.id);
    const isDeptAdmin = currentUser.role === 'dept_admin' && (task.departmentIds || []).some(id => currentUser.departmentIds.includes(id));
    const isSuper = currentUser.role === 'admin' || currentUser.role === 'boss';

    if (!isOwner && !isDeptAdmin && !isSuper) return;

    const newHistory: TaskHistory = {
      id: `h${Date.now()}`,
      editorId: currentUser.id,
      changes: `Status changed from ${task.status.replace('_', ' ')} to ${status.replace('_', ' ')}`,
      timestamp: new Date().toISOString()
    };

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, history: [newHistory, ...t.history], viewedBy: [currentUser.id] } : t));

    addNotification({
      message: `Task "${task.title}" updated to ${status.replace('_', ' ')} by ${currentUser.fullName}`,
      type: status === 'waiting_approvals' ? 'approval' : 'task',
      userIds: Array.from(new Set([...task.assignedTo, task.assignedBy]))
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!currentUser) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isCreator = task.assignedBy === currentUser.id;
    const isDeptAdmin = currentUser.role === 'dept_admin' && (task.departmentIds || []).some(id => currentUser.departmentIds.includes(id));
    const isSuper = currentUser.role === 'admin' || currentUser.role === 'boss';

    if (!isCreator && !isDeptAdmin && !isSuper) return;

    const changeLogs: string[] = [];
    if (updates.title && updates.title !== task.title) changeLogs.push(`Title changed`);
    if (updates.description && updates.description !== task.description) changeLogs.push(`Description updated`);
    if (updates.dueDate && updates.dueDate !== task.dueDate) changeLogs.push(`Due date shifted to ${updates.dueDate}`);
    
    if (changeLogs.length === 0 && !updates.status) return;

    const newHistory: TaskHistory = {
      id: `h${Date.now()}`,
      editorId: currentUser.id,
      changes: changeLogs.join(', ') || 'Task modified',
      timestamp: new Date().toISOString()
    };

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates, history: [newHistory, ...t.history], viewedBy: [currentUser.id] } : t));

    addNotification({
      message: `Deployment parameters modified for "${task.title}"`,
      type: 'task',
      userIds: Array.from(new Set([...task.assignedTo, task.assignedBy]))
    });
  };

  const addNoteToTask = (taskId: string, content: string) => {
    if (!currentUser) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newNote: TaskNote = {
      id: `n${Date.now()}`,
      authorId: currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, notes: [...t.notes, newNote] } : t));

    addNotification({
      message: `New directive from ${currentUser.fullName} on "${task.title}"`,
      type: 'comment',
      userIds: Array.from(new Set([...task.assignedTo, task.assignedBy]))
    });
  };

  const addPersonalNote = (content: string) => {
    if (!currentUser) return;
    const newNote: PersonalNote = {
      id: `pn${Date.now()}`,
      userId: currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };
    setPersonalNotes(prev => [newNote, ...prev]);
  };

  const updatePersonalNote = (id: string, content: string) => {
    setPersonalNotes(prev => prev.map(n => n.id === id ? { ...n, content, lastEdited: new Date().toISOString() } : n));
  };

  const deletePersonalNote = (id: string) => {
    setPersonalNotes(prev => prev.filter(n => n.id !== id));
  };

  const addDepartment = (name: string) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'boss') return;
    setDepartments(prev => [...prev, { id: `d${Date.now()}`, name }]);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'boss') return;
    const newUser: User = { ...userData, id: `u${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'boss') return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'boss') return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const getTasksForUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'boss' || currentUser.role === 'admin') return tasks;
    const assignedByMe = tasks.filter(t => t.assignedBy === currentUser.id);
    if (currentUser.role === 'dept_admin') {
      const deptTasks = tasks.filter(t => (t.departmentIds || []).some(id => currentUser.departmentIds.includes(id)));
      return Array.from(new Set([...assignedByMe, ...deptTasks]));
    }
    const staffTasks = tasks.filter(t => (t.departmentIds || []).some(id => currentUser.departmentIds.includes(id)) || (t.assignedTo || []).includes(currentUser.id));
    return Array.from(new Set([...assignedByMe, ...staffTasks]));
  };

  const addReminder = (title: string, date: string, time: string) => {
    if (!currentUser) return;
    const newReminder: Reminder = {
      id: `r${Date.now()}`,
      userId: currentUser.id,
      title,
      date,
      time,
      completed: false,
      timestamp: new Date().toISOString()
    };
    setReminders(prev => [...prev, newReminder]);
    addNotification({
      type: 'reminder',
      message: `New reminder set: ${title} on ${date} at ${time}`,
      userIds: [currentUser.id]
    });
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      users,
      departments,
      tasks,
      notifications,
      reminders,
      login,
      logout,
      addTask,
      updateTaskStatus,
      updateTask,
      getTasksForUser,
      addDepartment,
      addUser,
      updateUser,
      deleteUser,
      addNoteToTask,
      personalNotes: personalNotes.filter(n => n.userId === currentUser?.id),
      addPersonalNote,
      updatePersonalNote,
      deletePersonalNote,
      markNotificationAsRead,
      clearNotifications,
      addReminder,
      deleteReminder,
      markTaskAsViewed: (taskId: string) => {
        if (!currentUser) return;
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, viewedBy: Array.from(new Set([...t.viewedBy, currentUser.id])) } : t));
      }
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
