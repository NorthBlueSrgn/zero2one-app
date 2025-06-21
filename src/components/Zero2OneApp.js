import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Star, Flame, Trash, Settings } from 'lucide-react';

// Constants for progression system
const RANK_PROGRESSION = {
  'E': { required: 0, daysToComplete: 0 },
  'D': { required: 600, daysToComplete: 60 }, // 2 months
  'C': { required: 1500, daysToComplete: 90 }, // 3 months
  'B': { required: 3000, daysToComplete: 90 }, // 3 months
  'A': { required: 5000, daysToComplete: 120 }, // 4 months
  'S': { required: 8000, daysToComplete: 150 }, // 5 months
  'SS': { required: 12000, daysToComplete: 150 }, // 5 months
  'SSS': { required: 17000, daysToComplete: 150 }, // 5 months
};

const INITIAL_USER_STATS = {
  rank: 'E',
  xp: 0,
  xpToNext: RANK_PROGRESSION['D'].required,
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
  streakDays: 0,
  totalTitles: 0,
  startDate: new Date().toISOString(),
  statistics: {
    tasksCompleted: 0,
    pathsCreated: 0,
    longestStreak: 0,
    totalXPGained: 0
  }
};

const Zero2OneApp = () => {
  // Enhanced State Management
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
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : {
      dailyResetTime: "00:00",
      weeklyResetDay: 1, // Monday
      notificationsEnabled: true,
      theme: 'dark'
    };
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('paths', JSON.stringify(paths));
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [userStats, paths, settings]);

  // Task Reset System
  const checkTaskResets = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentWeekStart = getWeekStart(now);

    setPaths(prevPaths => prevPaths.map(path => {
      let updated = { ...path };

      // Daily reset
      if (path.lastDailyReset !== today) {
        updated.dailyTasks = updated.dailyTasks.map(task => ({
          ...task,
          completed: false,
          completedAt: null
        }));
        updated.lastDailyReset = today;
      }

      // Weekly reset
      if (path.lastWeeklyReset !== currentWeekStart) {
        updated.weeklyTasks = updated.weeklyTasks.map(task => ({
          ...task,
          completedCount: 0,
          lastCompleted: null
        }));
        updated.lastWeeklyReset = currentWeekStart;
      }

      return updated;
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(checkTaskResets, 60000); // Check every minute
    checkTaskResets(); // Initial check
    return () => clearInterval(interval);
  }, [checkTaskResets]);

  // XP and Progression System
  const calculateXPGain = useCallback((task, path) => {
    const baseXP = task.xpReward;
    const streakBonus = Math.min(path.streak * 0.1, 0.5); // Max 50% bonus
    const levelBonus = path.level * 0.05; // 5% per level
    return Math.round(baseXP * (1 + streakBonus + levelBonus));
  }, []);

  const updateProgression = useCallback((xpGain, attributeGains) => {
    setUserStats(prev => {
      const newXP = prev.xp + xpGain;
      const newAttributes = { ...prev.attributes };
      const newAttributeRanks = { ...prev.attributeRanks };

      // Update attributes and their ranks
      Object.entries(attributeGains).forEach(([attr, gain]) => {
        newAttributes[attr] += gain;
        newAttributeRanks[attr] = calculateAttributeRank(newAttributes[attr]);
      });

      // Calculate new rank
      const daysSinceStart = Math.floor(
        (new Date().getTime() - new Date(prev.startDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      let newRank = 'E';
      for (const [rank, requirements] of Object.entries(RANK_PROGRESSION)) {
        if (newXP >= requirements.required && daysSinceStart >= requirements.daysToComplete) {
          newRank = rank;
        }
      }

      return {
        ...prev,
        xp: newXP,
        rank: newRank,
        attributes: newAttributes,
        attributeRanks: newAttributeRanks,
        xpToNext: RANK_PROGRESSION[getNextRank(newRank)].required,
        statistics: {
          ...prev.statistics,
          totalXPGained: prev.statistics.totalXPGained + xpGain
        }
      };
    });
  }, []);

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
      currentTitle: template.titles[0],
      progress: {
        titleProgress: 0,
        levelProgress: 0
      }
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
  }, []);

  const removePath = useCallback((pathId) => {
    setPaths(prev => prev.filter(path => path.id !== pathId));
    addNotification('Path removed successfully');
  }, []);

  // Task Completion System
  const completeTask = useCallback((pathId, taskId, taskType) => {
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;

      const tasks = taskType === 'daily' ? path.dailyTasks : path.weeklyTasks;
      const task = tasks.find(t => t.id === taskId);
      if (!task) return path;

      let updatedTasks;
      if (taskType === 'daily') {
        updatedTasks = tasks.map(t => 
          t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
        );
      } else {
        updatedTasks = tasks.map(t =>
          t.id === taskId ? { 
            ...t, 
            completedCount: Math.min((t.completedCount || 0) + 1, t.frequency || 1),
            lastCompleted: new Date().toISOString()
          } : t
        );
      }

      const xpGain = calculateXPGain(task, path);
      updateProgression(xpGain, task.attributeRewards);

      return {
        ...path,
        [taskType === 'daily' ? 'dailyTasks' : 'weeklyTasks']: updatedTasks,
        experience: path.experience + xpGain,
        streak: calculateNewStreak(path, taskType === 'daily')
      };
    }));
  }, [calculateXPGain, updateProgression]);

  // Notification System
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // UI Components
  const TaskItem = ({ task, type, onComplete, progress, target }) => (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
        type === 'daily' 
          ? task.completed ? 'bg-green-600/30' : 'bg-gray-800/50 hover:bg-gray-700/50'
          : (task.completedCount >= (task.frequency || 1)) ? 'bg-green-600/30' : 'bg-gray-800/50 hover:bg-gray-700/50'
      }`}
    >
      <button 
        onClick={() => onComplete()}
        className={`w-5 h-5 rounded-full border-2 transition-all ${
          type === 'daily'
            ? task.completed ? 'bg-green-500 border-green-500' : 'border-gray-500'
            : (task.completedCount >= (task.frequency || 1)) ? 'bg-green-500 border-green-500' : 'border-gray-500'
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

  const PathCard = ({ path, onRemove }) => (
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
                progress={task.completedCount}
                target={task.frequency}
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

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/50 backdrop-blur sticky top-0 z-30">
        {/* Your existing header code */}
      </header>

      {/* Navigation */}
      <nav className="bg-black/30 sticky top-16 z-20 backdrop-blur">
        {/* Your existing navigation code */}
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'paths' && (
          <div className="space-y-6">
            {/* Paths section code */}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Stats section code */}
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="space-y-6">
            {/* Evolution section code */}
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
            className={`px-4 py-2 rounded-lg shadow-lg animate-slide-up ${
              notification.type === 'error' ? 'bg-red-600' : 'bg-purple-600'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Zero2OneApp;


