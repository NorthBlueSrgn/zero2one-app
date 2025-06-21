// src/components/TaskItem.js
import React from 'react';

export const TaskItem = ({ task, type, onComplete }) => {
  const isCompleted = type === 'daily' 
    ? task.completed 
    : (task.completedCount >= (task.frequency || 1));

  return (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
        isCompleted 
          ? 'bg-green-600/30' 
          : 'bg-gray-800/50 hover:bg-gray-700/50'
      }`}
    >
      <button 
        onClick={onComplete}
        className={`w-5 h-5 rounded-full border-2 transition-all ${
          isCompleted 
            ? 'bg-green-500 border-green-500' 
            : 'border-gray-500'
        }`}
      />
      <div className="flex-1">
        <div className="font-medium">{task.name}</div>
        {type === 'weekly' && (
          <div className="text-sm text-gray-400">
            {task.completedCount || 0}/{task.frequency || 1} times this week
          </div>
        )}
      </div>
      <div className="text-sm text-purple-400">+{task.xpReward} XP</div>
    </div>
  );
};

// src/components/PathCard.js
import React from 'react';
import { Trash, Flame } from 'lucide-react';
import { TaskItem } from './TaskItem';

export const PathCard = ({ path, onRemove, onCompleteTask }) => {
  return (
    <div className={`bg-gradient-to-br ${path.color} p-6 rounded-lg border border-purple-800/30`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{path.icon}</span>
          <div>
            <h3 className="font-bold">{path.name}</h3>
            <p className="text-sm opacity-75">
              Level {path.level} • {path.currentTitle}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onRemove(path.id)}
          className="p-2 hover:bg-black/20 rounded-full transition-all"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Daily Tasks</h4>
          <div className="space-y-2">
            {path.dailyTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                type="daily"
                onComplete={() => onCompleteTask(path.id, task.id, 'daily')}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Weekly Goals</h4>
          <div className="space-y-2">
            {path.weeklyTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                type="weekly"
                onComplete={() => onCompleteTask(path.id, task.id, 'weekly')}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm mb-1">
            <span>Path Progress</span>
            <span>{Math.round((path.experience / (path.level * 100)) * 100)}%</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div 
              className="bg-white/30 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(path.experience / (path.level * 100)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
