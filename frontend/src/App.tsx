import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from './components/Layout';
import { TaskBoard } from './components/TaskBoard';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { TaskModal } from './components/TaskModal';
import { useTaskStore, type Task } from './store/useTaskStore';

function App() {
  const { view, isLoading, error, searchQuery, setSearchQuery, filterTag, setFilterTag, addTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 mt-4 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 drop-shadow-sm">
            {view === 'list' ? 'My Tasks' : view === 'kanban' ? 'Kanban Board' : 'Calendar'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Manage your daily goals and stay productive.
          </p>
        </div>

        <div className="flex flex-1 w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:max-w-xs ml-auto">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass bg-white/50 dark:bg-black/20 text-gray-800 dark:text-gray-200 text-sm rounded-xl pl-4 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
          <button 
            onClick={handleCreateTask}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar & Smart Tags */}
      <div className="mb-8">
         <form onSubmit={(e) => {
            e.preventDefault();
            const val = (e.target as any).elements.quickAdd.value.trim();
            if(!val) return;
            addTask({ title: val });
            (e.target as any).reset();
         }} className="relative flex items-center mb-4">
            <Plus className="absolute left-4 w-5 h-5 text-gray-400" />
            <input name="quickAdd" type="text" placeholder="Quick add a task... press enter to save" className="w-full glass-card bg-white/40 dark:bg-black/40 text-gray-900 dark:text-white px-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 font-medium transition-all" />
         </form>

         {/* Smart Tags */}
         <div className="flex flex-wrap gap-2">
            {['low', 'medium', 'high'].map(tag => (
               <button 
                 key={tag} 
                 onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                 className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors capitalize ${filterTag === tag ? 'bg-blue-600 text-white' : 'glass hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}`}
               >
                 {tag} Priority
               </button>
            ))}
         </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-xl font-medium">
          {error}
        </div>
      ) : (
        <div className="animate-fade-in">
          {view === 'list' && <TaskList onEdit={handleEditTask} />}
          {view === 'kanban' && <TaskBoard onEdit={handleEditTask} />}
          {view === 'calendar' && <CalendarView onEdit={handleEditTask} />}
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={taskToEdit}
      />
    </Layout>
  );
}

export default App;
