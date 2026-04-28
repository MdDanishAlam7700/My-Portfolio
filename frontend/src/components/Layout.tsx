import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useTaskStore } from '../store/useTaskStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { fetchTasks, isDarkMode } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen relative overflow-hidden transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="max-w-6xl mx-auto w-full h-full relative">
          {children}
        </div>
      </main>
    </div>
  );
};
