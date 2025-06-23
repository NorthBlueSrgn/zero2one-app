// src/components/Zero2OneApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Trophy, Zap, Brain, Heart, 
  Dumbbell, Palette, Shield, Star, 
  Flame, Trash, ChevronRight 
} from 'lucide-react';
import { CustomPathModal } from './CustomPathModal';
import { NewPathModal } from './NewPathModal';
import { TaskItem } from './TaskItem';

// Constants for progression
const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
const RANK_REQUIREMENTS = {
  'E': { xp: 0, daysRequired: 0 },
  'D': { xp: 600, daysRequired: 60 }, // 2 months
  'C': { xp: 1500, daysRequired: 90 }, // 3 months
  'B': { xp: 3000, daysRequired: 90 }, // 3 months
  'A': { xp: 5000, daysRequired: 120 }, // 4 months
  'S': { xp: 8000, daysRequired: 150 }, // 5 months
  'SS': { xp: 12000, daysRequired: 150 }, // 5 months
  'SSS': { xp: 17000, daysRequired: 150 } // 5 months
};

const INITIAL_USER_STATS = {
  rank: 'E',
  xp: 0,
  xpToNext: 600, // XP needed for rank D
  attributes: {
    spiritual: 0,
    health: 0,
    intelligence: 0,
    physical: 0,
    creativity: 0,
    resilience: 0
  },
  attributeRanks: {
    spiritual: 'E',
    health: 'E',
    intelligence: 'E',
    physical: 'E',
    creativity: 'E',
    resilience: 'E'
  },
  startDate: new Date().toISOString(),
  statistics: {
    tasksCompleted: 0,
    pathsCreated: 0,
    longestStreak: 0,
    totalXPGained: 0
  }
};

export const Zero2OneApp = () => {
  // Core State
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
  const [notifications, setNotifications] = useState([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [userStats, paths]);

  // Task Reset System
  useEffect(() => {
    const checkResets = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentWeekStart = getWeekStart(now);

      setPaths(prevPaths => prevPaths.map(path => {
        let updated = { ...path };

        // Daily reset
        if (path.lastDailyReset !== today) {
          updated.dailyTasks = updated.dailyTasks.map(task => ({
            ...task,
            completed: false
          }));
          updated.lastDailyReset = today;
        }

        // Weekly reset
        if (path.lastWeeklyReset !== currentWeekStart) {
          updated.weeklyTasks = updated.weeklyTasks.map(task => ({
            ...task,
            completedCount: 0
          }));
          updated.lastWeeklyReset = currentWeekStart;
        }

        return updated;
      }));
    };

    const interval = setInterval(checkResets, 60000); // Check every minute
    checkResets(); // Initial check
    return () => clearInterval(interval);
  }, []);

  // Notification System
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Progression System
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
      const daysSinceStart = getDaysSinceStart(prev.startDate);

      // Update attributes
      Object.entries(attributeGains).forEach(([attr, gain]) => {
        newAttributes[attr] += gain;
        // Calculate new rank for each attribute
        for (const rank of [...RANKS].reverse()) {
          if (newAttributes[attr] >= RANK_REQUIREMENTS[rank].xp && 
              daysSinceStart >= RANK_REQUIREMENTS[rank].daysRequired) {
            newAttributeRanks[attr] = rank;
            break;
          }
        }
      });

      // Calculate overall rank
      let newRank = 'E';
      for (const rank of [...RANKS].reverse()) {
        if (newXP >= RANK_REQUIREMENTS[rank].xp && 
            daysSinceStart >= RANK_REQUIREMENTS[rank].daysRequired) {
          newRank = rank;
          break;
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
          tasksCompleted: prev.statistics.tasksCompleted + 1,
          totalXPGained: prev.statistics.totalXPGained + xpGain
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
        completed: false
      })),
      weeklyTasks: template.weeklyTasks.map(task => ({
        ...task,
        completedCount: 0
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

      const newStreak = calculateNewStreak(path, updatedTasks);
      if (newStreak > path.streak) {
        addNotification(`${path.name} streak: ${newStreak} days! 🔥`);
      }

      return {
        ...path,
        [tasks]: updatedTasks,
        streak: newStreak
      };
    }));
  }, [calculateXPGain, updateProgression, addNotification]);

  // UI Components
  const PathCard = ({ path }) => (
    <div className={`bg-gradient-to-br ${path.color} p-6 rounded-lg border border-purple-800/30`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{path.icon}</span>
          <div>
            <h3 className="font-bold">{path.name}</h3>
            <p className="text-sm opacity-75">Level {path.level} • {path.currentTitle}</p>
          </div>
        </div>
        <button 
          onClick={() => removePath(path.id)}
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
                onComplete={() => completeTask(path.id, task.id, 'daily')}
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
                onComplete={() => completeTask(path.id, task.id, 'weekly')}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Level {path.level + 1}</span>
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

  const RadarChart = ({ attributes }) => {
    const maxValue = Math.max(...Object.values(attributes));
    const normalizedValues = Object.entries(attributes).map(([key, value]) => ({
      name: key,
      value: (value / maxValue) * 100
    }));

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
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

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm">
                  {paths.reduce((max, path) => Math.max(max, path.streak), 0)} day streak
                </span>
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
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Attribute Distribution</h3>
                <RadarChart attributes={userStats.attributes} />
              </div>

              <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(userStats.statistics).map(([key, value]) => (
                    <div key={key} className="bg-black/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-2xl font-bold">{value}</div>
                    </div>
                  ))}
                </div>
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

const getNextRank = (currentRank) => {
  const currentIndex = RANKS.indexOf(currentRank);
  return currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : currentRank;
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

