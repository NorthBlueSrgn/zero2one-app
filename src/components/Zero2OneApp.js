// src/components/Zero2OneApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Star, Flame, Trash, Settings } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { PathCard } from './PathCard';
import { NewPathModal } from './NewPathModal';
import { CustomPathModal } from './CustomPathModal';
import { useTaskReset } from '../hooks/useTaskReset';
import { useNotifications } from '../hooks/useNotifications';
import { 
  RANKS, 
  RANK_REQUIREMENTS, 
  INITIAL_USER_STATS, 
  PATH_TEMPLATES,
  ATTRIBUTES,
  calculateAttributeRank,
  getNextRank
} from '../constants';

export const Zero2OneApp = () => {
  // Core State Management
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : INITIAL_USER_STATS;
  });

  const [paths, setPaths] = useState(() => {
    const saved = localStorage.getItem('paths');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('paths');
  const [showNewPath, setShowNewPath] = useState(false);
  const [showCustomPath, setShowCustomPath] = useState(false);
  const { notifications, addNotification } = useNotifications();

  // Task Reset Hook
  useTaskReset(setPaths);

  // Persistence
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [userStats, paths]);

  // XP and Progression System
  const calculateXPGain = useCallback((task, path) => {
    const baseXP = task.xpReward;
    const streakBonus = Math.min(path.streak * 0.1, 0.5); // Max 50% bonus
    const levelBonus = path.level * 0.05; // 5% per level
    return Math.round(baseXP * (1 + streakBonus + levelBonus));
  }, []);

  const updateProgression = useCallback((xpGain, attributeGains, pathId) => {
    setUserStats(prev => {
      const newXP = prev.xp + xpGain;
      const newAttributes = { ...prev.attributes };
      const newAttributeRanks = { ...prev.attributeRanks };

      // Update attributes and their ranks
      Object.entries(attributeGains).forEach(([attr, gain]) => {
        newAttributes[attr] += gain;
        newAttributeRanks[attr] = calculateAttributeRank(newAttributes[attr]);
      });

      // Calculate new rank based on XP and time
      const daysSinceStart = Math.floor(
        (new Date().getTime() - new Date(prev.startDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      let newRank = 'E';
      for (const [rank, requirements] of Object.entries(RANK_REQUIREMENTS)) {
        if (newXP >= requirements.xp && daysSinceStart >= requirements.daysRequired) {
          newRank = rank;
        }
      }

      // Check for rank up
      if (newRank !== prev.rank) {
        addNotification(`Ranked up to ${newRank}! 🎉`);
      }

      return {
        ...prev,
        xp: newXP,
        rank: newRank,
        attributes: newAttributes,
        attributeRanks: newAttributeRanks,
        xpToNext: RANK_REQUIREMENTS[getNextRank(newRank)].xp,
        statistics: {
          ...prev.statistics,
          totalXPGained: prev.statistics.totalXPGained + xpGain,
          tasksCompleted: prev.statistics.tasksCompleted + 1
        }
      };
    });

    // Update path progression
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;

      const newExperience = path.experience + xpGain;
      const experienceForLevel = path.level * 100;
      let newLevel = path.level;
      let remainingExp = newExperience;

      // Level up check
      while (remainingExp >= experienceForLevel) {
        newLevel++;
        remainingExp -= experienceForLevel;
        addNotification(`${path.name} reached level ${newLevel}! 🆙`);
      }

      // Title progression
      const titleIndex = Math.floor((newLevel - 1) / 5);
      const newTitle = path.titles[Math.min(titleIndex, path.titles.length - 1)];

      if (newTitle !== path.currentTitle) {
        addNotification(`New title achieved: ${newTitle}! 🏆`);
      }

      return {
        ...path,
        level: newLevel,
        experience: remainingExp,
        currentTitle: newTitle
      };
    }));
  }, [addNotification]);

  // Path Management
  const createPath = useCallback((template) => {
    const newPath = {
      id: Date.now(),
      ...template,
      level: 1,
      experience: 0,
      streak: 0,
      dailyTasks: template.dailyTasks.map(task => ({
        ...task,
        completed: false,
        completedAt: null
      })),
      weeklyTasks: template.weeklyTasks.map(task => ({
        ...task,
        completedCount: 0,
        lastCompleted: null
      })),
      lastDailyReset: new Date().toISOString().split('T')[0],
      lastWeeklyReset: getWeekStart(new Date()),
      currentTitle: template.titles[0]
    };

    setPaths(prev => [...prev, newPath]);
    setUserStats(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        pathsCreated: prev.statistics.pathsCreated + 1
      }
    }));
    addNotification(`Started new path: ${template.name}`);
    setShowNewPath(false);
  }, [addNotification]);

  const removePath = useCallback((pathId) => {
    setPaths(prev => prev.filter(path => path.id !== pathId));
    addNotification('Path removed successfully');
  }, [addNotification]);

  // Task Completion
  const completeTask = useCallback((pathId, taskId, taskType) => {
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;

      const tasks = taskType === 'daily' ? 'dailyTasks' : 'weeklyTasks';
      const taskIndex = path[tasks].findIndex(t => t.id === taskId);
      if (taskIndex === -1) return path;

      const task = path[tasks][taskIndex];
      const updatedTasks = [...path[tasks]];

      if (taskType === 'daily') {
        if (!task.completed) {
          updatedTasks[taskIndex] = {
            ...task,
            completed: true,
            completedAt: new Date().toISOString()
          };
          const xpGain = calculateXPGain(task, path);
          updateProgression(xpGain, task.attributeRewards, pathId);
        }
      } else {
        if ((task.completedCount || 0) < (task.frequency || 1)) {
          updatedTasks[taskIndex] = {
            ...task,
            completedCount: (task.completedCount || 0) + 1,
            lastCompleted: new Date().toISOString()
          };
          const xpGain = calculateXPGain(task, path);
          updateProgression(xpGain, task.attributeRewards, pathId);
        }
      }

      return {
        ...path,
        [tasks]: updatedTasks,
        streak: calculateNewStreak(path, updatedTasks)
      };
    }));
  }, [calculateXPGain, updateProgression]);

    // UI Components
  const RadarChart = ({ attributes }) => {
    const maxValue = Math.max(...Object.values(attributes));
    const normalizedValues = Object.entries(attributes).map(([key, value]) => ({
      name: key,
      value: (value / maxValue) * 100
    }));

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background circles */}
          {[20, 40, 60, 80].map(radius => (
            <circle
              key={radius}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(139, 69, 193, 0.2)"
              strokeWidth="1"
            />
          ))}
          
          {/* Radar lines */}
          {normalizedValues.map((_, index) => {
            const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
            const x = 100 + Math.cos(angle) * 80;
            const y = 100 + Math.sin(angle) * 80;
            return (
              <line
                key={index}
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="rgba(139, 69, 193, 0.3)"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Data polygon */}
          <polygon
            points={normalizedValues.map((item, index) => {
              const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
              const radius = (item.value / 100) * 80;
              const x = 100 + Math.cos(angle) * radius;
              const y = 100 + Math.sin(angle) * radius;
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(139, 69, 193, 0.3)"
            stroke="rgb(139, 69, 193)"
            strokeWidth="2"
          />
          
          {/* Labels */}
          {normalizedValues.map((item, index) => {
            const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
            const x = 100 + Math.cos(angle) * 95;
            const y = 100 + Math.sin(angle) * 95;
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-purple-300 font-medium"
              >
                {item.name.charAt(0).toUpperCase()}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Zero2One
              </h1>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-purple-800/50 rounded-full font-bold">
                  Rank {userStats.rank}
                </div>
                <div className="text-sm text-purple-300">
                  {userStats.xp}/{userStats.xpToNext} XP
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-black/30 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{userStats.statistics.longestStreak} day streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/30 sticky top-16 z-20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex space-x-4">
            {['paths', 'stats', 'evolution'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'paths' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Paths</h2>
              <button
                onClick={() => setShowNewPath(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Path</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paths.map(path => (
                <PathCard
                  key={path.id}
                  path={path}
                  onRemove={removePath}
                  onCompleteTask={completeTask}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Attribute Distribution</h3>
                <RadarChart attributes={userStats.attributes} />
              </div>

              {/* Attribute Details */}
              <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Attributes</h3>
                <div className="space-y-3">
                  {Object.entries(userStats.attributes).map(([attr, value]) => {
                    const Icon = ATTRIBUTES[attr].icon;
                    return (
                      <div key={attr} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ATTRIBUTES[attr].color}`}>
                            {Icon}
                          </div>
                          <span className="capitalize font-medium">{attr}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${(value / RANK_REQUIREMENTS[userStats.attributeRanks[attr]].xp) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold w-8 text-right">{value}</span>
                          <span className="text-sm font-bold w-6 text-right">{userStats.attributeRanks[attr]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Progress Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(userStats.statistics).map(([key, value]) => (
                  <div key={key} className="bg-black/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-2xl font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Rank Evolution</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {RANKS.map((rank, index) => (
                    <div
                      key={rank}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                        rank === userStats.rank
                          ? 'border-purple-500 bg-purple-500 text-white'
                          : RANKS.indexOf(userStats.rank) > index
                          ? 'border-green-500 bg-green-500/20 text-green-300'
                          : 'border-gray-600 text-gray-500'
                      }`}
                    >
                      {rank}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Next rank requirements:
                <ul className="mt-2 space-y-1">
                  <li>• XP: {userStats.xpToNext - userStats.xp} more needed</li>
                  <li>• Time: {Math.max(0, RANK_REQUIREMENTS[getNextRank(userStats.rank)].daysRequired - getDaysSinceStart(userStats.startDate))} days remaining</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewPath && (
        <NewPathModal
          onClose={() => setShowNewPath(false)}
          onCreatePath={createPath}
          onCustomPath={() => {
            setShowNewPath(false);
            setShowCustomPath(true);
          }}
        />
      )}

      {showCustomPath && (
        <CustomPathModal
          onClose={() => setShowCustomPath(false)}
          onCreate={createPath}
        />
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up"
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

// Utility functions
const getWeekStart = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
};

const getDaysSinceStart = (startDate) => {
  return Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
};

const calculateNewStreak = (path, tasks) => {
  const today = new Date().toISOString().split('T')[0];
  if (path.lastDailyReset !== today) return 0;
  
  const allTasksCompleted = tasks.every(task => 
    task.completed || (task.completedCount && task.completedCount >= (task.frequency || 1))
  );
  
  return allTasksCompleted ? path.streak + 1 : 0;
};

export default Zero2OneApp;


