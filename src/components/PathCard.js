// src/components/PathCard.js
import React from 'react';
import { Star, Flame } from 'lucide-react';
import { ProgressBar } from './ui';

export const PathCard = ({ path, onTogglePrerequisite }) => {
  return (
    <div className={`bg-gradient-to-br ${path.color} p-6 rounded-lg border border-purple-800/30`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{path.icon}</span>
          <div>
            <h3 className="font-bold text-white">{path.name}</h3>
            <p className="text-sm opacity-75">{path.currentTitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Level {path.level}</span>
            <div className="px-2 py-1 bg-purple-500/20 rounded-full text-xs">
              Rank {path.rank}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-xs">{path.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2 mb-4">
        {path.prerequisites.map((prereq, index) => {
          const isWeekly = prereq.frequency === 'weekly';
          const progress = isWeekly ? path.weeklyProgress[index] || 0 : 0;
          const isComplete = isWeekly 
            ? progress >= prereq.timesPerWeek 
            : path.completedToday.includes(index);

          return (
            <div
              key={index}
              onClick={() => onTogglePrerequisite(path.id, index)}
              className={`flex items-center justify-between p-3 rounded cursor-pointer ${
                isComplete 
                  ? 'bg-green-500/20 border-green-500/50' 
                  : 'bg-black/20 hover:bg-black/30'
              } border transition-colors`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  isComplete ? 'bg-green-500 border-green-500' : 'border-gray-400'
                }`} />
                <div>
                  <div className="text-sm font-medium">{prereq.name}</div>
                  {isWeekly && (
                    <div className="text-xs text-gray-300">
                      {progress}/{prereq.timesPerWeek} times this week
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Star className="w-3 h-3" />
                <span>{prereq.xpReward} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round((path.completedToday.length / path.prerequisites.length) * 100)}%</span>
        </div>
        <ProgressBar 
          value={(path.completedToday.length / path.prerequisites.length) * 100} 
          max={100} 
          color="blue" 
        />
      </div>
    </div>
  );
};
