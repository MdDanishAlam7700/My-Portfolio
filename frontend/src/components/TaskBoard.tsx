import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { MoreHorizontal, Calendar, CheckCircle2 } from 'lucide-react';
import { useTaskStore, type Task } from '../store/useTaskStore';
import clsx from 'clsx';
import { format } from 'date-fns';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
];

export const TaskBoard: React.FC<{ onEdit: (task: Task) => void }> = ({ onEdit }) => {
  const { tasks, reorderTasks, updateTask, searchQuery, filterTag } = useTaskStore();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = filterTag ? (task.priority === filterTag.toLowerCase()) : true;
    return matchesSearch && matchesTag;
  });

  const columnTasks = {
    'todo': filteredTasks.filter(t => t.status === 'todo').sort((a,b) => a.order - b.order),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress').sort((a,b) => a.order - b.order),
    'done': filteredTasks.filter(t => t.status === 'done').sort((a,b) => a.order - b.order),
  } as Record<string, Task[]>;

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Filter tasks by status and sort them according to their current order to mimic what's in the columns
    const destColTasks = tasks.filter(t => t.status === destination.droppableId).sort((a, b) => a.order - b.order);
    
    let newOrder = 0;

    if (destColTasks.length === 0) {
      newOrder = 1000; // First item in empty column
    } else if (destination.index === 0) {
      newOrder = destColTasks[0].order - 1000; // Put at the top
    } else if (destination.index >= destColTasks.length) {
      newOrder = destColTasks[destColTasks.length - 1].order + 1000; // Put at the bottom
    } else {
      newOrder = (destColTasks[destination.index - 1].order + destColTasks[destination.index].order) / 2;
    }

    const updates = [{ id: draggableId, order: newOrder, status: destination.droppableId }];
    
    // Optimistic cache update is handled by the reorder wrapper, or we can just instantly call updateTask
    const task = tasks.find(t => t._id === draggableId);
    if (task) {
      updateTask(task._id, { status: destination.droppableId, order: newOrder });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-6 h-full pb-10">
        {columns.map((col) => (
          <div key={col.id} className="flex-1 flex flex-col min-w-[320px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                <h3 className="font-semibold">{col.title}</h3>
                <span className="text-xs bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-full">
                  {columnTasks[col.id]?.length || 0}
                </span>
              </div>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={clsx(
                    'flex-1 p-3 rounded-2xl transition-colors',
                    snapshot.isDraggingOver ? 'bg-black/5 dark:bg-white/5' : ''
                  )}
                >
                  {(columnTasks[col.id] || [])
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={clsx(
                              'mb-3',
                              snapshot.isDragging && 'opacity-80 scale-105'
                            )}
                          >
                            <TaskCard task={task} onClick={() => onEdit(task)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

const TaskCard: React.FC<{ task: Task; onClick: () => void }> = ({ task, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="glass-card p-4 cursor-pointer hover:shadow-black/10 dark:hover:shadow-white/5 transition-all duration-150 group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className={clsx(
          "text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider",
          task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
          task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
          'bg-blue-500/10 text-blue-500'
        )}>
          {task.priority}
        </div>
        <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <h4 className={clsx("font-semibold mb-1 text-gray-900 dark:text-gray-100", task.status === 'done' && 'line-through opacity-60')}>
        {task.title}
      </h4>
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center space-x-1 font-medium bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
            <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
        {task.status === 'done' && (
          <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
        )}
      </div>
    </div>
  );
};
