import { create } from 'zustand';
import axios from 'axios';

// The Backend API base URL
const API_URL = 'http://localhost:5000/api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags: any[];
  dueDate?: string;
  order: number;
  subtasks?: { title: string; completed: boolean }[];
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterTag: string | null;
  setFilterTag: (tag: string | null) => void;
  // UI State
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  view: 'list' | 'kanban' | 'calendar';
  setView: (view: 'list' | 'kanban' | 'calendar') => void;
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (updates: { id: string; order: number; status: string }[]) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filterTag: null,
  setFilterTag: (tag) => set({ filterTag: tag }),
  isDarkMode: false,
  toggleDarkMode: () =>
    set((state) => {
      const newDark = !state.isDarkMode;
      if (newDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: newDark };
    }),

  view: 'list',

  setView: (view) => set({ view }),

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get(`${API_URL}/tasks`);
      set({ tasks: data, isLoading: false, error: null });
    } catch (err) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (task) => {
    try {
      const { data } = await axios.post(`${API_URL}/tasks`, task);
      set((state) => ({ tasks: [...state.tasks, data] }));
    } catch (err) {
      console.error(err);
    }
  },

  updateTask: async (id, updates) => {
    // Optimistic UI update
    const previousTasks = get().tasks;
    set({ tasks: previousTasks.map(t => t._id === id ? { ...t, ...updates } : t) });
    
    try {
      const { data } = await axios.put(`${API_URL}/tasks/${id}`, updates);
      // Sync with server data (in case there's server side logic applied)
      set((state) => ({ tasks: state.tasks.map(t => t._id === id ? data : t) }));
    } catch (err) {
      set({ tasks: previousTasks }); // revert
      console.error(err);
    }
  },

  deleteTask: async (id) => {
    const previousTasks = get().tasks;
    set({ tasks: previousTasks.filter(t => t._id !== id) });
    
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (err) {
      set({ tasks: previousTasks }); // revert
      console.error(err);
    }
  },

  reorderTasks: async (updates) => {
    // We already apply optimistic changes in the component for smoother dnd
    try {
      await axios.put(`${API_URL}/tasks/reorder`, { updates });
      // Fetch to sync in case needed, or just let local state be
    } catch (err) {
      console.error(err);
      get().fetchTasks(); // on error re-sync with db
    }
  }
}));
