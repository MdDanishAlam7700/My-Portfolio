import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, MoreHorizontal, Calendar, Trash2 } from 'lucide-react';
import { useTaskStore, type Task } from '../store/useTaskStore';
import clsx from 'clsx';
import { format } from 'date-fns';

export const TaskList: React.FC<{ onEdit: (task: Task) => void }> = ({ onEdit }) => {
  const { tasks, updateTask, deleteTask, searchQuery, filterTag } = useTaskStore();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = filterTag ? (task.priority === filterTag.toLowerCase()) : true;

    return matchesSearch && matchesTag;
  });

  const toggleStatus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    updateTask(task._id, { status: newStatus });
  };

  const handleDelete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task._id);
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => b.order - a.order);

  return (
    <div className="space-y-3 pb-10">
      <AnimatePresence>
        {sortedTasks.map((task) => (
          <motion.div
            key={task._id}
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
            onClick={() => onEdit(task)}
            className="group glass-card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
          >
            <button 
              onClick={(e) => toggleStatus(task, e)}
              className="mt-0.5 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
            >
              {task.status === 'done' ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <span className={clsx(
              "flex-1 font-bold text-gray-900 dark:text-gray-100",
              task.status === 'done' && 'line-through opacity-50'
            )}>
              {task.title}
            </span>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className={clsx(
                  "px-2 py-0.5 rounded-full text-xs font-medium uppercase",
                  task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                  task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-blue-500/10 text-blue-500'
                )}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </span>
                )}
                {task.description && (
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-1">{task.description}</p>
            )}
                {task.subtasks && task.subtasks.length > 0 && (
                  <span className="text-xs bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => handleDelete(task, e)}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-gray-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {sortedTasks.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-lg">No tasks yet. Create one to get started!</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
