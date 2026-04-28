import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar, Sun, Moon } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { PomodoroTimer } from './PomodoroTimer';

export const Sidebar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, view, setView } = useTaskStore();

  return (
    <aside className="w-64 h-screen border-r border-[#e5e5e5] dark:border-white/10 bg-white/50 dark:bg-[#141414]/50 backdrop-blur-xl flex flex-col p-6 sticky top-0">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Antigravity Todo</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <button 
          onClick={() => setView('list')}
          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${view === 'list' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="font-medium">My Tasks</span>
        </button>
        
        <button 
          onClick={() => setView('kanban')}
          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${view === 'kanban' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Kanban Board</span>
        </button>

        <button 
          onClick={() => setView('calendar')}
          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${view === 'calendar' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Calendar</span>
        </button>
      </nav>

      <div className="mt-auto space-y-4">
        <PomodoroTimer />
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
        >
          <span className="font-medium">Theme</span>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
