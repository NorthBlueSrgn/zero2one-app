// src/components/PathCard.js
import React from 'react';
import { Star, Flame } from 'lucide-react';
import { ProgressBar } from './ui';

export const PathCard = ({ path, onTogglePrerequisite }) => {
  const getCompletionPercentage = () => {
    return path.prerequisites.reduce((acc, prereq, index) => {
      if (prereq.frequency === 'weekly') {
        const progress = (path.weeklyProgress[index] || 0) / prereq.timesPerWeek;
        return acc + (progress * (100 / path.prerequisites.length));
      } else {
        return acc + (path.completedToday.includes(index) ? (100 / path.prerequisites.length) : 0);
      }
    }, 0);
  };

  return (
    <div className={`bg-gradient-to-br ${path.color} p-6 rounded-lg border border-purple-800/30`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{path.icon}</span>
          <div>
            <h3 className="font-bold text-white">{path.name}</h3>
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

      <div className="space-y-2 mb-4">
        {path.prerequisites.map((prereq, index) => {
          const isCompleted = prereq.frequency === 'weekly'
            ? (path.weeklyProgress[index] || 0) >= prereq.timesPerWeek
            : path.completedToday.includes(index);

          const progress = prereq.frequency === 'weekly'
            ? `${path.weeklyProgress[index] || 0}/${prereq.timesPerWeek}`
            : null;

          return (
            <div
              key={index}
              onClick={() => onTogglePrerequisite(path.id, index)}
              className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-all ${
                isCompleted
                  ? 'bg-green-600/30 border-green-500/50'
                  : 'bg-black/20 border-gray-600/50 hover:bg-black/30'
              } border`}
            >
              <div className={`w-4 h-4 rounded border-2 ${
                isCompleted
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-500'
              }`}>
                {isCompleted && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${isCompleted ? 'line-through opacity-75' : ''}`}>
                  {prereq.name}
                </span>
                {progress && (
                  <span className="text-xs ml-2 opacity-75">
                    ({progress})
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs opacity-75">
                <Star className="w-3 h-3" />
                <span>{prereq.xpReward} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Daily Progress</span>
          <span>{Math.round(getCompletionPercentage())}%</span>
        </div>
        <ProgressBar value={getCompletionPercentage()} max={100} color="blue" />
      </div>
    </div>
  );
};
