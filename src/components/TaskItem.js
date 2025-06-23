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
      >
        {isCompleted && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </button>
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
