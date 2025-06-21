// src/components/Zero2OneApp.js - Part 1

import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Star, Flame } from 'lucide-react';
import { 
  RANKS, 
  XP_THRESHOLDS, 
  ATTRIBUTE_THRESHOLDS, 
  INITIAL_USER_STATS, 
  PATH_TEMPLATES 
} from '../constants';

const Zero2OneApp = () => {
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
  const [notifications, setNotifications] = useState([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [paths]);

  // Daily Reset Check
  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toISOString().split('T')[0];
      
      setPaths(prev => prev.map(path => {
        if (path.lastCompletionDate !== today) {
          return {
            ...path,
            completedToday: []
          };
        }
        return path;
      }));
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, []);

  // Weekly Reset Check
  useEffect(() => {
    const getWeekStart = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      return startDate.toISOString().split('T')[0];
    };

    const checkWeeklyReset = () => {
      const currentWeekStart = getWeekStart();
      
      setPaths(prev => prev.map(path => {
        if (path.weekStartDate !== currentWeekStart) {
          return {
            ...path,
            weeklyProgress: {},
            weekStartDate: currentWeekStart
          };
        }
        return path;
      }));
    };

    checkWeeklyReset();
    const interval = setInterval(checkWeeklyReset, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  // Utility Functions
  const calculateAttributeRank = (value) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (value >= ATTRIBUTE_THRESHOLDS[RANKS[i]]) {
        return RANKS[i];
      }
    }
    return 'E';
  };

  const calculateOverallRank = (attributes) => {
    const ranks = Object.values(attributes).map(value => calculateAttributeRank(value));
    const rankValues = ranks.map(rank => RANKS.indexOf(rank));
    const avgRankValue = rankValues.reduce((a, b) => a + b, 0) / rankValues.length;
    return RANKS[Math.round(avgRankValue)];
  };

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Path Management
  const createPath = (templateKey) => {
    const template = PATH_TEMPLATES[templateKey];
    if (!template) return;

    const newPath = {
      id: Date.now(),
      ...template,
      level: 1,
      completedToday: [],
      weeklyProgress: {},
      streak: 0,
      totalXP: 0,
      currentTitle: template.titles[0],
      mastery: 0,
      lastCompletionDate: null,
      weekStartDate: new Date().toISOString().split('T')[0]
    };

    setPaths(prev => [...prev, newPath]);
    setShowNewPath(false);
    addNotification(`Started new path: ${template.name}`);
  };

  // Task Completion
  const togglePrerequisite = (pathId, prereqIndex) => {
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;

      const prereq = path.prerequisites[prereqIndex];
      const today = new Date().toISOString().split('T')[0];
      const newCompletedToday = [...path.completedToday];
      const newWeeklyProgress = { ...path.weeklyProgress };

      if (prereq.frequency === 'weekly') {
        // Handle weekly prerequisites
        if (!newWeeklyProgress[prereqIndex]) {
          newWeeklyProgress[prereqIndex] = 0;
        }

        if (newWeeklyProgress[prereqIndex] < prereq.timesPerWeek) {
          newWeeklyProgress[prereqIndex]++;
          awardRewards(path, prereq);
          if (newWeeklyProgress[prereqIndex] === prereq.timesPerWeek) {
            addNotification(`Completed weekly goal: ${prereq.name}`);
          }
        }
      } else {
        // Handle daily prerequisites
        if (!newCompletedToday.includes(prereqIndex)) {
          newCompletedToday.push(prereqIndex);
          awardRewards(path, prereq);
          addNotification(`Completed: ${prereq.name}`);
        } else {
          newCompletedToday.splice(newCompletedToday.indexOf(prereqIndex), 1);
        }
      }

      return {
        ...path,
        completedToday: newCompletedToday,
        weeklyProgress: newWeeklyProgress,
        lastCompletionDate: today
      };
    }));
  };
  
  // src/components/Zero2OneApp.js - Part 2 (continuing from previous part)

  // Reward System
  const awardRewards = (path, prereq) => {
    setUserStats(prev => {
      const newXP = prev.xp + prereq.xpReward;
      const newAttributes = { ...prev.attributes };

      // Apply attribute rewards
      Object.entries(prereq.attributeRewards).forEach(([attr, value]) => {
        newAttributes[attr] += value;
      });

      // Apply path perk bonuses if applicable
      if (path.perk.includes('+10%')) {
        const attributeBonus = path.primaryAttribute;
        newAttributes[attributeBonus] += Math.floor(prereq.attributeRewards[attributeBonus] * 0.1);
      }

      // Calculate new ranks
      const newAttributeRanks = Object.entries(newAttributes).reduce((acc, [attr, value]) => {
        acc[attr] = calculateAttributeRank(value);
        return acc;
      }, {});

      const newOverallRank = calculateOverallRank(newAttributes);
      const previousRank = prev.overallRank;

      if (newOverallRank !== previousRank) {
        addNotification(`🎉 Ranked up to ${newOverallRank}!`);
      }

      return {
        ...prev,
        xp: newXP,
        attributes: newAttributes,
        attributeRanks: newAttributeRanks,
        overallRank: newOverallRank,
        xpToNext: XP_THRESHOLDS[RANKS[RANKS.indexOf(newOverallRank) + 1]] || XP_THRESHOLDS.SSS
      };
    });
  };

  // Render
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
                  Rank {userStats.overallRank}
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
                    <span>{paths.reduce((max, path) => Math.max(max, path.streak), 0)} day streak</span>
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

            {paths.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No active paths. Click "New Path" to begin your journey!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map(path => (
                  <div key={path.id} className={`bg-gradient-to-br ${path.color} p-6 rounded-lg border border-purple-800/30`}>
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

                    <div className="space-y-2 mb-4">
                      {path.prerequisites.map((prereq, index) => (
                        <div
                          key={index}
                          onClick={() => togglePrerequisite(path.id, index)}
                          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-all ${
                            prereq.frequency === 'weekly'
                              ? (path.weeklyProgress[index] || 0) >= prereq.timesPerWeek
                                ? 'bg-green-600/30 border-green-500/50'
                                : 'bg-black/20 border-gray-600/50 hover:bg-black/30'
                              : path.completedToday.includes(index)
                                ? 'bg-green-600/30 border-green-500/50'
                                : 'bg-black/20 border-gray-600/50 hover:bg-black/30'
                          } border`}
                        >
                          <div className={`w-4 h-4 rounded border-2 ${
                            prereq.frequency === 'weekly'
                              ? (path.weeklyProgress[index] || 0) >= prereq.timesPerWeek
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-500'
                              : path.completedToday.includes(index)
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-500'
                          }`}>
                            {((prereq.frequency === 'weekly' && (path.weeklyProgress[index] || 0) >= prereq.timesPerWeek) ||
                              (prereq.frequency === 'daily' && path.completedToday.includes(index))) && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm">{prereq.name}</span>
                            {prereq.frequency === 'weekly' && (
                              <span className="text-xs ml-2 opacity-75">
                                ({path.weeklyProgress[index] || 0}/{prereq.timesPerWeek})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(userStats.attributes).map(([attr, value]) => (
              <div key={attr} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="capitalize font-medium">{attr}</div>
                  <div className="text-sm">Rank {userStats.attributeRanks[attr]}</div>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(value / ATTRIBUTE_THRESHOLDS[userStats.attributeRanks[attr]]) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Path Modal */}
      {showNewPath && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Choose Your Path</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(PATH_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => createPath(key)}
                  className="p-4 border border-gray-700 rounded-lg hover:border-purple-500 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className="font-medium">{template.name}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.attributes.map(attr => (
                      <span 
                        key={attr}
                        className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewPath(false)}
              className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
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

export default Zero2OneApp;
