import { useState } from 'react';
import { Flame, Trash2 } from 'lucide-react';

const PathCard = ({ path, onDelete, onTogglePrerequisite }) => {
  const getCompletionPercentage = () => {
    return (path.completedToday.length / path.prerequisites.length) * 100;
  };

  return (
    <div className={`bg-gradient-to-br ${path.color} p-6 rounded-lg border border-purple-800/30 relative group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{path.icon}</span>
          <div>
            <h3 className="font-bold">{path.name}</h3>
            <p className="text-sm opacity-75">{path.currentTitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-75">Level {path.level}</div>
          <div className="flex items-center space-x-1">
            <Flame className="w-3 h-3" />
            <span className="text-xs">{path.streak}</span>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-2 mb-4">
        {path.prerequisites.map((prereq, index) => (
          <div
            key={index}
            onClick={() => onTogglePrerequisite(path.id, index)}
            className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-all ${
              path.completedToday.includes(index)
                ? 'bg-green-600/30 border-green-500/50'
                : 'bg-black/20 border-gray-600/50 hover:bg-black/30'
            } border`}
          >
            <div className={`w-4 h-4 rounded border-2 ${
              path.completedToday.includes(index)
                ? 'bg-green-500 border-green-500'
                : 'border-gray-500'
            }`}>
              {path.completedToday.includes(index) && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <span className={`text-sm ${
              path.completedToday.includes(index) ? 'line-through opacity-75' : ''
            }`}>
              {prereq}
            </span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Daily Progress</span>
          <span>{Math.round(getCompletionPercentage())}%</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(path.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-full"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
};

export default PathCard;
