import React, { useState } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTaskStore, type Task } from '../store/useTaskStore';
import clsx from 'clsx';

export const CalendarView: React.FC<{ onEdit: (task: Task) => void }> = ({ onEdit }) => {
  const { tasks, searchQuery, filterTag } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const dateFormat = "MMMM yyyy";

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      
      // Get tasks for this day
      const dayTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTag = filterTag ? (task.priority === filterTag.toLowerCase()) : true;
        return matchesSearch && matchesTag && task.dueDate && isSameDay(parseISO(task.dueDate), cloneDay);
      });

      days.push(
        <div
          key={day.toISOString()}
          className={clsx(
            "min-h-[120px] p-2 border-r border-b border-black/5 dark:border-white/5 transition-colors",
            !isSameMonth(day, monthStart) ? "text-gray-400 bg-black/5 dark:bg-white/5" : "text-gray-700 dark:text-gray-300",
            isSameDay(day, new Date()) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
          )}
        >
          <div className="flex justify-between items-center px-1">
            <span className={clsx(
              "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
              isSameDay(day, new Date()) ? "bg-blue-600 text-white shadow-lg" : ""
            )}>
              {formattedDate}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {dayTasks.map(task => (
              <div 
                key={task._id} 
                onClick={() => onEdit(task)}
                className={clsx(
                  "text-xs px-2 py-1 rounded truncate cursor-pointer font-medium shadow-sm transition-transform hover:scale-[1.02]",
                  task.status === 'done' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  task.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                  task.priority === 'medium' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                )}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
    <div key={d} className="uppercase text-xs font-bold text-gray-500 py-3 text-center border-b border-black/5 dark:border-white/5">
      {d}
    </div>
  ));

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-black/5 dark:border-white/5">
        <h2 className="text-2xl font-bold tracking-tight">{format(currentDate, dateFormat)}</h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 bg-black/5 dark:bg-white/5">
        {daysOfWeek}
      </div>
      <div className="flex flex-col">
        {rows}
      </div>
    </div>
  );
};
